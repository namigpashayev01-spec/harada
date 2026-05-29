import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.harada-oturaq.az',
      },
      {
        protocol: 'https',
        hostname: 'api.diny.az',
      },
    ],
  },
};

export default nextConfig;
