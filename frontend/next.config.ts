import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.100.165", "192.168.100.0/24"],
};

export default nextConfig;
