/**
 * Pending-operation queue — stores offline mutations in IndexedDB and
 * replays them when connectivity returns.
 */

import { idbGetAll, idbPut, idbDelete } from './idb';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PendingOpType =
  | 'ticket_reply'
  | 'ticket_status'
  | 'ticket_assign'
  | 'ticket_priority'
  | 'ticket_create'
  | 'asset_update';

export interface PendingOp {
  /** Auto-assigned by IDB */
  id?: number;
  type: PendingOpType;
  /** Human-readable description shown in the UI */
  label: string;
  /** Unique key for deduplication (e.g. 'ticket_status:t-1042') */
  dedupeKey?: string;
  /** The entity this mutation belongs to (e.g. a ticket ID) */
  entityId: string;
  /** REST endpoint — filled in when backend is ready */
  url: string;
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  payload: unknown;
  queuedAt: string;
  /** Number of replay attempts */
  attempts: number;
}

// ─── Queue API ────────────────────────────────────────────────────────────────

/** Add an operation to the queue. Deduplicates by dedupeKey if provided. */
export async function enqueueOp(op: Omit<PendingOp, 'id' | 'queuedAt' | 'attempts'>): Promise<void> {
  const all = await idbGetAll<PendingOp>('pending-ops');

  // Replace existing op with same dedupeKey (e.g. only keep the latest status change)
  if (op.dedupeKey) {
    const existing = all.find((o) => o.dedupeKey === op.dedupeKey);
    if (existing?.id !== undefined) {
      await idbDelete('pending-ops', existing.id);
    }
  }

  await idbPut('pending-ops', {
    ...op,
    queuedAt: new Date().toISOString(),
    attempts: 0,
  });
}

export async function getAllOps(): Promise<PendingOp[]> {
  return idbGetAll<PendingOp>('pending-ops');
}

export async function getOpsForEntity(entityId: string): Promise<PendingOp[]> {
  const all = await getAllOps();
  return all.filter((op) => op.entityId === entityId);
}

export async function removeOp(id: number): Promise<void> {
  await idbDelete('pending-ops', id);
}

export async function countOps(): Promise<number> {
  const all = await getAllOps();
  return all.length;
}

/** Replay all queued operations against the real API. */
export async function flushOps(): Promise<{ synced: number; failed: number }> {
  const ops = await getAllOps();
  let synced = 0;
  let failed  = 0;

  for (const op of ops) {
    try {
      const res = await fetch(op.url, {
        method: op.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(op.payload),
      });

      if (res.ok) {
        await removeOp(op.id!);
        synced++;
      } else {
        // Increment attempt count but keep in queue
        await idbPut('pending-ops', { ...op, attempts: op.attempts + 1 });
        failed++;
      }
    } catch {
      await idbPut('pending-ops', { ...op, attempts: op.attempts + 1 });
      failed++;
    }
  }

  return { synced, failed };
}
