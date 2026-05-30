/**
 * The reconciliation worker.
 *
 *   1. Consume RawSignal from the queue
 *   2. Resolve the tenant's connection config
 *   3. Look up the user's currently-assigned asset
 *   4. Diff the device fingerprint
 *   5. Apply the connection's policy:
 *        • require-approval → create inbox entry, notify recipients
 *        • auto-approve     → update asset register straight away
 *        • ignore           → audit-only
 *
 * Every branch writes an audit-log entry so there's never a silent decision.
 */

import { logger } from './logger.js';
import { signalQueue } from './queue.js';
import { auditLog, connectionStore, assetRegister, inbox } from './persistence.js';
import type { ReconciliationOutcome, RawSignal } from './types.js';

function sameDevice(a: { providerDeviceId?: string; serial?: string }, b: { providerDeviceId: string; serial?: string }) {
  if (a.providerDeviceId && a.providerDeviceId === b.providerDeviceId) return true;
  if (a.serial && b.serial && a.serial === b.serial) return true;
  return false;
}

export async function reconcile(signal: RawSignal): Promise<ReconciliationOutcome> {
  const connections = await connectionStore.listForProvider(signal.providerId);
  const conn = connections.find((c) => c.tenantId === signal.tenantId);

  if (!conn) {
    logger.debug({ signal }, 'no connection for tenant — dropping');
    return { signalId: signal.id, tenantId: signal.tenantId, decision: 'ignored-by-policy', notes: 'no connection' };
  }
  if (!conn.enabledSignals.includes(signal.kind)) {
    return { signalId: signal.id, tenantId: signal.tenantId, decision: 'ignored-by-policy', notes: `signal ${signal.kind} disabled` };
  }

  const currentAsset = await assetRegister.findByUser(signal.tenantId, signal.userEmail);

  const currentFp = currentAsset
    ? { providerDeviceId: currentAsset.providerDeviceIds[signal.providerId], serial: currentAsset.serial }
    : { providerDeviceId: undefined, serial: undefined };

  if (sameDevice(currentFp, signal.device)) {
    return { signalId: signal.id, tenantId: signal.tenantId, decision: 'no-change' };
  }

  if (conn.policy === 'ignore') {
    await auditLog.write({
      tenantId: signal.tenantId, actor: 'device-sync-worker',
      action: 'reconciliation.ignored', signalId: signal.id,
      details: { reason: 'policy=ignore', user: signal.userEmail, newDevice: signal.device },
      createdAt: new Date().toISOString(),
    });
    return { signalId: signal.id, tenantId: signal.tenantId, decision: 'ignored-by-policy', notes: 'policy=ignore' };
  }

  if (conn.policy === 'auto-approve') {
    const next = await assetRegister.upsertReassignment(currentAsset?.id ?? null, {
      tenantId:           signal.tenantId,
      assignedUserEmail:  signal.userEmail,
      providerDeviceIds:  { [signal.providerId]: signal.device.providerDeviceId },
      ...(signal.device.serial   ? { serial:   signal.device.serial   } : {}),
      ...(signal.device.hostname ? { hostname: signal.device.hostname } : {}),
      ...(signal.device.model    ? { model:    signal.device.model    } : {}),
      status: 'deployed',
    });
    await auditLog.write({
      tenantId: signal.tenantId, actor: 'device-sync-worker',
      action: 'reconciliation.auto-approved', signalId: signal.id,
      details: { oldAssetId: currentAsset?.id ?? null, newAssetId: next.id, fingerprint: signal.device },
      createdAt: new Date().toISOString(),
    });
    return {
      signalId: signal.id, tenantId: signal.tenantId, decision: 'auto-approved',
      ...(currentAsset?.id ? { assetIdBefore: currentAsset.id } : {}),
      assetIdAfter: next.id,
    };
  }

  // require-approval — drop into the inbox for human decision
  const entry = await inbox.createPendingEntry({ tenantId: signal.tenantId, signal, currentAsset });
  await auditLog.write({
    tenantId: signal.tenantId, actor: 'device-sync-worker',
    action: 'reconciliation.inbox-created', signalId: signal.id,
    details: { inboxEntryId: entry.id, currentAssetId: currentAsset?.id ?? null, fingerprint: signal.device },
    createdAt: new Date().toISOString(),
  });
  return { signalId: signal.id, tenantId: signal.tenantId, decision: 'inbox-entry-created', inboxEntryId: entry.id };
}

export function startReconciler() {
  signalQueue.subscribe(async (job) => {
    try {
      const outcome = await reconcile(job);
      logger.info({ outcome }, 'reconciled');
    } catch (err) {
      logger.error({ err, jobId: job.id }, 'reconcile failed');
    }
  });
  logger.info('reconciler started');
}
