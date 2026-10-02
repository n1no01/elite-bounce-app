import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ostale konfiguracijske opcije */
  reactCompiler: true,

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // Povećaj limit sa podrazumijevanog 1MB na 100MB
    },
  },
};

export default nextConfig;