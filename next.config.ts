import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    ppr: true,
    nodeMiddleware: true,
    useCache: true,
  },
};

export default nextConfig;
