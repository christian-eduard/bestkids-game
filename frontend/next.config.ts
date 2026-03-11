import type { NextConfig } from "next";

// Trigger rebuild

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
