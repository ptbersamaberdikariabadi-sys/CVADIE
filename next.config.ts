import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ PERF: Enable Gzip/Brotli compression on all responses
  compress: true,

  images: {
    // ✅ PERF: Prefer modern, smaller formats — browser gets AVIF if supported,
    // falls back to WebP, then original. Results in 30–60% smaller file sizes.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nfacbzjnughxprqmdczs.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // ✅ PERF: Cache optimized images for 1 year on CDN
    minimumCacheTTL: 31536000,
  },

  // ✅ PERF: Set aggressive caching headers for static assets
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        // Cache Next.js static assets for 1 year
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache public assets (images, fonts) for 30 days
        source: '/(.*).(jpg|jpeg|png|gif|svg|webp|avif|woff|woff2|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
