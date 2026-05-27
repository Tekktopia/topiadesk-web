import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline',
  },
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      // Page navigations — stale-while-revalidate
      {
        urlPattern: /^https?.*\/(tickets|assets|monitoring|reports|contacts|knowledge|csat|audits|inventory|automations|sla|channels|profile).*/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'agent-pages',
          expiration: { maxEntries: 60, maxAgeSeconds: 86400 },
        },
      },
      // API calls — network-first with offline fallback to cache
      {
        urlPattern: /^https?.*\/api\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'agent-api',
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 100, maxAgeSeconds: 3600 },
        },
      },
      // Static assets — cache-first, long TTL
      {
        urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico|webp|avif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'agent-static',
          expiration: { maxEntries: 200, maxAgeSeconds: 2592000 },
        },
      },
      // Google Fonts
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts',
          expiration: { maxEntries: 20, maxAgeSeconds: 31536000 },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@topiadesk/ui',
    '@topiadesk/design-tokens',
    '@topiadesk/api-client',
  ],
};

export default withPWA(nextConfig);
