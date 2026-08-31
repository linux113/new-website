/**
 * Small SVG string helpers shared by the world-map / trade / customers
 * panels (all of which embed `dotted-map` output inline).
 *
 * The input is always machine-generated SVG from `dotted-map` (static
 * coordinate data) — never user-supplied content — so no sanitisation
 * beyond structural extraction is needed.
 */

/** Extract the inner content of a `<svg>…</svg>` string. */
export function extractSvgInner(svg: string): string {
  const open = svg.indexOf(">");
  const close = svg.lastIndexOf("</svg>");
  if (open === -1 || close === -1) return "";
  return svg.slice(open + 1, close);
}
