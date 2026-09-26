import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  async rewrites() {
    let apiTarget = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    
    // Ensure destination starts with http:// or https://
    if (!apiTarget.startsWith('http://') && !apiTarget.startsWith('https://')) {
      if (apiTarget.endsWith('.onrender.com')) {
        apiTarget = `https://${apiTarget}`;
      } else {
        apiTarget = `http://${apiTarget}`;
      }
    }

    // If it is an internal hostname without port (e.g. growthos-backend-5ssh)
    if (!apiTarget.includes('.onrender.com') && !apiTarget.includes('.com') && !apiTarget.includes('.app')) {
      const withoutProto = apiTarget.replace(/^https?:\/\//, '');
      if (!withoutProto.includes(':')) {
        apiTarget = `${apiTarget}:8000`;
      }
    }

    apiTarget = apiTarget.replace(/\/+$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
