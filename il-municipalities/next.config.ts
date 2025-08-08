import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "api.census.gov" }
    ]
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["fuse.js", "lodash-es"]
  }
};

export default nextConfig;
