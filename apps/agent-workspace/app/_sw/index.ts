/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

/**
 * Custom service worker additions merged by next-pwa with Workbox sw.js.
 *
 * Handles:
 *  1. Background Sync — replays pending-ops queue (IDB: topiadesk-offline / pending-ops)
 *  2. Push Notifications — rich push messages with action buttons
 *  3. Periodic cache warming — pre-caches ticket/asset data for offline reads
 */

declare const self: ServiceWorkerGlobalScope;

const DB_NAME    = 'topiadesk-offline';
const STORE      = 'pending-ops';

// ─── IDB helpers (duplicated here — SW can't import from app/_lib) ────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      ['tickets', 'assets', 'pending-ops', 'cache-meta'].forEach((s) => {
        if (!db.objectStoreNames.contains(s)) {
          if (s === 'pending-ops') {
            db.createObjectStore(s, { keyPath: 'id', autoIncrement: true });
          } else if (s === 'cache-meta') {
            db.createObjectStore(s, { keyPath: 'key' });
          } else {
            db.createObjectStore(s, { keyPath: 'id' });
          }
        }
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function getAllOps() {
  const db = await openDB();
  return new Promise<any[]>((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function deleteOp(id: number) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

async function incrementAttempts(op: any) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put({ ...op, attempts: (op.attempts ?? 0) + 1 });
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

// ─── Background Sync ──────────────────────────────────────────────────────────

self.addEventListener('sync', (event: any) => {
  if (event.tag === 'topiadesk-sync') {
    event.waitUntil(replayPendingOps());
  }
});

async function replayPendingOps() {
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
        await deleteOp(op.id);
        synced++;
      } else {
        await incrementAttempts(op);
        failed++;
      }
    } catch {
      await incrementAttempts(op);
      failed++;
    }
  }

  // Notify all open tabs that sync finished
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach((client) => {
    client.postMessage({ type: 'SW_SYNC_COMPLETE', result: { synced, failed } });
  });
}

// ─── Push Notifications ───────────────────────────────────────────────────────

self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;

  let data: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    url?: string;
    ticketNumber?: string;
    actions?: { action: string; title: string }[];
  };

  try {
    data = event.data.json();
  } catch {
    data = { title: 'Topiadesk', body: event.data.text() };
  }

  const actions = data.actions ?? [
    { action: 'open',    title: '→ Open ticket' },
    { action: 'dismiss', title: 'Dismiss'        },
  ];

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon:   data.icon   ?? '/icons/icon-192.png',
      badge:  data.badge  ?? '/icons/icon-192.png',
      tag:    data.tag    ?? 'topiadesk',
      data:   { url: data.url ?? '/tickets' },
      actions,
      requireInteraction: true,
    })
  );
});

// ─── Notification click ───────────────────────────────────────────────────────

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = (event.notification.data?.url as string) ?? '/tickets';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const existing = clientList.find((c) => c.url.includes(self.location.origin));
      if (existing) { existing.focus(); existing.navigate(url); return; }
      self.clients.openWindow(url);
    })
  );
});

// ─── Listen for page → SW messages ───────────────────────────────────────────

self.addEventListener('message', (event: MessageEvent) => {
  if (event.data?.type === 'MANUAL_SYNC') {
    replayPendingOps();
  }
});
