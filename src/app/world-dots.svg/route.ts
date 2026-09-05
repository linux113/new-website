import { getWorldDotsSvg } from "@/components/global-reach/world-map-data";

/**
 * The dotted world map as a cacheable static asset.
 *
 * The same ~200 KB of SVG is used by three sections on the homepage.
 * Inlining it into the HTML cost ~475 KB per page load and repeated
 * again in the RSC payload. Serving it here means the browser fetches
 * it once, caches it, and reuses it everywhere.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(getWorldDotsSvg(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
