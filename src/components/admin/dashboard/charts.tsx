"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Dashboard visualisation kit — hand-rolled SVG (no chart lib).
 * Everything renders real values passed from the server; the client
 * only animates. All motion respects prefers-reduced-motion.
 */

/* ---------------- CountUp ---------------- */

export function CountUp({ value, className }: { value: number; className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduced || !inView) return;
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduced]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {(reduced ? value : display).toLocaleString("en-IN")}
    </span>
  );
}

/* ---------------- Sparkline ---------------- */

export function Sparkline({
  points,
  color = "#38bdf8",
  className,
}: {
  points: number[];
  color?: string;
  className?: string;
}) {
  const id = useId();
  const w = 120;
  const h = 36;
  const flat = points.every((p) => p === points[0]);

  if (flat) {
    // No meaningful trend — draw a quiet baseline instead of a filled block.
    return (
      <svg viewBox={`0 0 ${w} ${h}`} aria-hidden className={cn("h-9 w-full", className)}>
        <line x1="0" x2={w} y1={h / 2} y2={h / 2} stroke="#24304c" strokeWidth="1.5" strokeDasharray="2 4" strokeLinecap="round" />
        <circle cx={w - 3} cy={h / 2} r="2" fill="#5f6b86" />
      </svg>
    );
  }

  const max = Math.max(...points, 1);
  const step = w / Math.max(points.length - 1, 1);
  const coords = points.map((p, i) => [i * step, h - 4 - (p / max) * (h - 10)] as const);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const last = coords[coords.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} aria-hidden className={cn("h-9 w-full", className)}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        className="adm-draw"
        style={{ "--adm-draw-len": 260 } as React.CSSProperties}
      />
      {last ? <circle cx={last[0]} cy={last[1]} r="2.2" fill={color} className="adm-fade" /> : null}
    </svg>
  );
}

/* ---------------- Performance area chart ---------------- */

export interface DailyPoint {
  /** ISO date (yyyy-mm-dd) */
  d: string;
  enquiries: number;
  contacts: number;
  vendors: number;
}

const RANGES = [
  { key: "7D", days: 7 },
  { key: "30D", days: 30 },
  { key: "90D", days: 90 },
  { key: "1Y", days: 365 },
] as const;

const SERIES = [
  { key: "enquiries", label: "Product enquiries", color: "#38bdf8" },
  { key: "contacts", label: "Contact messages", color: "#818cf8" },
  { key: "vendors", label: "Vendor requests", color: "#34d399" },
] as const;

