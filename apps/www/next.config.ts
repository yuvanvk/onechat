import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [{
        protocol: 'http',
        hostname: 'localhost',
        port: '8787',
        pathname: '/**',
      },]
  }
};

export default nextConfig;
