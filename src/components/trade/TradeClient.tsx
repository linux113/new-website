"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  Container as ContainerIcon,
  Globe2,
  Handshake,
  ShieldCheck,
  Ship,
  Target,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui";
import { useReducedMotion } from "@/components/motion";
import { cn } from "@/lib/cn";

/**
 * SM-10 / TRADE — premium B2B import/export experience.
 *
 * Layout
 *   1. Hero — technical label, headline with gold-glow accent, SEO
 *      lede, three compact trust indicators.
 *   2. Global trade visual — dark dotted world map with animated
 *      import lanes (electric blue, into Mumbai) and export lanes
 *      (gold, out of Mumbai), pulsing nodes, cargo / container /
 *      transport chips integrated as glass overlays.
 *   3. Two large premium cards — Import (blue accent) and Export
 *      (gold accent) with slowly rotating circular icon rings,
 *      hover border illumination and a smooth 3D lift.
 *   4. Trust bar — four items with vertical separators.
 *
 * Motion is scroll-triggered (IntersectionObserver, once), staggered
 * per element, and fully disabled under prefers-reduced-motion.
 *
 * Semantics: the homepage H1 lives in the hero, so this section's
 * headline is an H2 and Import/Export are H3 — the section forms its
 * own proper heading hierarchy.
 */

/* ------------------------------ data ------------------------------ */

const ORIGIN = { lat: 19.076, lng: 72.8777 }; // Mumbai

/** Inbound lanes — international suppliers → Mumbai (blue). */
const IMPORT_LANES = [
  { label: "SHA", lat: 31.23, lng: 121.47 }, // Shanghai
  { label: "RTM", lat: 51.92, lng: 4.48 }, // Rotterdam
  { label: "IST", lat: 41.01, lng: 28.98 }, // Istanbul
];

/** Outbound lanes — Mumbai → overseas buyers (gold). */
const EXPORT_LANES = [
  { label: "DXB", lat: 25.2, lng: 55.27 }, // Dubai
  { label: "SIN", lat: 1.35, lng: 103.82 }, // Singapore
  { label: "DUR", lat: -26.2, lng: 28.04 }, // Durban
  { label: "NYC", lat: 40.71, lng: -74.0 }, // New York
  { label: "HAM", lat: 53.55, lng: 9.99 }, // Hamburg
];

const HERO_TRUST: { Icon: LucideIcon; label: string }[] = [
  { Icon: BadgeCheck, label: "Verified Suppliers" },
  { Icon: ShieldCheck, label: "Quality Assured" },
  { Icon: Clock3, label: "On-Time Delivery" },
];

const TRUST_BAR: { Icon: LucideIcon; title: string; sub: string }[] = [
  { Icon: Globe2, title: "Global Network", sub: "Strong international presence" },
  { Icon: Handshake, title: "Trusted Partnerships", sub: "Long-term supplier relationships" },
  { Icon: ShieldCheck, title: "Quality Commitment", sub: "Tested. Verified. Delivered." },
  { Icon: Target, title: "Strategic Sourcing", sub: "Right material, right time" },
];

const BLUE = "#38BDF8";
const GOLD = "#E5C074";

/* --------------------------- utilities ---------------------------- */

/** Equirectangular projection for the 1000×500 map viewBox. */
function project(lat: number, lng: number) {
  return { x: ((lng + 180) / 360) * 1000, y: ((90 - lat) / 180) * 500 };
}

function curvedPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const cx1 = a.x + dx * 0.35;
  const cy1 = a.y + dy * 0.1 - Math.abs(dx) * 0.18;
  const cx2 = a.x + dx * 0.7;
  const cy2 = b.y - dy * 0.1 - Math.abs(dx) * 0.12;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${cx1.toFixed(1)} ${cy1.toFixed(
    1,
  )}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}



