import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "api.census.gov" },
      { protocol: "https", hostname: "tile.openstreetmap.org" }
    ]
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["leaflet", "fuse.js", "lodash-es"]
  }
};

export default nextConfig;
