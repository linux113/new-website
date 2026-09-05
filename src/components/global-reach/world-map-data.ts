import DottedMap from "dotted-map";

/**
 * Generate a dotted world map SVG string (server-side).
 *
 * `dotted-map` is a CommonJS package using Node's `zlib`/`fs`, so it
 * must stay out of the client bundle. The page (server component)
 * calls this and passes the resulting string to <WorldMapPanel>.
 */
let cachedSvg: string | null = null;

export function getWorldDotsSvg(): string {
  // Generating this costs ~200 KB of SVG and is identical every time,
  // so build it once per server process instead of per render.
  if (cachedSvg !== null) return cachedSvg;
  const map = new DottedMap({ height: 52, grid: "diagonal" });
  cachedSvg = map.getSVG({
    radius: 0.82,
    color: "#252A2D",
    shape: "circle",
    backgroundColor: "transparent",
  });
  return cachedSvg;
}

/**
 * Equirectangular projection for a 1000×500 viewBox.
 */
export function project(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * 1000,
    y: ((90 - lat) / 180) * 500,
  };
}
