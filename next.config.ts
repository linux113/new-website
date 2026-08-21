import type { NextConfig } from "next";

const r2Host = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : null;

const nextConfig: NextConfig = {
  // Allow the sandboxed live-preview host to reach the dev server.
  allowedDevOrigins: ["*.e2b.app"],
  images: {
    remotePatterns: r2Host
      ? [{ protocol: "https" as const, hostname: r2Host }]
      : [],
  },
};

export default nextConfig;
