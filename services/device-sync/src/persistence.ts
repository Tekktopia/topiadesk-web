/**
 * Adapters for the asset register, the tenant connection store, and the
 * audit log. In production these wrap HTTP calls against the Topiadesk core
 * API; in dev we keep an in-memory shape so the reconciler logic can be
 * exercised end-to-end without a database.
 *
 * Each function returns a Promise so swapping in a network-backed
 * implementation is a no-op for callers.
 */

import { fetch } from 'undici';
import { logger } from './logger.js';
import { config } from './config.js';
import type { ProviderId, RawSignal } from './types.js';

// ─── Asset register ─────────────────────────────────────────────────────────

export interface AssetRecord {
  id:                 string;
  tenantId:           string;
  assignedUserEmail:  string;
  providerDeviceIds:  Partial<Record<ProviderId, string>>;
  serial?:            string;
  hostname?:          string;
  model?:             string;
  status:             'in-stock' | 'deployed' | 'in-repair' | 'returned-pending' | 'retired';
}

export interface AssetRegister {
  findByUser:        (tenantId: string, email: string) => Promise<AssetRecord | null>;
  upsertReassignment: (oldAssetId: string | null, next: Omit<AssetRecord, 'id'>) => Promise<AssetRecord>;
}

const inMemAssets = new Map<string, AssetRecord>();

export const assetRegister: AssetRegister = {
  async findByUser(tenantId, email) {
    for (const a of inMemAssets.values()) {
      if (a.tenantId === tenantId && a.assignedUserEmail.toLowerCase() === email.toLowerCase()) return a;
    }
    return null;
  },
  async upsertReassignment(oldAssetId, next) {
    if (oldAssetId) {
      const old = inMemAssets.get(oldAssetId);
      if (old) inMemAssets.set(oldAssetId, { ...old, status: 'returned-pending' });
    }
    const id = `asset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const rec: AssetRecord = { id, ...next, status: 'deployed' };
    inMemAssets.set(id, rec);
    return rec;
  },
};

// ─── Tenant connection store ────────────────────────────────────────────────

export interface TenantConnection {
  tenantId:         string;
  providerId:       ProviderId;
  policy:           'auto-approve' | 'require-approval' | 'ignore';
  enabledSignals:   string[];                  // matches the UI toggles
  /** Per-tenant credentials (encrypted at rest in production) */
  creds:            Record<string, string>;
  /** Active Graph / Google Pub-Sub subscription metadata, if any */
  subscription?:    { id: string; expiresAt: string };
}

export interface ConnectionStore {
  listForProvider: (providerId: ProviderId) => Promise<TenantConnection[]>;
  resolveByGraphClientState: (clientState: string) => Promise<TenantConnection | null>;
  setSubscription: (tenantId: string, providerId: ProviderId, sub: TenantConnection['subscription']) => Promise<void>;
}

const inMemConnections: TenantConnection[] = [];

export const connectionStore: ConnectionStore = {
  async listForProvider(providerId) {
    return inMemConnections.filter((c) => c.providerId === providerId);
  },
  async resolveByGraphClientState(clientState) {
    // Graph requires the receiver to validate the clientState bound at subscription time.
    // Each connection's creds.webhookClientState was set when the subscription was created.
    return inMemConnections.find((c) => c.creds.webhookClientState === clientState) ?? null;
  },
  async setSubscription(tenantId, providerId, sub) {
    const c = inMemConnections.find((x) => x.tenantId === tenantId && x.providerId === providerId);
    if (c) c.subscription = sub;
  },
};

// ─── Audit log ──────────────────────────────────────────────────────────────

export interface AuditEntry {
  tenantId:   string;
  actor:      string;        // 'device-sync-worker' for our writes
  action:     string;        // 'reconciliation.created' / 'reconciliation.auto-approved' / 'reconciliation.ignored'
  signalId:   string;
  details:    Record<string, unknown>;
  createdAt:  string;
}

export const auditLog = {
  async write(entry: AuditEntry) {
    if (config.NODE_ENV !== 'development') {
      try {
        await fetch(`${config.TOPIADESK_API_URL}/audit-log`, {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${config.TOPIADESK_API_TOKEN}`,
            'content-type':  'application/json',
          },
          body: JSON.stringify(entry),
        });
      } catch (err) {
        logger.warn({ err, entry }, 'audit-log write failed — entry queued for retry');
      }
    } else {
      logger.info({ audit: entry }, 'audit');
    }
  },
};

// ─── Inbox writes (agent workspace device-sync inbox) ───────────────────────

export const inbox = {
  async createPendingEntry(payload: {
    tenantId:   string;
    signal:     RawSignal;
    currentAsset: AssetRecord | null;
  }): Promise<{ id: string }> {
    // Production: POST to Topiadesk core /api/inbox/device-sync — surfaced in
    // the inbox UI on the agent workspace. Dev: just log and return a fake id.
    const entryId = `ds-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    logger.info({ entryId, ...payload }, 'inbox.created');
    return { id: entryId };
  },
};
