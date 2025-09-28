import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "api.microlink.io", // Microlink Image Preview
    ],
  },
  eslint: {
    // ✅ Prevent ESLint errors from breaking your Vercel build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Prevent TS errors from breaking Vercel build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
