/**
 * Two background loops:
 *
 *   ① Subscription renewer — Microsoft Graph subscriptions expire after a few
 *     days; renew when they're within 24h of expiry. Google Pub/Sub watch
 *     channels need refreshing too (~7-day TTL).
 *
 *   ② Polling fallback — for any (tenant, provider) pair where webhooks
 *     haven't fired in the polling interval window, call the list-devices
 *     endpoint and emit signals for anything that changed since the last
 *     successful poll. This is the safety net.
 *
 * Both run on `setInterval` and respect graceful shutdown via stop().
 */

import { config } from './config.js';
import { logger } from './logger.js';
import { connectionStore } from './persistence.js';
import { signalQueue } from './queue.js';
import { renewSubscription, pollPrimaryDevices } from './providers/entra.js';
import { pollChromeDevices, pollMobileDevices } from './providers/google.js';
import { pollJamfComputers } from './providers/jamf.js';
import { pollKandjiDevices } from './providers/kandji.js';

let renewTimer:  NodeJS.Timeout | null = null;
let pollTimer:   NodeJS.Timeout | null = null;

// ─── ① renewer ───────────────────────────────────────────────────────────
async function runRenewalSweep() {
  const expiringWithin = Date.now() + 24 * 60 * 60 * 1000;       // 24h horizon
  const providers = ['entra', 'intune'] as const;

  for (const providerId of providers) {
    const conns = await connectionStore.listForProvider(providerId);
    for (const c of conns) {
      const sub = c.subscription;
      if (!sub) continue;
      if (new Date(sub.expiresAt).getTime() > expiringWithin) continue;

      try {
        const renewed = await renewSubscription(c.tenantId, sub.id);
        await connectionStore.setSubscription(c.tenantId, providerId, {
          id: renewed.id,
          expiresAt: renewed.expirationDateTime,
        });
        logger.info({ tenantId: c.tenantId, providerId, subscriptionId: sub.id }, 'subscription renewed');
      } catch (err) {
        logger.error({ err, tenantId: c.tenantId, providerId, subscriptionId: sub.id }, 'subscription renewal failed');
      }
    }
  }
}

// ─── ② polling fallback ─────────────────────────────────────────────────
async function runPollSweep() {
  const start = Date.now();
  const allProviders = ['entra', 'google', 'intune', 'jamf', 'kandji'] as const;
  let emitted = 0;

  for (const providerId of allProviders) {
    const conns = await connectionStore.listForProvider(providerId);
    for (const c of conns) {
      try {
        let signals: Awaited<ReturnType<typeof pollPrimaryDevices>> = [];
        switch (providerId) {
          case 'entra':
          case 'intune':
            signals = await pollPrimaryDevices(c.tenantId);
            break;
          case 'google':
            signals = [
              ...await pollMobileDevices(c.tenantId, c.creds.customerId ?? '', c.creds.impersonate ?? ''),
              ...await pollChromeDevices(c.tenantId, c.creds.customerId ?? '', c.creds.impersonate ?? ''),
            ];
            break;
          case 'jamf':
            signals = await pollJamfComputers(c.tenantId, c.creds.host ?? '', c.creds.username ?? '', c.creds.password ?? '');
            break;
          case 'kandji':
            signals = await pollKandjiDevices(c.tenantId, c.creds.subdomain ?? '', c.creds.apiToken ?? '');
            break;
        }
        for (const s of signals) {
          if (await signalQueue.enqueue(s, s.id)) emitted++;
        }
      } catch (err) {
        logger.error({ err, tenantId: c.tenantId, providerId }, 'poll failed');
      }
    }
  }

  logger.info({ emitted, durationMs: Date.now() - start }, 'poll sweep complete');
}

export function startCron() {
  // Stagger initial runs so they don't both fire at boot
  setTimeout(() => { void runRenewalSweep(); }, 5_000);
  setTimeout(() => { void runPollSweep();    }, 15_000);

  renewTimer = setInterval(() => { void runRenewalSweep(); }, config.RENEW_INTERVAL_SECONDS * 1000);
  pollTimer  = setInterval(() => { void runPollSweep();    }, config.POLL_INTERVAL_SECONDS  * 1000);

  logger.info({
    renewSec: config.RENEW_INTERVAL_SECONDS,
    pollSec:  config.POLL_INTERVAL_SECONDS,
  }, 'cron started');
}

export function stopCron() {
  if (renewTimer) clearInterval(renewTimer);
  if (pollTimer)  clearInterval(pollTimer);
  renewTimer = null;
  pollTimer  = null;
}
