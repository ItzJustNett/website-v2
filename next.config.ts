import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use static export for production builds
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  images: {
    unoptimized: true,
  },
  basePath: process.env.TAURI_PLATFORM ? "" : undefined,
};

export default nextConfig;
