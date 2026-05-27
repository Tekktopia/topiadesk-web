'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueOp, flushOps, getOpsForEntity, type PendingOpType } from '../_lib/pending-ops';
import { idbPut, idbGet } from '../_lib/idb';
import type { StoreName } from '../_lib/idb';

interface UseMutationOfflineOptions<TPayload> {
  type: PendingOpType;
  /** Used for deduplication — same key replaces previous pending op of same kind */
  dedupeKey?: (payload: TPayload) => string;
  /** The entity this mutation belongs to */
  entityId: string;
  /** Construct the REST URL — used when flushing after connectivity returns */
  url: (payload: TPayload) => string;
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  /** Human-readable label shown in the offline banner queue */
  label: (payload: TPayload) => string;
  /** Optimistically update the IDB cache so the UI stays correct offline */
  optimisticUpdate?: (payload: TPayload) => {
    store: StoreName;
    updater: (current: unknown) => unknown;
    id: string;
  };
  /** React Query cache keys to invalidate when online mutation succeeds */
  invalidates?: string[][];
  /** Called when online and mutation succeeds */
  onSuccess?: (payload: TPayload) => void;
  /** Called when queued offline */
  onQueued?: (payload: TPayload) => void;
}

type MutationStatus = 'idle' | 'loading' | 'queued' | 'success' | 'error';

/**
 * Offline-aware mutation hook.
 *
 * When online:   executes the operation via fetch immediately.
 * When offline:  queues it in IndexedDB, applies optimistic update to local cache.
 *
 * `status` will be 'queued' when the op was saved for later sync.
 */
export function useOfflineMutation<TPayload = unknown>(
  options: UseMutationOfflineOptions<TPayload>
) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<MutationStatus>('idle');
  const [error, setError]   = useState<Error | null>(null);
  const isOnline = useIsOnline();

  const mutate = useCallback(async (payload: TPayload) => {
    setStatus('loading');
    setError(null);

    if (isOnline) {
      // ── Online path ─────────────────────────────────────────────────────────
      try {
        const res = await fetch(options.url(payload), {
          method: options.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // Invalidate react-query caches
        if (options.invalidates) {
          options.invalidates.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
        }

        setStatus('success');
        options.onSuccess?.(payload);
        setTimeout(() => setStatus('idle'), 2000);
      } catch (err) {
        // If the request fails even though we "think" we're online,
        // fall through to offline queue
        setError(err instanceof Error ? err : new Error('Request failed'));
        setStatus('error');
      }
    } else {
      // ── Offline path ────────────────────────────────────────────────────────
      // 1. Persist to pending-ops queue
      await enqueueOp({
        type: options.type,
        label: options.label(payload),
        dedupeKey: options.dedupeKey?.(payload),
        entityId: options.entityId,
        url: options.url(payload),
        method: options.method,
        payload,
      });

      // 2. Optimistically update IDB so the UI reflects the change offline
      if (options.optimisticUpdate) {
        const { store, updater, id } = options.optimisticUpdate(payload);
        const current = await idbGet(store, id);
        if (current) await idbPut(store, updater(current));
      }

      setStatus('queued');
      options.onQueued?.(payload);
      // Keep 'queued' status visible — don't auto-reset
    }
  }, [isOnline, options, queryClient]);

  // Auto-flush when coming back online
  useEffect(() => {
    if (!isOnline) return;
    flushOps().then(({ synced }) => {
      if (synced > 0 && options.invalidates) {
        options.invalidates.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        );
      }
    });
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => { setStatus('idle'); setError(null); }, []);

  return { mutate, status, error, reset, isQueued: status === 'queued' };
}

// ─── Internal helper ──────────────────────────────────────────────────────────

function useIsOnline() {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}
