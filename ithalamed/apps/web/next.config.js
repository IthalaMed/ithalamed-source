/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ithalamed/web-core', '@ithalamed/shared-types'],
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
