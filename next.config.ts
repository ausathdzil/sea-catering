import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
    ppr: true,
    nodeMiddleware: true,
  },
};

export default nextConfig;
