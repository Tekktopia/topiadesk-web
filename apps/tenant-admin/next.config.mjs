/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The tenant admin portal is mounted at `/admin` on every tenant
  // subdomain — e.g. https://consomoafrica.topiadesk.com/admin.
  // Setting basePath makes Next.js auto-prefix every route, internal
  // link, and static asset so component code can keep using paths
  // like "/", "/settings", "/agents" without thinking about it.
  basePath: '/admin',
  transpilePackages: [
    '@topiadesk/ui',
    '@topiadesk/design-tokens',
    '@topiadesk/api-client',
  ],
};

export default nextConfig;