function bucketize(data: DailyPoint[], days: number): DailyPoint[] {
  const slice = data.slice(-days);
  if (days <= 30) return slice;
  // Aggregate into ~30 buckets for readability on long ranges.
  const size = Math.ceil(slice.length / 30);
  const out: DailyPoint[] = [];
  for (let i = 0; i < slice.length; i += size) {
    const chunk = slice.slice(i, i + size);
    out.push({
      d: chunk[chunk.length - 1].d,
      enquiries: chunk.reduce((a, c) => a + c.enquiries, 0),
      contacts: chunk.reduce((a, c) => a + c.contacts, 0),
      vendors: chunk.reduce((a, c) => a + c.vendors, 0),
    });
  }
  return out;
}

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function PerformanceChart({ data }: { data: DailyPoint[] }) {
  const reduced = useReducedMotion();
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("30D");
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const days = RANGES.find((r) => r.key === range)!.days;
  const points = useMemo(() => bucketize(data, days), [data, days]);

  const W = 820;
  const H = 280;
  const PAD = { l: 34, r: 10, t: 14, b: 26 };
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const max = Math.max(4, ...points.flatMap((p) => [p.enquiries, p.contacts, p.vendors]));
  const niceMax = Math.ceil(max / 4) * 4;
  const x = (i: number) => PAD.l + (i / Math.max(points.length - 1, 1)) * iw;
  const y = (v: number) => PAD.t + ih - (v / niceMax) * ih;

  const smooth = (vals: number[]) => {
    if (vals.length < 2) return "";
    let d = `M${x(0).toFixed(1)},${y(vals[0]).toFixed(1)}`;
    for (let i = 1; i < vals.length; i++) {
      const x0 = x(i - 1);
      const x1 = x(i);
      const cx = (x0 + x1) / 2;
      d += ` C${cx.toFixed(1)},${y(vals[i - 1]).toFixed(1)} ${cx.toFixed(1)},${y(vals[i]).toFixed(1)} ${x1.toFixed(1)},${y(vals[i]).toFixed(1)}`;
    }
    return d;
  };

  const paths = SERIES.map((s) => {
    const vals = points.map((p) => p[s.key]);
    const line = smooth(vals);
    return { ...s, line, area: `${line} L${x(points.length - 1).toFixed(1)},${(PAD.t + ih).toFixed(1)} L${PAD.l},${(PAD.t + ih).toFixed(1)} Z` };
  });

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / iw) * (points.length - 1));
    setHover(Math.max(0, Math.min(points.length - 1, i)));
  };

  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const h = hover != null ? points[hover] : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          {SERIES.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5 text-mono-micro text-slate">
              <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
              {s.label}
            </span>
          ))}
        </div>
        <div role="tablist" aria-label="Date range" className="flex rounded-xs border border-line p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              role="tab"
              aria-selected={range === r.key}
              onClick={() => {
                setRange(r.key);
                setHover(null);
              }}
              className={cn(
                "relative rounded-[6px] px-3 py-1.5 text-mono-micro transition-colors",
                range === r.key ? "text-[#04101f]" : "text-slate hover:text-ink",
              )}
            >
              {range === r.key ? (
                <motion.span
                  layoutId="perf-range"
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                  className="absolute inset-0 rounded-[6px] bg-accent"
                  aria-hidden
                />
              ) : null}
              <span className="relative z-10">{r.key}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Lead volume over time"
          className="w-full cursor-crosshair"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            {paths.map((p) => (
              <linearGradient key={p.key} id={`area-${p.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={p.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={p.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid + y labels */}
          {gridLines.map((g) => {
            const gy = PAD.t + ih - g * ih;
            return (
              <g key={g}>
                <line x1={PAD.l} x2={W - PAD.r} y1={gy} y2={gy} stroke="#1a2338" strokeWidth="1" strokeDasharray={g === 0 ? undefined : "3 5"} />
                <text x={PAD.l - 8} y={gy + 3} textAnchor="end" fontSize="9" fill="#5f6b86" fontFamily="var(--font-mono)">
                  {Math.round(g * niceMax)}
                </text>
              </g>
            );
          })}
          {/* x labels */}
          {points.map((p, i) => {
            const every = Math.ceil(points.length / 6);
            if (i % every !== 0 && i !== points.length - 1) return null;
            return (
              <text key={p.d} x={x(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#5f6b86" fontFamily="var(--font-mono)">
                {fmtDate(p.d)}
              </text>
            );
          })}

          {/* Areas + lines */}
          {paths.map((p, si) => (
            <g key={`${p.key}-${range}`}>
              <motion.path
                d={p.area}
                fill={`url(#area-${p.key})`}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 + si * 0.12 }}
              />
              <motion.path
                d={p.line}
                fill="none"
                stroke={p.color}
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, delay: si * 0.12, ease: [0.22, 1, 0.36, 1] }}
              />
            </g>
          ))}

          {/* Hover crosshair + points */}
          {h != null && hover != null ? (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={PAD.t + ih} stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1" />
              {SERIES.map((s) => (
                <circle key={s.key} cx={x(hover)} cy={y(h[s.key])} r="3.4" fill={s.color} stroke="#0c1322" strokeWidth="1.5" />
              ))}
            </g>
          ) : null}
        </svg>

        {/* Tooltip */}
        {h != null && hover != null ? (
          <div
            role="status"
            className="adm-card pointer-events-none absolute top-2 z-10 w-44 p-3 shadow-float"
            style={{
              left: `calc(${((x(hover) / W) * 100).toFixed(2)}% ${x(hover) / W > 0.72 ? "- 12rem" : "+ 0.75rem"})`,
            }}
          >
            <p className="text-mono-micro text-mist">{fmtDate(h.d)}</p>
            <dl className="mt-1.5 flex flex-col gap-1">
              {SERIES.map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-2">
                  <dt className="flex items-center gap-1.5 text-mono-micro text-slate">
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
                    {s.label.split(" ")[0]}
                  </dt>
                  <dd className="text-body-sm font-medium text-ink tabular-nums">{h[s.key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------- Donut (enquiry status) ---------------- */

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export function StatusDonut({ slices, centerLabel }: { slices: DonutSlice[]; centerLabel: string }) {
  const reduced = useReducedMotion();
  const total = Math.max(slices.reduce((a, s) => a + s.value, 0), 1);
  const R = 56;
  const C = 2 * Math.PI * R;
  // Precompute cumulative offsets (pure — no reassignment during render).
  const arcs = slices.map((s) => ({ ...s, dash: (s.value / total) * C }));
  const offsets = arcs.map((_, i) => arcs.slice(0, i).reduce((a, s) => a + s.dash, 0));

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative shrink-0">
        <svg width="150" height="150" viewBox="0 0 150 150" role="img" aria-label={`Enquiry status distribution, ${total} total`}>
          <circle cx="75" cy="75" r={R} fill="none" stroke="#1a2338" strokeWidth="13" />
          {arcs.map((s, i) => (
            <motion.circle
              key={s.label}
              cx="75"
              cy="75"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="13"
              strokeLinecap={s.dash / C > 0.02 ? "round" : "butt"}
              strokeDasharray={`${s.dash} ${C - s.dash}`}
              strokeDashoffset={-offsets[i]}
              transform="rotate(-90 75 75)"
              initial={reduced ? false : { opacity: 0, strokeDasharray: `0 ${C}` }}
              animate={{ opacity: 1, strokeDasharray: `${s.dash} ${C - s.dash}` }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <CountUp value={total} className="font-display text-[1.75rem] font-semibold text-ink" />
          <span className="text-mono-micro text-mist">{centerLabel}</span>
        </div>
      </div>

      <ul className="min-w-0 flex-1 space-y-2.5">
        {slices.map((s) => {
          const pct = Math.round((s.value / total) * 100);
          return (
            <li key={s.label} className="flex items-center gap-2.5">
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
              <span className="min-w-0 flex-1 truncate text-body-sm text-slate">{s.label}</span>
              <span className="text-body-sm font-medium text-ink tabular-nums">{s.value}</span>
              <span className="w-9 text-right text-mono-micro text-mist tabular-nums">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------- Horizontal product bars ---------------- */

export interface BarRow {
  label: string;
  value: number;
  meta?: string;
}

export function ProductBars({ rows, unit }: { rows: BarRow[]; unit: string }) {
  const reduced = useReducedMotion();
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-4">
      {rows.map((r, i) => (
        <li key={r.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate text-body-sm text-ink">{r.label}</span>
            <span className="shrink-0 text-mono-micro text-slate tabular-nums">
              {r.value} {unit}
              {r.meta ? <span className="text-mist"> · {r.meta}</span> : null}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-ink-soft">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8]"
              initial={reduced ? false : { width: 0 }}
              animate={{ width: `${(r.value / max) * 100}%` }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={reduced ? { width: `${(r.value / max) * 100}%` } : undefined}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