/* ----------------------------- hooks ------------------------------ */

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            requestAnimationFrame(() => setInView(true));
            io.disconnect();
          }
        }
      },
      { threshold: 0.18 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

/* --------------------------- sub-blocks --------------------------- */

function TradeMap({ shown }: { shown: boolean }) {
  const reduced = useReducedMotion();
  const origin = project(ORIGIN.lat, ORIGIN.lng);

  const importPaths = IMPORT_LANES.map((lane) => ({
    ...lane,
    d: curvedPath(project(lane.lat, lane.lng), origin), // into Mumbai
  }));
  const exportPaths = EXPORT_LANES.map((lane) => ({
    ...lane,
    d: curvedPath(origin, project(lane.lat, lane.lng)), // out of Mumbai
  }));

  return (
    <figure className="relative m-0">
      <div
        className={cn(
          "ie-map keep-dark relative aspect-[2/1] w-full overflow-hidden rounded-2xl border border-white/10",
          "bg-gradient-to-br from-[#070B0E] via-[#05080B] to-[#04060A]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_40px_90px_-50px_rgba(214,168,74,0.35)]",
        )}
        role="img"
        aria-label="World map with animated trade routes: metal import lanes in blue into Mumbai and metal export lanes in gold from Mumbai to international markets"
      >
        {/* Atmospheric gold lighting around origin */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(20rem 13rem at ${origin.x / 10}% ${
              origin.y / 5
            }%, rgba(214,168,74,0.14), transparent 70%)`,
          }}
        />

        <svg
          viewBox="0 0 1000 500"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="ie-route-gold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F2C766" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D8A84E" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="ie-route-blue" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
            </linearGradient>
            <filter id="ie-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Graticule */}
          <g stroke="#161B1F" strokeWidth="0.5" fill="none" opacity="0.85" aria-hidden>
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={500} />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={(i + 1) * 83.3}
                x2={1000}
                y2={(i + 1) * 83.3}
              />
            ))}
          </g>

          {/* Dotted landmass — cached asset, not inlined markup. */}
          <image
            href="/world-dots.svg"
            x="0"
            y="0"
            width="1000"
            height="500"
            preserveAspectRatio="xMidYMid meet"
            opacity="0.9"
          />

          {/* Lanes — draw on progressively when shown */}
          <g filter="url(#ie-glow)" fill="none" strokeLinecap="round">
            {importPaths.map((p, i) => (
              <path
                key={`imp-${p.label}`}
                d={p.d}
                stroke="url(#ie-route-blue)"
                strokeWidth="1.1"
                strokeDasharray="1200"
                strokeDashoffset={shown ? 0 : 1200}
                style={{
                  transition: `stroke-dashoffset 1.7s cubic-bezier(0.22,1,0.36,1) ${
                    250 + i * 160
                  }ms`,
                }}
              />
            ))}
            {exportPaths.map((p, i) => (
              <path
                key={`exp-${p.label}`}
                d={p.d}
                stroke="url(#ie-route-gold)"
                strokeWidth="1.1"
                strokeDasharray="1200"
                strokeDashoffset={shown ? 0 : 1200}
                style={{
                  transition: `stroke-dashoffset 1.7s cubic-bezier(0.22,1,0.36,1) ${
                    400 + i * 140
                  }ms`,
                }}
              />
            ))}
          </g>

          {/* Moving particles along the lanes */}
          {!reduced &&
            [
              ...importPaths.map((p) => ({ p, color: "#7DD3FC", dur: 8 })),
              ...exportPaths.map((p) => ({ p, color: "#FBE7A8", dur: 9 })),
            ].map(({ p, color, dur }, i) => (
              <circle
                key={`pt-${i}`}
                r="1.8"
                fill={color}
                style={{
                  offsetPath: `path('${p.d}')`,
                  offsetDistance: "0%",
                  animation: `ie-route ${dur + (i % 3)}s linear ${i * 0.8}s infinite`,
                  filter: `drop-shadow(0 0 5px ${color})`,
                }}
              />
            ))}

          {/* Endpoint nodes — import (blue) */}
          {importPaths.map((p) => {
            const n = project(p.lat, p.lng);
            return (
              <g key={`n-imp-${p.label}`} transform={`translate(${n.x},${n.y})`}>
                {!reduced && (
                  <circle
                    r="7"
                    fill="none"
                    stroke={BLUE}
                    strokeWidth="0.7"
                    opacity="0.5"
                    style={{
                      transformOrigin: "center",
                      animation: "ie-node-ping 3s ease-out infinite",
                    }}
                  />
                )}
                <circle r="2.2" fill="#7DD3FC" opacity="0.95" />
                <text
                  x="0"
                  y="-9"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#727D86"
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                  letterSpacing="1"
                >
                  {p.label}
                </text>
              </g>
            );
          })}

          {/* Endpoint nodes — export (gold) */}
          {exportPaths.map((p) => {
            const n = project(p.lat, p.lng);
            return (
              <g key={`n-exp-${p.label}`} transform={`translate(${n.x},${n.y})`}>
                {!reduced && (
                  <circle
                    r="7"
                    fill="none"
                    stroke={GOLD}
                    strokeWidth="0.7"
                    opacity="0.5"
                    style={{
                      transformOrigin: "center",
                      animation: "ie-node-ping 3s ease-out 1s infinite",
                    }}
                  />
                )}
                <circle r="2.2" fill="#FBE7A8" opacity="0.95" />
                <text
                  x="0"
                  y="-9"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#727D86"
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                  letterSpacing="1"
                >
                  {p.label}
                </text>
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
                    animation: `ie-origin-ping 3.4s ease-out ${i * 1.1}s infinite`,
                  }}
                />
              ))}
            <circle r="12" fill="#E5C074" opacity="0.14" />
            <circle
              r="3.4"
              fill="#FBE7A8"
              stroke="#D8A84E"
              strokeWidth="0.9"
              style={{ filter: "drop-shadow(0 0 7px rgba(242,199,102,0.9))" }}
            />
            <text
              x="10"
              y="4"
              fontSize="9.5"
              fill="#E5C074"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              letterSpacing="1.5"
            >
              MUMBAI · ORIGIN
            </text>
          </g>
        </svg>

        {/* Legend */}
        <div className="pointer-events-none absolute right-3 top-3 flex flex-col gap-1.5">
          <span className="flex items-center gap-2 rounded-md border border-white/10 bg-[#05080B]/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#A9B2BA] backdrop-blur-sm">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_6px_rgba(56,189,248,0.9)]"
            />
            Import lanes
          </span>
          <span className="flex items-center gap-2 rounded-md border border-white/10 bg-[#05080B]/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#A9B2BA] backdrop-blur-sm">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-[#E5C074] shadow-[0_0_6px_rgba(229,185,95,0.9)]"
            />
            Export lanes
          </span>
        </div>

        {/* Status chip */}
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-md border border-white/10 bg-[#05080B]/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#A9B2BA] backdrop-blur-sm">
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-[#5BE49B]"
            style={reduced ? undefined : { animation: "ie-dot 2.4s ease-in-out infinite" }}
          />
          Global trade network
        </div>

        {/* Cargo / containers / heavy transport — glass chips */}
        <div className="absolute bottom-3 left-3 hidden gap-2 sm:flex">
          {[
            { Icon: Ship, label: "Cargo vessel" },
            { Icon: ContainerIcon, label: "Container stacks" },
            { Icon: Truck, label: "Heavy transport" },
          ].map(({ Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#A9B2BA] backdrop-blur-md"
            >
              <Icon size={14} strokeWidth={1.5} aria-hidden className="text-[#C8A45D]" />
              {label}
            </span>
          ))}
        </div>

      </div>

      {/* SEO-friendly caption */}
      <figcaption className="mt-3 font-mono text-xs tracking-[0.06em] text-[#727D86]">
        Global metal supply — industrial metal trading, import sourcing and
        export dispatch from Mumbai
      </figcaption>
    </figure>
  );
}

function IconRing({
  accent,
  children,
}: {
  accent: "blue" | "gold";
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const hex = accent === "blue" ? BLUE : GOLD;
  return (
    <div className="relative size-24">
      {/* static hairline ring */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-white/[0.08]"
      />
      {/* slow rotating circular progress arc */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${hex}2E 48deg, ${hex}CC 68deg, transparent 92deg)`,
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
          animation: reduced ? undefined : "ie-spin 14s linear infinite",
        }}
      />
      <span className="absolute inset-[6px] flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-b from-[#0E141A] to-[#090D11] text-[#F5F7F8] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        {children}
      </span>
    </div>
  );
}

