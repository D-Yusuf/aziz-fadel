import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aziz-fadel.vercel.app',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
