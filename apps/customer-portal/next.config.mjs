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
      // Portal pages — stale-while-revalidate
      {
        urlPattern: /^https?.*\/(tickets|kb|profile|notifications|submit).*/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'portal-pages',
          expiration: { maxEntries: 40, maxAgeSeconds: 86400 },
        },
      },
      // API responses — network-first
      {
        urlPattern: /^https?.*\/api\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'portal-api',
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 60, maxAgeSeconds: 3600 },
        },
      },
      // Static assets — cache-first, long TTL
      {
        urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico|webp|avif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'portal-static',
          expiration: { maxEntries: 150, maxAgeSeconds: 2592000 },
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
