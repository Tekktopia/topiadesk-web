/**
 * Pluggable queue abstraction. Local dev uses an in-memory async iterator;
 * production should swap in BullMQ / SQS / Cloud Tasks by re-implementing
 * `enqueue` and `subscribe` against the same interface.
 *
 * Deduplication is built in — a signal id (Graph subscription id + resource
 * etag, or a hash of provider + device serial + observedAt) is rejected if
 * we've already enqueued it within the last hour. This is essential because
 * Microsoft retries delivery and a missed 2xx will resend the same payload.
 */

import { logger } from './logger.js';
import type { RawSignal } from './types.js';

export interface Queue<T> {
  enqueue: (job: T, dedupeKey: string) => Promise<boolean>;   // true if accepted, false if deduped
  subscribe: (handler: (job: T) => Promise<void>) => void;
  size: () => number;
}

export function createInMemoryQueue<T>(): Queue<T> {
  const pending: T[] = [];
  const seen = new Map<string, number>();   // dedupeKey -> expiry ms
  let handler: ((job: T) => Promise<void>) | null = null;
  let draining = false;

  const drain = async () => {
    if (draining || !handler) return;
    draining = true;
    try {
      while (pending.length > 0) {
        const job = pending.shift()!;
        try {
          await handler(job);
        } catch (err) {
          logger.error({ err }, 'queue handler threw');
        }
      }
    } finally {
      draining = false;
    }
  };

  return {
    async enqueue(job, dedupeKey) {
      const now = Date.now();
      // Purge expired dedupe keys lazily
      if (seen.size > 10_000) {
        for (const [k, exp] of seen) if (exp < now) seen.delete(k);
      }
      if ((seen.get(dedupeKey) ?? 0) > now) return false;
      seen.set(dedupeKey, now + 60 * 60_000);
      pending.push(job);
      void drain();
      return true;
    },
    subscribe(h) {
      handler = h;
      void drain();
    },
    size: () => pending.length,
  };
}

export const signalQueue = createInMemoryQueue<RawSignal>();
