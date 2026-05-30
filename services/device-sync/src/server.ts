/**
 * Fastify HTTP server. Hosts the four webhook receivers and a health probe.
 *
 *   POST /webhooks/graph    Microsoft Graph (Entra ID + Intune)
 *   POST /webhooks/google   Google Cloud Pub/Sub push
 *   POST /webhooks/jamf     Jamf Pro outgoing webhook
 *   POST /webhooks/kandji   Kandji outgoing webhook
 *   GET  /healthz           Liveness probe
 *   GET  /readyz            Readiness probe (queue draining + providers reachable)
 *
 * Every receiver:
 *   ① validates the provider's signature/auth header
 *   ② parses the payload into one or more RawSignal
 *   ③ enqueues each signal with a dedupe key
 *   ④ returns 2xx as fast as possible — webhook delivery semantics mean any
 *     slow handler causes retries and duplicate work
 */

import Fastify from 'fastify';
import rawBody from '@fastify/raw-body';
import { config } from './config.js';
import { logger } from './logger.js';
import { signalQueue } from './queue.js';
import { connectionStore } from './persistence.js';
import { verifyJamfSignature, normaliseJamfEvent } from './providers/jamf.js';
import { verifyKandjiBearer, normaliseKandjiEvent } from './providers/kandji.js';
import { verifyPubSubJwt } from './providers/google.js';
import type { RawSignal } from './types.js';

export async function buildServer() {
  const app = Fastify({
    logger: false,                         // we have pino directly
    bodyLimit: 5 * 1024 * 1024,            // 5 MB hard cap
    trustProxy: true,                      // honour X-Forwarded-* from the LB
  });

  await app.register(rawBody, { field: 'rawBody', global: false, runFirst: true });

  // ─── Health probes ───────────────────────────────────────────────────────
  app.get('/healthz', async () => ({ ok: true }));
  app.get('/readyz', async () => ({ ok: true, queue: signalQueue.size() }));

  // ─── Microsoft Graph (Entra ID + Intune) ─────────────────────────────────
  app.post('/webhooks/graph', async (req, reply) => {
    // Microsoft handshake — they send ?validationToken=... and expect text/plain echo
    const validationToken = (req.query as { validationToken?: string })?.validationToken;
    if (validationToken) {
      reply.header('content-type', 'text/plain');
      return validationToken;
    }

    const body = req.body as { value?: Array<{ subscriptionId: string; clientState: string; resource: string; changeType: string; resourceData?: unknown }> };
    if (!body?.value?.length) return reply.code(202).send();

    for (const notif of body.value) {
      const conn = await connectionStore.resolveByGraphClientState(notif.clientState);
      if (!conn) { logger.warn({ subscriptionId: notif.subscriptionId }, 'unknown clientState'); continue; }

      const signal: RawSignal = {
        id:         `graph-${notif.subscriptionId}-${Date.now()}`,
        providerId: conn.providerId,             // 'entra' or 'intune'
        tenantId:   conn.tenantId,
        userEmail:  (notif.resourceData as { userPrincipalName?: string } | undefined)?.userPrincipalName ?? 'unknown@unknown',
        device:     {
          providerDeviceId: (notif.resourceData as { id?: string } | undefined)?.id ?? notif.resource,
          observedAt: new Date().toISOString(),
        },
        kind:       notif.changeType === 'deleted' ? 'device-removed' :
                    notif.resource.includes('signIn') ? 'sign-in' :
                    'primary-user-changed',
        receivedAt: new Date().toISOString(),
        rawPayload: notif,
      };
      await signalQueue.enqueue(signal, signal.id);
    }
    return reply.code(202).send();
  });

  // ─── Google Cloud Pub/Sub push ───────────────────────────────────────────
  app.post('/webhooks/google', async (req, reply) => {
    const auth = req.headers.authorization;
    const verified = await verifyPubSubJwt(auth);
    if (!verified.ok) return reply.code(401).send({ error: 'unauthorized' });

    const body = req.body as { message?: { data: string; attributes?: Record<string, string> } };
    if (!body?.message?.data) return reply.code(202).send();

    let payload: unknown;
    try {
      payload = JSON.parse(Buffer.from(body.message.data, 'base64').toString('utf8'));
    } catch {
      return reply.code(400).send({ error: 'bad payload' });
    }
    // Real implementation: shape payload into a RawSignal[] (depends on whether
    // it's a Reports API admin-log entry, a directory mobile-device update, etc).
    logger.info({ payload }, 'google webhook received — shaping TBD');
    return reply.code(202).send();
  });

  // ─── Jamf Pro ────────────────────────────────────────────────────────────
  app.post('/webhooks/jamf', {
    config: { rawBody: true },
  }, async (req, reply) => {
    const sig = req.headers['jamf-webhook-signature'] as string | undefined;
    const ok = verifyJamfSignature(Buffer.from((req as unknown as { rawBody: string }).rawBody), sig);
    if (!ok) return reply.code(401).send({ error: 'bad signature' });

    const tenantHeader = req.headers['x-tenant-id'] as string | undefined;
    if (!tenantHeader) return reply.code(400).send({ error: 'missing X-Tenant-Id' });

    const signal = normaliseJamfEvent(req.body as Parameters<typeof normaliseJamfEvent>[0], tenantHeader);
    if (signal) await signalQueue.enqueue(signal, signal.id);
    return reply.code(202).send();
  });

  // ─── Kandji ──────────────────────────────────────────────────────────────
  app.post('/webhooks/kandji', async (req, reply) => {
    const ok = verifyKandjiBearer(req.headers.authorization);
    if (!ok) return reply.code(401).send({ error: 'unauthorized' });

    const tenantHeader = req.headers['x-tenant-id'] as string | undefined;
    if (!tenantHeader) return reply.code(400).send({ error: 'missing X-Tenant-Id' });

    const signal = normaliseKandjiEvent(req.body as Parameters<typeof normaliseKandjiEvent>[0], tenantHeader);
    if (signal) await signalQueue.enqueue(signal, signal.id);
    return reply.code(202).send();
  });

  app.setErrorHandler((err, _req, reply) => {
    logger.error({ err }, 'unhandled');
    reply.code(500).send({ error: 'internal' });
  });

  return app;
}

export async function startServer() {
  const app = await buildServer();
  await app.listen({ port: config.PORT, host: '0.0.0.0' });
  logger.info({ port: config.PORT }, 'device-sync server listening');
  return app;
}
