import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      static: 30,   // don't cache static pages in the client router cache
      dynamic: 30,  // don't cache dynamic pages either
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com",
      },
    ],
  },
  allowedDevOrigins: ["10.197.202.218"],
};

export default nextConfig;
