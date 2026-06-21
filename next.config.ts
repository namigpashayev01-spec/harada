import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Skip type-checking & linting during `next build`: this box is RAM-tight
  // and tsc/eslint OOM-kill the build. Catch type/lint errors in dev/CI instead.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Force blocking (in-<head>) metadata for ALL user agents instead of
  // streaming it into the <body>. Required so Google Search Console (and any
  // crawler that doesn't execute JS) finds the verification meta tag and the
  // SEO tags inside <head>.
  htmlLimitedBots: /.*/,
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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
