/**
 * Jamf Pro client + webhook signature verification.
 *
 * Jamf signs outgoing webhooks with HMAC-SHA256(secret, body) and ships the
 * digest in the `Jamf-Webhook-Signature` header. We verify in constant time.
 *
 * Polling fallback hits /JSSResource/computers — list and diff.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { fetch } from 'undici';
import { logger } from '../logger.js';
import { config } from '../config.js';
import type { RawSignal } from '../types.js';

/**
 * Constant-time HMAC compare. Returns true if the signature on the body
 * matches the configured shared secret.
 */
export function verifyJamfSignature(rawBody: Buffer, signature: string | undefined): boolean {
  if (!signature || !config.JAMF_WEBHOOK_SECRET) return false;
  const expected = createHmac('sha256', config.JAMF_WEBHOOK_SECRET).update(rawBody).digest('hex');
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(signature.replace(/^sha256=/, ''), 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

interface JamfComputerEvent {
  event: { computer?: { serialNumber?: string; udid?: string; name?: string; macAddress?: string }; username?: string; assignedUser?: string };
  webhook: { name: string; eventName: string };
}

export function normaliseJamfEvent(payload: JamfComputerEvent, tenantId: string): RawSignal | null {
  const comp = payload.event.computer;
  const userEmail = payload.event.assignedUser ?? payload.event.username;
  if (!comp || !userEmail || !comp.udid) return null;
  return {
    id:         `jamf-${comp.udid}-${Date.now()}`,
    providerId: 'jamf',
    tenantId,
    userEmail,
    device: {
      providerDeviceId: comp.udid,
      ...(comp.serialNumber ? { serial: comp.serialNumber } : {}),
      ...(comp.name         ? { hostname: comp.name }       : {}),
      observedAt: new Date().toISOString(),
    },
    kind:       'primary-user-changed',
    receivedAt: new Date().toISOString(),
    rawPayload: payload,
  };
}

export async function pollJamfComputers(tenantId: string, host: string, username: string, password: string): Promise<RawSignal[]> {
  // Production: page through /api/v1/computers-inventory and diff.
  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  try {
    const res = await fetch(`${host.replace(/\/$/, '')}/api/v1/computers-inventory?section=GENERAL,USER_AND_LOCATION&page-size=100`, {
      headers: { authorization: `Basic ${auth}` },
    });
    if (!res.ok) {
      logger.warn({ status: res.status, tenantId }, 'jamf list failed');
      return [];
    }
    // Real implementation would shape the response into RawSignal[].
    return [];
  } catch (err) {
    logger.error({ err, tenantId }, 'jamf poll failed');
    return [];
  }
}
