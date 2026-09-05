import type { NextConfig } from "next";

const r2Host = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : null;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/products/category/:slug", destination: "/products/:slug", permanent: true },
      { source: "/products/anchors-foundation", destination: "/products/anchor-foundation-bolts", permanent: true },
      { source: "/products/pipe-fittings-flanges", destination: "/products/pipe-fittings", permanent: true },
    ];
  },
  // Strict security headers (preview-safe: frame-ancestors left open
  // for the sandbox preview iframe; everything else locked down).
  async headers() {
    return [
      {
        // The dotted world map is a build-generated, content-stable
        // asset (~150 KB) requested by three homepage sections and
        // /global-reach. `next start` serves public/ with
        // "max-age=0" by default, which would re-fetch it on every
        // navigation, so cache it explicitly.
        source: "/world-dots.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        ],
      },
    ];
  },
  // Allow the sandboxed live-preview host to reach the dev server.
  allowedDevOrigins: ["*.e2b.app"],
  experimental: {
    serverActions: {
      // Default is 1 MB — too small for product photos.
      bodySizeLimit: "12mb",
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
