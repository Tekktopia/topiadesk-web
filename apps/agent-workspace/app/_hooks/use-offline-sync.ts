'use client';

import { useEffect, useCallback, useState } from 'react';

// ─── IndexedDB helpers ────────────────────────────────────────────────────────

const DB_NAME = 'topiadesk-sync';
const DB_VERSION = 1;
const STORE = 'pending-ops';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export interface PendingOp {
  id?: number;
  type: 'ticket_update' | 'ticket_reply' | 'ticket_status' | 'asset_update';
  url: string;
  method: 'POST' | 'PATCH' | 'PUT';
  payload: unknown;
  queuedAt: string;
  label: string; // Human-readable description for UI
}

async function enqueue(op: Omit<PendingOp, 'id'>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).add(op);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dequeue(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllPending(): Promise<PendingOp[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as PendingOp[]);
    req.onerror = () => reject(req.error);
  });
}

async function flushPending(): Promise<{ synced: number; failed: number }> {
  const pending = await getAllPending();
  let synced = 0;
  let failed = 0;

  for (const op of pending) {
    try {
      const res = await fetch(op.url, {
        method: op.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(op.payload),
      });
      if (res.ok) {
        await dequeue(op.id!);
        synced++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return { synced, failed };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOfflineSync() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{ synced: number; failed: number } | null>(null);

  const refreshCount = useCallback(async () => {
    try {
      const ops = await getAllPending();
      setPendingCount(ops.length);
    } catch {
      // IndexedDB not available (SSR or private mode)
    }
  }, []);

  /** Queue a ticket/asset operation to be replayed when online */
  const queueOperation = useCallback(async (op: Omit<PendingOp, 'id' | 'queuedAt'>) => {
    await enqueue({ ...op, queuedAt: new Date().toISOString() });
    await refreshCount();

    // Register a background sync if the service worker supports it
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      try {
        // @ts-expect-error — SyncManager types may not be available
        await registration.sync.register('topiadesk-sync');
      } catch {
        // Browser doesn't support background sync — will flush on next online event
      }
    }
  }, [refreshCount]);

  /** Manually flush the queue (called when coming back online) */
  const syncNow = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const result = await flushPending();
      setLastSyncResult(result);
      await refreshCount();
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refreshCount]);

  // Flush queue when coming back online
  useEffect(() => {
    refreshCount();

    const handleOnline = () => {
      syncNow();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [syncNow, refreshCount]);

  // Listen for messages from the service worker (sync completed via background sync)
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_COMPLETE') {
        refreshCount();
        setLastSyncResult(event.data.result);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
  }, [refreshCount]);

  return {
    pendingCount,
    isSyncing,
    lastSyncResult,
    queueOperation,
    syncNow,
    refreshCount,
  };
}
