import type { NextConfig } from "next";

// Trigger rebuild

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/media/file/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/media/file/:path*`,
      },
    ];
  },
};

export default nextConfig;
