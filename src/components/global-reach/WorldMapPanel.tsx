"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/components/motion";
import {
  MUMBAI_ORIGIN,
  type GlobalRegion,
} from "@/content/global-regions";
import { project } from "./world-map-data";

/**
 * Premium world-map visualisation.
 *
 * Layers (bottom → top):
 *   1. Dotted world landmass (SVG string generated server-side)
 *   2. Technical lat/long graticule + coordinate labels
 *   3. Curved gold routes from Mumbai to each region (draw-on)
 *   4. Region markers (pulsing gold nodes)
 *   5. Mumbai origin node (concentric pulse rings + label)
 *   6. Slow scan line + soft radial glow
 *
 * The dotted landmass string is passed from the server page so this
 * client component never imports `dotted-map` (a Node-only package).
 */

interface WorldMapPanelProps {
  regions: GlobalRegion[];
  activeId: string | null;
  onHover: (id: string | null) => void;
  dotsSvg: string;
  className?: string;
}

export function WorldMapPanel({
  regions,
  activeId,
  onHover,
  dotsSvg,
  className,
}: WorldMapPanelProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const origin = project(MUMBAI_ORIGIN.lat, MUMBAI_ORIGIN.lng);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={cn(
        "relative aspect-[2/1] w-full overflow-hidden rounded-xl border border-[#252A2D]",
        "bg-gradient-to-br from-[#080B0D] via-[#060809] to-[#050708]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_30px_80px_-40px_rgba(214,168,74,0.25)]",
        className,
      )}
      role="img"
      aria-label="World map showing SRIYAAN METALS export routes from Mumbai"
    >
      {/* Soft radial gold glow behind Mumbai */}
      <div
        aria-hidden
        className="keep-dark pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(22rem 16rem at ${origin.x / 10}% ${
            origin.y / 5
          }%, rgba(214,168,74,0.18), transparent 70%)`,
        }}
      />

      {/* Inner glow + border sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.65)" }}
      />

      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="gr-route" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F2C766" stopOpacity="0.1" />
            <stop offset="40%" stopColor="#E5C074" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#D8A84E" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="gr-node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBE7A8" />
            <stop offset="45%" stopColor="#E5C074" />
            <stop offset="100%" stopColor="#D8A84E" stopOpacity="0" />
          </radialGradient>
          <filter id="gr-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Graticule */}
        <g
          stroke="#1a1f22"
          strokeWidth="0.5"
          fill="none"
          opacity="0.8"
          aria-hidden
        >
          {Array.from({ length: 11 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 100}
              y1={0}
              x2={i * 100}
              y2={500}
            />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={(i + 1) * 83.3}
              x2={1000}
              y2={(i + 1) * 83.3}
            />
          ))}
        </g>

        {/* Landmass dots — inline the SVG inner markup */}
        <g
          dangerouslySetInnerHTML={{ __html: extractSvgInner(dotsSvg) }}
          opacity="0.9"
        />

        {/* Routes */}
        <g filter="url(#gr-glow)">
          {regions.map((region, i) => {
            const target = project(region.marker.lat, region.marker.lng);
            const d = curvedPath(origin, target);
            const isActive = activeId === region.id;
            const idle = activeId && !isActive;
            return (
              <path
                key={`route-${region.id}`}
                d={d}
                fill="none"
                stroke="url(#gr-route)"
                strokeWidth={isActive ? 1.8 : 1.1}
                strokeLinecap="round"
                strokeDasharray="1200"
                strokeDashoffset={mounted || reduced ? 0 : 1200}
                style={{
                  transition:
                    "stroke-width 400ms ease, opacity 400ms ease, stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1)",
                  transitionDelay: `${200 + i * 140}ms`,
                  opacity: idle ? 0.25 : isActive ? 1 : 0.75,
                }}
              />
            );
          })}
        </g>

        {/* Route particles */}
        {!reduced &&
          regions.map((region, i) => {
            const target = project(region.marker.lat, region.marker.lng);
            const d = curvedPath(origin, target);
            const isActive = activeId === region.id;
            const idle = activeId && !isActive;
            return (
              <circle
                key={`particle-${region.id}`}
                r={isActive ? 2.6 : 1.8}
                fill="#FBE7A8"
                opacity={idle ? 0.2 : 0.95}
                style={{
                  offsetPath: `path('${d}')`,
                  offsetDistance: "0%",
                  animation: `gr-particle ${7 + i}s linear ${i * 0.7}s infinite`,
                  filter: "drop-shadow(0 0 6px rgba(242,199,102,0.9))",
                  transition: "opacity 400ms ease",
                }}
              />
            );
          })}

        {/* Region markers */}
        {regions.map((region) => {
          const p = project(region.marker.lat, region.marker.lng);
          const isActive = activeId === region.id;
          const idle = activeId && !isActive;
          return (
            <g
              key={`marker-${region.id}`}
              transform={`translate(${p.x},${p.y})`}
              opacity={idle ? 0.45 : 1}
              style={{ transition: "opacity 300ms ease", cursor: "pointer" }}
              onMouseEnter={() => onHover(region.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onHover(isActive ? null : region.id)}
              tabIndex={0}
              role="button"
              aria-label={`${region.name} ${region.confirmed ? "confirmed" : "prospective"} market`}
              aria-pressed={isActive}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onHover(isActive ? null : region.id);
                  }
                }}
              >
                {/* Large invisible hit target (~44px) for pointer/touch */}
                <circle r="22" fill="transparent" />
                {!reduced && (
                  <circle
                    r="9"
                  fill="none"
                  stroke="#E5C074"
                  strokeWidth="0.8"
                  className={isActive ? "gr-ping" : ""}
                  style={{
                    transformOrigin: "center",
                    opacity: isActive ? 0.9 : 0.4,
                  }}
                />
              )}
              <circle r="5.5" fill="url(#gr-node)" opacity="0.55" />
              <circle
                r="2.6"
                fill="#FBE7A8"
                stroke="#D8A84E"
                strokeWidth="0.6"
                style={{
                  filter: "drop-shadow(0 0 5px rgba(242,199,102,0.9))",
                }}
              />
            </g>
          );
        })}

        {/* Mumbai origin */}
        <g transform={`translate(${origin.x},${origin.y})`}>
          {!reduced &&
            [0, 1, 2].map((i) => (
              <circle
                key={`ring-${i}`}
                r="8"
                fill="none"
                stroke="#F2C766"
                strokeWidth="0.8"
                style={{
                  transformOrigin: "center",
                  animation: `gr-origin-ping 3.2s ease-out ${i * 1}s infinite`,
                }}
              />
            ))}
          <circle r="14" fill="url(#gr-node)" opacity="0.5" />
          <circle
            r="4"
            fill="#FBE7A8"
            stroke="#D8A84E"
            strokeWidth="1"
            style={{ filter: "drop-shadow(0 0 8px rgba(242,199,102,0.95))" }}
          />
        </g>
      </svg>

      {/* Mumbai label */}
      <div
        className="pointer-events-none absolute -translate-x-1/2 px-2 text-center"
        style={{
          left: `${origin.x / 10}%`,
          top: `${Math.min(86, origin.y / 5 + 5)}%`,
        }}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#F2C766] sm:text-[10px]">
          {MUMBAI_ORIGIN.label}
        </p>
        <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#A9B2BA] sm:text-[9px]">
          {MUMBAI_ORIGIN.sub}
        </p>
      </div>

      {/* Scan line */}
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px"
          style={{
            left: 0,
            background:
              "linear-gradient(to bottom, transparent, rgba(214,168,74,0.35), transparent)",
            animation: "gr-scan 11s linear infinite",
            mixBlendMode: "screen",
          }}
        />
      )}


      <style>{`
        @keyframes gr-scan { 0% { transform: translateX(-20px); opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { transform: translateX(calc(100vw + 20px)); opacity: 0; } }
        @keyframes gr-particle {
          0% { offset-distance: 0%; opacity: 0; }
          8% { opacity: 1; }
          60% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes gr-origin-ping {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(3.6); opacity: 0; }
        }
        .gr-ping { transform-box: fill-box; transform-origin: center; animation: gr-marker-ping 2.2s ease-out infinite; }
        @keyframes gr-marker-ping { 0% { transform: scale(0.7); opacity: 0.8; } 100% { transform: scale(2.4); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .gr-ping { animation: none !important; } }
      `}</style>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function curvedPath(
  a: { x: number; y: number },
  b: { x: number; y: number },
): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  // Control points pulled toward the midpoint and lifted for an arc.
  const cx1 = a.x + dx * 0.35;
  const cy1 = a.y + dy * 0.1 - Math.abs(dx) * 0.18;
  const cx2 = a.x + dx * 0.7;
  const cy2 = b.y - dy * 0.1 - Math.abs(dx) * 0.12;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${cx1.toFixed(1)} ${cy1.toFixed(
    1,
  )}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

/** Extract the inner content of a <svg>…</svg> string. */
function extractSvgInner(svg: string): string {
  const open = svg.indexOf(">");
  const close = svg.lastIndexOf("</svg>");
  if (open === -1 || close === -1) return "";
  return svg.slice(open + 1, close);
}