interface TradeCardProps {
  index: string;
  label: string;
  title: string;
  description: string;
  metaLabel: string;
  /** Admin-managed status line; the footer row is hidden when empty. */
  metaValue?: string;
  accent: "blue" | "gold";
  delay: number;
  children: React.ReactNode;
}

function TradeCard({
  index,
  label,
  title,
  description,
  metaLabel,
  metaValue,
  accent,
  delay,
  children,
}: TradeCardProps) {
  const rgb = accent === "blue" ? "56,189,248" : "229,185,95";

  return (
    <article
      className={cn(
        "ie-el group relative h-full rounded-[22px] p-px",
        "bg-white/10 transition-[background-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1.5",
        accent === "blue"
          ? "hover:bg-gradient-to-b hover:from-[#38BDF8]/60 hover:via-white/10 hover:to-white/5 hover:shadow-[0_30px_70px_-35px_rgba(56,189,248,0.5)]"
          : "hover:bg-gradient-to-b hover:from-[#E5C074]/60 hover:via-white/10 hover:to-white/5 hover:shadow-[0_30px_70px_-35px_rgba(229,185,95,0.5)]",
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* soft ambient outer glow (hover) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-[30px] opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-60"
        style={{
          background: `radial-gradient(closest-side, rgba(${rgb},0.16), transparent)`,
        }}
      />
      <div className="relative flex h-full flex-col rounded-[21px] border border-white/[0.06] bg-gradient-to-b from-[#0B1116] to-[#070A0D] p-8 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <span
            className="flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{
              borderColor: `rgba(${rgb},0.28)`,
              color: accent === "blue" ? "#7DD3FC" : "#E5C074",
              backgroundColor: `rgba(${rgb},0.06)`,
            }}
          >
            <span
              aria-hidden
              className="size-1.5 rounded-full"
              style={{
                backgroundColor: accent === "blue" ? BLUE : GOLD,
                boxShadow: `0 0 6px rgba(${rgb},0.9)`,
              }}
            />
            {label}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#727D86]">
            {index}
          </span>
        </div>

        <div className="mt-9">
          <IconRing accent={accent}>{children}</IconRing>
        </div>

        <h3 className="mt-9 font-display text-[1.65rem] font-semibold leading-tight tracking-tight text-[#F5F7F8]">
          {title}
        </h3>
        <p className="mb-8 mt-3 max-w-md text-[13.5px] leading-relaxed text-[#A9B2BA]">
          {description}
        </p>

        {metaValue ? (
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#727D86]">
              {metaLabel}
            </span>
            <span className="font-mono text-xs tracking-[0.1em] text-[#727D86]">
              {metaValue}
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/* ----------------------------- section ---------------------------- */

export function TradeClient({
  importMeta,
  exportMeta,
}: {
  /** content.trade.import.meta — blank hides the card footer. */
  importMeta?: string;
  /** content.trade.export.meta — blank hides the card footer. */
  exportMeta?: string;
}) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const shown = inView || reduced;

  return (
    <section
      aria-labelledby="home-trade"
      className="relative overflow-hidden border-t border-white/10 bg-[#05080B] py-24 text-[#F5F7F8] lg:py-32"
    >
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%,#000 20%,transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-44 -top-44 h-[30rem] w-[30rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(200,164,93,0.09), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-44 h-[28rem] w-[28rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.07), transparent 70%)",
        }}
      />

      <div ref={ref} className={shown ? "ie-on" : undefined}>
        <Container className="relative">
          {/* ---------------- Hero ---------------- */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <p className="ie-el font-mono text-[1rem] font-semibold uppercase tracking-[0.16em]" style={{ transitionDelay: "0ms" }}>
                <span className="text-[#C8A45D]">SM-10</span>
                <span className="mx-2 text-[#727D86]">/</span>
                <span className="text-[#A9B2BA]">Trade</span>
              </p>

              <h2
                id="home-trade"
                className="ie-el mt-5 font-display text-[clamp(2.3rem,4.6vw,4rem)] font-semibold leading-[1.04] tracking-tight text-[#F5F7F8]"
                style={{ transitionDelay: "90ms" }}
              >
                Two directions,
                <br />
                one{" "}
                <span
                  className="bg-gradient-to-r from-[#F2C766] via-[#E5C074] to-[#C8A45D] bg-clip-text text-transparent"
                  style={{ filter: "drop-shadow(0 0 20px rgba(230,190,110,0.35))" }}
                >
                  standard
                </span>
              </h2>

              <p
                className="ie-el mt-6 max-w-xl text-[15px] leading-relaxed text-[#A9B2BA] sm:text-base"
                style={{ transitionDelay: "180ms" }}
              >
                We connect global markets with precision, ensuring quality
                materials, verified sources, and reliable delivery —
                international metal sourcing and export supply, handled to
                one standard.
              </p>

              <ul
                className="ie-el mt-9 flex flex-wrap items-center gap-x-8 gap-y-3"
                style={{ transitionDelay: "270ms" }}
              >
                {HERO_TRUST.map(({ Icon, label }) => (
                  <li key={label} className="flex items-center gap-2.5">
                    <Icon
                      size={15}
                      strokeWidth={1.7}
                      aria-hidden
                      className="text-[#C8A45D]"
                    />
                    <span className="text-[13px] font-medium text-[#C9D0D5]">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6">
              <TradeMap shown={shown} />
            </div>
          </div>

          {/* ---------------- Import / Export cards ---------------- */}
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-20 lg:gap-8">
            <TradeCard
              index="01"
              label="Inbound"
              title="Import"
              description="Sourcing material from international suppliers against specific buyer requirements — grades, quantities and schedules confirmed before commitment."
              metaLabel="Routes & Origins"
              metaValue={importMeta}
              accent="blue"
              delay={0}
            >
              <span className="relative flex items-center justify-center">
                <Ship
                  size={30}
                  strokeWidth={1.3}
                  aria-hidden
                  className="text-[#7DD3FC]"
                />
                <span className="absolute -right-1.5 -top-1.5 flex size-[18px] items-center justify-center rounded-full border border-[#38BDF8]/40 bg-[#0B1015] text-[#7DD3FC]">
                  <ArrowDownLeft size={10} strokeWidth={2} aria-hidden />
                </span>
              </span>
            </TradeCard>

            <TradeCard
              index="02"
              label="Outbound"
              title="Export"
              description="Supplying material to overseas buyers with export documentation and coordinated dispatch from Mumbai."
              metaLabel="Markets & Terms"
              metaValue={exportMeta}
              accent="gold"
              delay={140}
            >
              <span className="relative flex items-center justify-center">
                <Globe2
                  size={30}
                  strokeWidth={1.3}
                  aria-hidden
                  className="text-[#E5C074]"
                />
                <span className="absolute -right-1.5 -top-1.5 flex size-[18px] items-center justify-center rounded-full border border-[#E5C074]/40 bg-[#0B1015] text-[#E5C074]">
                  <ArrowUpRight size={10} strokeWidth={2} aria-hidden />
                </span>
              </span>
            </TradeCard>
          </div>

          {/* ---------------- Trust bar ---------------- */}
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] lg:mt-16 lg:grid-cols-4">
            {TRUST_BAR.map(({ Icon, title, sub }, i) => (
              <div
                key={title}
                className="ie-el flex items-start gap-4 bg-[#070A0D] p-6 sm:p-7"
                style={{ transitionDelay: `${320 + i * 90}ms` }}
              >
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  aria-hidden
                  className="mt-0.5 shrink-0 text-[#C8A45D]"
                />
                <div>
                  <p className="text-[13.5px] font-medium text-[#F5F7F8]">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#727D86]">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <style>{`
        .ie-el { opacity: 0; transform: translateY(22px); }
        .ie-on .ie-el {
          opacity: 1; transform: none;
          transition: opacity .9s cubic-bezier(0.22,1,0.36,1),
                      transform .9s cubic-bezier(0.22,1,0.36,1);
        }
        .ie-map { opacity: 0; transform: scale(.97); filter: blur(8px); }
        .ie-on .ie-map {
          opacity: 1; transform: none; filter: none;
          transition: opacity 1.2s cubic-bezier(0.22,1,0.36,1),
                      transform 1.2s cubic-bezier(0.22,1,0.36,1),
                      filter 1.2s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes ie-spin { to { transform: rotate(360deg); } }
        @keyframes ie-dot { 0%,100% { opacity:.35; } 50% { opacity:1; } }
        @keyframes ie-node-ping { 0% { transform: scale(.5); opacity:.9; } 100% { transform: scale(2.6); opacity:0; } }
        @keyframes ie-origin-ping { 0% { transform: scale(.55); opacity:.9; } 100% { transform: scale(3.4); opacity:0; } }
        @keyframes ie-route {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ie-el, .ie-map { opacity: 1 !important; transform: none !important; filter: none !important; }
          .ie-on .ie-el, .ie-on .ie-map { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
