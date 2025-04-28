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
  },
  env: {
    NEXT_PUBLIC_BASE_URL: "https://aziz-fadel.vercel.app",
  },
};

export default nextConfig;
