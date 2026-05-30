/**
 * Google Workspace Admin SDK client.
 *
 * Uses domain-wide delegation: Topiadesk's service-account impersonates an
 * admin user for each tenant. Real-time events come via Cloud Pub/Sub push
 * to /webhooks/google; this module also provides the polling fallback for
 * tenants whose admins haven't enabled Pub/Sub.
 *
 * Note: real implementation would use googleapis (Admin SDK Reports API,
 * Directory API for ChromeOS, mobileDevices). Stubbed shape here keeps the
 * surface ready to swap in.
 */

import { logger } from '../logger.js';
import type { RawSignal } from '../types.js';

export async function pollMobileDevices(tenantId: string, _customerId: string, _impersonate: string): Promise<RawSignal[]> {
  // GET https://admin.googleapis.com/admin/directory/v1/customer/{customerId}/devices/mobile
  // Stub: in production, list devices and emit signals where device.lastSync changed since last poll.
  logger.debug({ tenantId }, 'google pollMobileDevices — stub');
  return [];
}

export async function pollChromeDevices(tenantId: string, _customerId: string, _impersonate: string): Promise<RawSignal[]> {
  // GET .../customer/{customerId}/devices/chromeos
  logger.debug({ tenantId }, 'google pollChromeDevices — stub');
  return [];
}

/**
 * Verify the Google-signed JWT carried on every Pub/Sub push delivery.
 * Google sets `Authorization: Bearer <jwt>`. We validate audience == our
 * configured push URL and the issuer is accounts.google.com.
 *
 * Stub: shape only. Production must use the google-auth-library JWT verifier.
 */
export async function verifyPubSubJwt(_authHeader: string | undefined): Promise<{ ok: true; subject: string } | { ok: false }> {
  // TODO: implement with google-auth-library's OAuth2Client.verifyIdToken
  return { ok: false };
}
