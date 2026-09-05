/**
 * Generate public/world-dots.svg at build time.
 *
 * The dotted world map is used by three sections on the homepage plus
 * /global-reach. It was previously produced by a route handler at
 * src/app/world-dots.svg/route.ts, but a route segment whose name
 * contains a dot ("world-dots.svg") is fragile once deployed: on
 * Hostinger it returned HTTP 500 while every other route worked, so
 * all three maps rendered blank.
 *
 * A plain file in public/ removes the whole class of problem — it is
 * served directly, needs no Node execution per request, and matches
 * what public/admin/world-dots.svg (the admin dashboard map) already
 * does successfully.
 *
 * Generated at build time rather than committed because it is a
 * derived artifact (~200 KB) with no source value.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import DottedMap from "dotted-map";

const out = resolve(import.meta.dirname, "..", "public", "world-dots.svg");

const map = new DottedMap({ height: 52, grid: "diagonal" });
const svg = map.getSVG({
  radius: 0.82,
  color: "#252A2D",
  shape: "circle",
  backgroundColor: "transparent",
});

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, svg, "utf8");

console.log(
  `[gen-world-dots] Wrote public/world-dots.svg (${(svg.length / 1024).toFixed(0)} KB).`,
);
