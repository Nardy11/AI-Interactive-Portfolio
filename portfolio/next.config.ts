import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Several lockfiles sit above this directory; pin the trace root so the
  // build stops guessing the workspace.
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.microlink.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
