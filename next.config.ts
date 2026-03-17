import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/tt-soft-task",
  assetPrefix: "/tt-soft-task/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
