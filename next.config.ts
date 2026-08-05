import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [

      {
        protocol: "https",
        hostname: "backend-albarqy.onrender.com",
      },
      {
        protocol: "http",
        hostname: "backend-albarqy.onrender.com",
      },
    ],
  },
};

export default nextConfig;
