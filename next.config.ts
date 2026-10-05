import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  serverExternalPackages: ['better-sqlite3'],
  images: {
    localPatterns: [
      { pathname: '/images/**' },
      { pathname: '/uploads/**' },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'better-sqlite3'];
    }
    return config;
  }
};

export default nextConfig;
