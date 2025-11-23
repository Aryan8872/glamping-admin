import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler:true,
  experimental:{
    turbopackFileSystemCacheForDev:true,
    cacheComponents:true,
    serverActions:{
      bodySizeLimit:"60mb"
    }
  },
  
  
};

export default nextConfig;
