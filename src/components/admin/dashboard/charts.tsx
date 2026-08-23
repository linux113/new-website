"use client";

import { useEffect, useId, useRef, useState } from "react";
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

/* ---------------- Glowing monthly bar chart ---------------- */

export interface MonthPoint {
  /** e.g. "Jan" */
  label: string;
  /** e.g. "Jul 2026" for the tooltip */
  full: string;
  enquiries: number;
  contacts: number;
  vendors: number;
}

export function MonthlyBarChart({ data }: { data: MonthPoint[] }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const totals = data.map((m) => m.enquiries + m.contacts + m.vendors);
  const peak = totals.indexOf(Math.max(...totals));
  const focus = active ?? peak;
  const max = Math.max(...totals, 4);
  const niceMax = Math.ceil(max / 4) * 4;

  const W = 820;
  const H = 300;
  const PAD = { l: 34, r: 14, t: 30, b: 30 };
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const slot = iw / data.length;
  const barW = Math.min(34, slot * 0.52);
  const x = (i: number) => PAD.l + i * slot + (slot - barW) / 2;
  const barH = (v: number) => (v / niceMax) * ih;
  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const f = data[focus];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Monthly lead volume"
        className="w-full"
        onMouseLeave={() => setActive(null)}
      >
        <defs>
          <linearGradient id="bar-dim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334761" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1a2338" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="bar-lit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="55%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <filter id="bar-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
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

        {data.map((m, i) => {
          const v = totals[i];
          const lit = i === focus;
          const h = Math.max(barH(v), v > 0 ? 3 : 0);
          const yTop = PAD.t + ih - h;
          return (
            <g
              key={m.full}
              onMouseEnter={() => setActive(i)}
              className="cursor-pointer"
              tabIndex={0}
              onFocus={() => setActive(i)}
              aria-label={`${m.full}: ${v} leads`}
            >
              {/* hit area */}
              <rect x={PAD.l + i * slot} y={PAD.t} width={slot} height={ih} fill="transparent" />
              {/* track */}
              <rect x={x(i)} y={PAD.t} width={barW} height={ih} rx="7" fill="#111a2e" opacity="0.5" />
              {/* bar */}
              {v > 0 ? (
                <motion.rect
                  x={x(i)}
                  width={barW}
                  rx="7"
                  fill={lit ? "url(#bar-lit)" : "url(#bar-dim)"}
                  filter={lit ? "url(#bar-glow)" : undefined}
                  initial={reduced ? { y: yTop, height: h } : { y: PAD.t + ih, height: 0 }}
                  animate={{ y: yTop, height: h }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
              {/* cap highlight on lit bar */}
              {v > 0 && lit ? (
                <motion.rect
                  x={x(i) + barW * 0.22}
                  width={barW * 0.56}
                  height="2.5"
                  rx="1.25"
                  fill="#e0f2fe"
                  initial={reduced ? { y: yTop + 6, opacity: 1 } : { y: PAD.t + ih, opacity: 0 }}
                  animate={{ y: yTop + 6, opacity: 0.9 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
              <text x={x(i) + barW / 2} y={H - 10} textAnchor="middle" fontSize="9.5" fill={lit ? "#a5c8e4" : "#5f6b86"} fontFamily="var(--font-mono)">
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating tooltip pinned to focused bar */}
      {f ? (
        <div
          role="status"
          className="adm-card pointer-events-none z-10 w-max max-w-48 p-2.5 text-center shadow-float"
          style={{
            // .adm-card sets position:relative (unlayered CSS wins over the
            // Tailwind utility), so pin it inline.
            position: "absolute",
            left: `${(((x(focus) + barW / 2) / W) * 100).toFixed(2)}%`,
            bottom: `${Math.min(((barH(totals[focus]) + PAD.b + 12) / H) * 100, 66).toFixed(2)}%`,
            transform: `translateX(${focus > data.length - 3 ? "-90%" : focus < 2 ? "-10%" : "-50%"})`,
          }}
        >
          <p className="text-mono-micro text-mist whitespace-nowrap">{f.full}</p>
          <p className="mt-0.5 text-body-sm font-semibold text-ink tabular-nums whitespace-nowrap">
            {totals[focus]} leads
          </p>
          <p className="text-mono-micro text-slate whitespace-nowrap">
            {f.enquiries} enq · {f.contacts} msg · {f.vendors} vendor
          </p>
        </div>
      ) : null}
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
