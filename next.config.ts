import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "next-build",
  allowedDevOrigins: ["192.168.1.31"],
  outputFileTracingIncludes: {
    "/api/recommend": ["./data/**/*"],
    "/api/search": ["./data/**/*"],
  },
};

export default nextConfig;
