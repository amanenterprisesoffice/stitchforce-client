import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.SERVER_URL}/v1/:path*`,
      },
    ];
  },
  images: {
    domains: ['uicookies.com', 'images.pexels.com'],  
  },
};

export default nextConfig;
