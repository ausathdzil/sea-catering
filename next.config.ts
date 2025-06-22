import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    dynamicIO: true,
    ppr: true,
  },
};

export default nextConfig;
