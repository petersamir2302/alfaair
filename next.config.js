/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vegnmkhjmuxinqgeaqkk.supabase.co',
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


