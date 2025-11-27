import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.sumup.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.notretemps.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cms-cdn.lafourche.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lacorbeille-saintnazaire-epicerie.fr',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
