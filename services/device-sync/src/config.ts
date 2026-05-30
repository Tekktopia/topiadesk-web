/**
 * Centralised, type-checked environment config. Fails fast on missing vars at
 * boot so we don't discover a bad config mid-webhook.
 */

import { z } from 'zod';

const Schema = z.object({
  PORT:                          z.coerce.number().int().positive().default(4040),
  NODE_ENV:                      z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL:                     z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  TOPIADESK_API_URL:             z.string().url(),
  TOPIADESK_API_TOKEN:           z.string().min(1),

  ENTRA_CLIENT_ID:               z.string().min(1),
  ENTRA_CLIENT_SECRET:           z.string().min(1),
  ENTRA_WEBHOOK_CLIENT_STATE:    z.string().min(16),

  GOOGLE_SERVICE_ACCOUNT_KEY:    z.string().min(1).optional(),
  GOOGLE_PUBSUB_TOPIC:           z.string().min(1).optional(),
  GOOGLE_PUBSUB_AUDIENCE:        z.string().url().optional(),

  JAMF_WEBHOOK_SECRET:           z.string().min(1).optional(),
  KANDJI_WEBHOOK_BEARER:         z.string().min(1).optional(),

  POLL_INTERVAL_SECONDS:         z.coerce.number().int().positive().default(600),
  RENEW_INTERVAL_SECONDS:        z.coerce.number().int().positive().default(21600),
});

export type Config = z.infer<typeof Schema>;

export const config: Config = (() => {
  const parsed = Schema.safeParse(process.env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
})();
