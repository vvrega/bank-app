import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // wyłącza błędy ESLint przy `next build`
  },
};

export default nextConfig;
