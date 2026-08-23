"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Global reach map — dotted world (pre-rendered SVG asset from
 * dotted-map, /public/admin/world-dots.svg) with pins projected in
 * the same coordinate space (viewBox 0 0 119 60) and glowing arcs
 * from Mumbai HQ to each active market. Pins come from the
 * GlobalCountry table — no invented destinations.
 */

/** dotted-map projection (height 60, diagonal grid) for common markets. */
const COORDS: Record<string, [number, number]> = {
  in: [85.5, 29.44], ae: [79, 26.85], de: [64, 14.72], sg: [96, 35.51],
  za: [69, 45.9], us: [33.5, 20.78], gb: [59, 14.72], cn: [102.5, 24.25],
  jp: [108.5, 22.52], kr: [104, 21.65], au: [113.5, 48.5], br: [42.5, 45.03],
  ca: [31.5, 19.05], fr: [60, 16.45], it: [63, 18.19], es: [58.5, 20.78],
  nl: [61, 14.72], tr: [70, 19.92], sa: [76, 26.85], qa: [78, 26.85],
  om: [80.5, 27.71], kw: [76, 25.11], bh: [77, 26.85], eg: [71, 25.11],
  ke: [72.5, 36.37], ng: [61, 33.77], th: [95.5, 31.18], vn: [97, 32.04],
  id: [97.5, 38.11], my: [95.5, 34.64], ph: [102.5, 31.18], bd: [91.5, 27.71],
  lk: [88, 33.77], np: [89.5, 25.98], mx: [24.5, 29.44], ar: [39, 49.36],
  cl: [34.5, 48.5], ru: [72.5, 12.12], ua: [70.5, 15.59], pl: [67, 14.72],
  se: [65.5, 10.39], no: [63, 9.53], ch: [62.5, 17.32], be: [61.5, 15.59],
};

const HQ: [number, number] = COORDS.in;

export interface MapMarket {
  code: string;
  label: string;
  direction: string;
}

export function WorldMap({ markets }: { markets: MapMarket[] }) {
  const reduced = useReducedMotion();
  const pins = markets
    .filter((m) => COORDS[m.code] && m.code !== "in")
    .map((m) => ({ ...m, xy: COORDS[m.code] }));

  const arc = ([x1, y1]: [number, number], [x2, y2]: [number, number]) => {
    const mx = (x1 + x2) / 2;
    const my = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.18 - 4;
    return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
  };

  return (
    <div className="relative">
      <Image
        src="/admin/world-dots.svg"
        alt=""
        width={1190}
        height={600}
        unoptimized
        className="w-full opacity-90 select-none"
        draggable={false}
      />
      <svg viewBox="0 0 119 60" className="absolute inset-0 h-full w-full" role="img" aria-label={`Active markets: ${markets.map((m) => m.label).join(", ")}`}>
        <defs>
          <linearGradient id="map-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.05" />
            <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Connection arcs from HQ */}
        {pins.map((p, i) => (
          <motion.path
            key={p.code}
            d={arc(HQ, p.xy)}
            fill="none"
            stroke="url(#map-arc)"
            strokeWidth="0.28"
            strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.3, delay: 0.3 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {/* HQ pin — Mumbai */}
        <g>
          <circle cx={HQ[0]} cy={HQ[1]} r="1" fill="#38bdf8" opacity="0.28" className="adm-ping" />
          <circle cx={HQ[0]} cy={HQ[1]} r="0.85" fill="#38bdf8" opacity="0.25" />
          <circle cx={HQ[0]} cy={HQ[1]} r="0.5" fill="#7dd3fc" stroke="#04101f" strokeWidth="0.14" />
        </g>

        {/* Market pins */}
        {pins.map((p, i) => (
          <motion.g
            key={p.code}
            initial={reduced ? false : { opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 380, damping: 22, delay: 0.55 + i * 0.18 }}
            style={{ transformOrigin: `${p.xy[0]}px ${p.xy[1]}px` }}
          >
            <circle cx={p.xy[0]} cy={p.xy[1]} r="0.9" fill="#34d399" opacity="0.2" className="adm-ping" style={{ animationDelay: `${i * 0.5}s` }} />
            <circle cx={p.xy[0]} cy={p.xy[1]} r="0.42" fill="#34d399" stroke="#04101f" strokeWidth="0.12" />
            <title>{p.label}</title>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
