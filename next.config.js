/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vegnmkhjmuxinqgeaqkk.supabase.co',
      },
      // Brand logo hostnames
      {
        protocol: 'https',
        hostname: 'www.beko.com',
      },
      {
        protocol: 'https',
        hostname: 'www.carrier.com',
      },
      {
        protocol: 'https',
        hostname: 'www.haier.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gree.com',
      },
      {
        protocol: 'https',
        hostname: 'www.midea.com',
      },
      {
        protocol: 'https',
        hostname: 'www.york.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
    // Disable image optimization caching in development to see image updates immediately
    ...(process.env.NODE_ENV === 'development' && {
      unoptimized: false,
      minimumCacheTTL: 0,
    }),
  },
};

module.exports = nextConfig;


