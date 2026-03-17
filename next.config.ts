import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Netlify deployment
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
