import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ostale konfiguracijske opcije */
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // Povećaj limit sa podrazumijevanog 1MB na 100MB
    },
  },
};

export default nextConfig;