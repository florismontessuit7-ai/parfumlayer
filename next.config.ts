import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/recommend": ["./data/**/*"],
    "/api/search": ["./data/**/*"],
  },
};

export default nextConfig;
