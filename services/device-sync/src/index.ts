/**
 * Service entry point.
 *
 * Boot order matters:
 *   ① start the reconciler (queue consumer) BEFORE the webhook server, so
 *      no signal is dropped between the first 202 and the first consume.
 *   ② start the HTTP server (Fastify).
 *   ③ start the cron jobs (renewer + polling fallback).
 *   ④ register signal handlers for graceful shutdown.
 */

import { startReconciler } from './reconciler.js';
import { startServer }     from './server.js';
import { startCron, stopCron } from './cron.js';
import { logger }          from './logger.js';

async function main() {
  startReconciler();
  const app = await startServer();
  startCron();

  const shutdown = async (sig: string) => {
    logger.info({ sig }, 'shutdown initiated');
    stopCron();
    try { await app.close(); } catch (err) { logger.error({ err }, 'fastify close failed'); }
    process.exit(0);
  };

  process.on('SIGINT',  () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('uncaughtException', (err) => logger.error({ err }, 'uncaughtException'));
  process.on('unhandledRejection', (err) => logger.error({ err }, 'unhandledRejection'));
}

void main();
