/**
 * IndexedDB setup for Topiadesk offline-first mode.
 *
 * Schema
 * ──────
 * tickets       keyPath:'id'         — cached ticket list/detail responses
 * assets        keyPath:'id'         — cached asset list/detail responses
 * pending-ops   keyPath:'id' (auto)  — mutation queue (replies, status changes, etc.)
 * cache-meta    keyPath:'key'        — last-fetched timestamps per query key
 *
 * This module is safe to import in SSR — all IDB access is guarded by
 * `typeof indexedDB !== 'undefined'` checks.
 */

const DB_NAME    = 'topiadesk-offline';
const DB_VERSION = 1;

export type StoreName = 'tickets' | 'assets' | 'pending-ops' | 'cache-meta';

let _db: IDBDatabase | null = null;

export function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);

  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('tickets')) {
        db.createObjectStore('tickets', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('assets')) {
        db.createObjectStore('assets', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('pending-ops')) {
        db.createObjectStore('pending-ops', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('cache-meta')) {
        db.createObjectStore('cache-meta', { keyPath: 'key' });
      }
    };

    req.onsuccess = () => { _db = req.result; resolve(req.result); };
    req.onerror   = () => reject(req.error);
  });
}

// ─── Generic store helpers ────────────────────────────────────────────────────

export async function idbGet<T>(store: StoreName, key: IDBValidKey): Promise<T | undefined> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(store, 'readonly').objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror   = () => reject(req.error);
    });
  } catch { return undefined; }
}

export async function idbGetAll<T>(store: StoreName): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(store, 'readonly').objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror   = () => reject(req.error);
    });
  } catch { return []; }
}

export async function idbPut(store: StoreName, value: unknown): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(value);
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject(tx.error);
    });
  } catch { /* silently ignore IDB errors */ }
}

export async function idbPutMany(store: StoreName, values: unknown[]): Promise<void> {
  if (!values.length) return;
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      values.forEach((v) => tx.objectStore(store).put(v));
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject(tx.error);
    });
  } catch { /* silently ignore */ }
}

export async function idbDelete(store: StoreName, key: IDBValidKey): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject(tx.error);
    });
  } catch { /* silently ignore */ }
}

export async function idbClear(store: StoreName): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).clear();
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject(tx.error);
    });
  } catch { /* silently ignore */ }
}

// ─── Cache metadata helpers ───────────────────────────────────────────────────

const MAX_CACHE_AGE_MS = 4 * 60 * 60 * 1000; // 4 hours

export async function isCacheFresh(key: string): Promise<boolean> {
  const meta = await idbGet<{ key: string; cachedAt: number }>('cache-meta', key);
  if (!meta) return false;
  return Date.now() - meta.cachedAt < MAX_CACHE_AGE_MS;
}

export async function stampCache(key: string): Promise<void> {
  await idbPut('cache-meta', { key, cachedAt: Date.now() });
}
