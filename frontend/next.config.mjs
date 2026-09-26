/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Avoid double type-check memory spike on 512MB free tier
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Restrict to single process to stay strictly under 512MB RAM on Render
    workerThreads: false,
    cpus: 1,
  },
  async rewrites() {
    const apiTarget = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
