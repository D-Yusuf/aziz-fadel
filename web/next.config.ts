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
    NEXT_PUBLIC_MYFATOORAH_TEST_URL: "https://apitest.myfatoorah.com",
    NEXT_PUBLIC_MYFATOORAH_PROD_URL: "https://api.myfatoorah.com",
  },
};

export default nextConfig;
