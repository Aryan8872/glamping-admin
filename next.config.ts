import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jcuziwpupnjvcrbjxrpi.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      bodySizeLimit: "60mb"
    }
  },
};

export default nextConfig;
