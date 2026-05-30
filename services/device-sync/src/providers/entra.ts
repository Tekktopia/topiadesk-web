/**
 * Microsoft Graph client + subscription lifecycle.
 *
 * Used for Entra ID (signInActivity, registeredDevices) and Intune
 * (deviceManagement/managedDevices). One client class — the resource path
 * differs per subscription.
 *
 * Auth: client-credentials flow against the per-tenant token endpoint.
 * Tokens are cached in-memory for their lifetime - 60s safety margin.
 */

import { fetch } from 'undici';
import { config } from '../config.js';
import { logger } from '../logger.js';
import type { DeviceFingerprint, RawSignal } from '../types.js';

interface CachedToken { token: string; expiresAt: number }
const tokenCache = new Map<string, CachedToken>();

async function getToken(tenantId: string): Promise<string> {
  const cached = tokenCache.get(tenantId);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     config.ENTRA_CLIENT_ID,
      client_secret: config.ENTRA_CLIENT_SECRET,
      scope:         'https://graph.microsoft.com/.default',
      grant_type:    'client_credentials',
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`token exchange failed for tenant ${tenantId}: ${res.status} ${text}`);
  }
  const body = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache.set(tenantId, { token: body.access_token, expiresAt: Date.now() + body.expires_in * 1000 });
  return body.access_token;
}

async function graph<T>(tenantId: string, path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const token = await getToken(tenantId);
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    method:  init?.method ?? 'GET',
    headers: {
      authorization:   `Bearer ${token}`,
      'content-type':  'application/json',
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Graph ${init?.method ?? 'GET'} ${path} failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

// ─── Subscription lifecycle ─────────────────────────────────────────────────

interface GraphSubscription {
  id:                 string;
  resource:           string;
  expirationDateTime: string;
  clientState:        string;
}

/** Resources we subscribe to. Add more as Topiadesk grows. */
const SUBSCRIPTION_RESOURCES = [
  'users',
  'devices',
  'deviceManagement/managedDevices',
];

export async function createSubscription(tenantId: string, webhookClientState: string): Promise<GraphSubscription[]> {
  const notificationUrl = `${config.TOPIADESK_API_URL.replace(/\/api$/, '')}/webhooks/graph`;
  const expirationDateTime = new Date(Date.now() + 60 * 60 * 1000 * 60).toISOString(); // 60h — Graph max for many resources

  const subs: GraphSubscription[] = [];
  for (const resource of SUBSCRIPTION_RESOURCES) {
    try {
      const sub = await graph<GraphSubscription>(tenantId, '/subscriptions', {
        method: 'POST',
        body: {
          changeType: 'updated,created,deleted',
          notificationUrl,
          resource,
          expirationDateTime,
          clientState: webhookClientState,
        },
      });
      subs.push(sub);
      logger.info({ tenantId, resource, subscriptionId: sub.id }, 'graph subscription created');
    } catch (err) {
      logger.error({ err, tenantId, resource }, 'failed to create graph subscription');
    }
  }
  return subs;
}

export async function renewSubscription(tenantId: string, subscriptionId: string): Promise<GraphSubscription> {
  const expirationDateTime = new Date(Date.now() + 60 * 60 * 1000 * 60).toISOString();
  return graph<GraphSubscription>(tenantId, `/subscriptions/${subscriptionId}`, {
    method: 'PATCH',
    body: { expirationDateTime },
  });
}

// ─── Polling fallback: list users + their registered devices ───────────────

interface GraphUser { id: string; userPrincipalName: string; displayName?: string }
interface GraphDevice {
  id: string; deviceId: string; displayName?: string;
  operatingSystem?: string; operatingSystemVersion?: string;
  approximateLastSignInDateTime?: string;
}

export async function pollPrimaryDevices(tenantId: string): Promise<RawSignal[]> {
  const users = await graph<{ value: GraphUser[] }>(tenantId, '/users?$select=id,userPrincipalName,displayName&$top=999');
  const signals: RawSignal[] = [];

  for (const u of users.value) {
    let devs: { value: GraphDevice[] };
    try {
      devs = await graph<{ value: GraphDevice[] }>(tenantId, `/users/${u.id}/registeredDevices`);
    } catch (err) {
      logger.debug({ err, user: u.userPrincipalName }, 'registeredDevices unavailable');
      continue;
    }
    if (!devs.value.length) continue;

    // Pick the device with the most recent signal as "current"
    const current = devs.value
      .filter((d) => d.approximateLastSignInDateTime)
      .sort((a, b) => (b.approximateLastSignInDateTime ?? '').localeCompare(a.approximateLastSignInDateTime ?? ''))[0];
    if (!current) continue;

    const device: DeviceFingerprint = {
      providerDeviceId: current.deviceId,
      ...(current.displayName ? { hostname: current.displayName } : {}),
      ...(current.operatingSystem
        ? { os: `${current.operatingSystem}${current.operatingSystemVersion ? ' ' + current.operatingSystemVersion : ''}` }
        : {}),
      observedAt: current.approximateLastSignInDateTime ?? new Date().toISOString(),
    };
    signals.push({
      id:        `entra-poll-${u.id}-${device.observedAt}`,
      providerId: 'entra',
      tenantId,
      userEmail:  u.userPrincipalName,
      ...(u.displayName ? { userDisplayName: u.displayName } : {}),
      device,
      kind:       'sign-in',
      receivedAt: new Date().toISOString(),
      rawPayload: current,
    });
  }
  return signals;
}
