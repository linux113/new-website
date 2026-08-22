import type { NextConfig } from "next";

const r2Host = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : null;

const nextConfig: NextConfig = {
  // Allow the sandboxed live-preview host to reach the dev server.
  allowedDevOrigins: ["*.e2b.app"],
  experimental: {
    serverActions: {
      // The preview proxies https://3000-<id>.e2b.app → localhost:3000;
      // allow those origins for server-action POSTs (login, forms).
      allowedOrigins: ["*.e2b.app", "localhost:3000"],
    },
  },
  images: {
    remotePatterns: r2Host
      ? [{ protocol: "https" as const, hostname: r2Host }]
      : [],
  },
};

export default nextConfig;
