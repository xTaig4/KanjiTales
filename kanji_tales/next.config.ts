import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable source maps for debugging
  productionBrowserSourceMaps: true,
  // Also enable for development (this is usually enabled by default)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
