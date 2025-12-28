/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vegnmkhjmuxinqgeaqkk.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;


