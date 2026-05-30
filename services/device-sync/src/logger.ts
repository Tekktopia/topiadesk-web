import pino from 'pino';
import { config } from './config.js';

export const logger = pino({
  level: config.LOG_LEVEL,
  ...(config.NODE_ENV === 'development'
    ? { transport: { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss.l', ignore: 'pid,hostname' } } }
    : {}),
  base: { svc: 'device-sync' },
  redact: ['req.headers.authorization', '*.clientSecret', '*.apiToken', '*.password'],
});
