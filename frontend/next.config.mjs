/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
