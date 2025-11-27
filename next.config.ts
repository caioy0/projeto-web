import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* outras opções */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgs.search.brave.com",
      },
      {
        protocol: "https",
        hostname: "www.pngall.com",
      },
      // adicione outros domínios externos que você precisar
    ],
  },
};

export default nextConfig;
