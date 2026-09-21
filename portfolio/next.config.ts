import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["api.microlink.io"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
