import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  // Ensure proper routing for Vercel
  trailingSlash: false,
};

export default nextConfig;
