import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com",
      },
    ],
  },
};

module.exports = {
  allowedDevOrigins: ['10.197.202.218'],
};

export default nextConfig;
