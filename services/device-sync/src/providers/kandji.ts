/**
 * Kandji client + webhook bearer-token check.
 *
 * Kandji webhooks use a static bearer token on the Authorization header,
 * configured per integration. Constant-time compare to avoid timing oracles.
 */

import { timingSafeEqual } from 'node:crypto';
import { fetch } from 'undici';
import { config } from '../config.js';
import { logger } from '../logger.js';
import type { RawSignal } from '../types.js';

export function verifyKandjiBearer(header: string | undefined): boolean {
  if (!header || !config.KANDJI_WEBHOOK_BEARER) return false;
  const token = header.replace(/^Bearer\s+/i, '');
  const a = Buffer.from(token);
  const b = Buffer.from(config.KANDJI_WEBHOOK_BEARER);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

interface KandjiEvent {
  event_type: string;
  data: {
    device_id?:    string;
    serial_number?: string;
    user_email?:   string;
    device_name?:  string;
  };
}

export function normaliseKandjiEvent(payload: KandjiEvent, tenantId: string): RawSignal | null {
  const d = payload.data;
  if (!d.device_id || !d.user_email) return null;
  return {
    id:         `kandji-${d.device_id}-${Date.now()}`,
    providerId: 'kandji',
    tenantId,
    userEmail:  d.user_email,
    device: {
      providerDeviceId: d.device_id,
      ...(d.serial_number ? { serial:   d.serial_number } : {}),
      ...(d.device_name   ? { hostname: d.device_name }   : {}),
      observedAt: new Date().toISOString(),
    },
    kind:       payload.event_type === 'device.assigned' ? 'primary-user-changed' : 'sign-in',
    receivedAt: new Date().toISOString(),
    rawPayload: payload,
  };
}

export async function pollKandjiDevices(tenantId: string, subdomain: string, apiToken: string): Promise<RawSignal[]> {
  try {
    const res = await fetch(`https://${subdomain}.api.kandji.io/api/v1/devices?limit=300`, {
      headers: { authorization: `Bearer ${apiToken}` },
    });
    if (!res.ok) {
      logger.warn({ status: res.status, tenantId }, 'kandji list failed');
      return [];
    }
    // Production would page + shape into RawSignal[]
    return [];
  } catch (err) {
    logger.error({ err, tenantId }, 'kandji poll failed');
    return [];
  }
}
