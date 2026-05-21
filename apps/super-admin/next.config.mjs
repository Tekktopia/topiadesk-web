/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@topiadesk/ui',
    '@topiadesk/design-tokens',
    '@topiadesk/api-client',
  ],
};

export default nextConfig;
