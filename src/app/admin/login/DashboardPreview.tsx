"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Decorative dashboard preview beside the login card (aria-hidden by
 * the parent). A stylized rendering of the actual admin workspace:
 * sidebar, header, KPI cards with count-up, self-drawing area chart,
 * progressive donut, activity rows, status dots. Deliberately darker
 * than the login panel so the form stays focal.
 *
 * ILLUSTRATIVE VALUES ONLY — clearly generic labels, no real
 * business figures. Numbers count up as pure decoration.
 */

const KPIS = [
  { label: "OPEN ENQUIRIES", target: 24, suffix: "" },
  { label: "PRODUCTS LIVE", target: 132, suffix: "" },
  { label: "RESPONSE RATE", target: 98, suffix: "%" },
];

const AREA_PATH =
  "M0 88 C 30 84, 45 70, 70 72 S 115 58, 140 54 S 185 60, 210 44 S 255 30, 280 26 S 325 34, 350 22 L 350 110 L 0 110 Z";
const LINE_PATH =
  "M0 88 C 30 84, 45 70, 70 72 S 115 58, 140 54 S 185 60, 210 44 S 255 30, 280 26 S 325 34, 350 22";

function useCountUp(target: number, start: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value;
}

function Kpi({ label, target, suffix, delay, started }: {
  label: string; target: number; suffix: string; delay: number; started: boolean;
}) {
  const value = useCountUp(target, started);
  return (
    <div
      className="login-fill rounded-lg border border-white/[0.05] bg-white/[0.02] p-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="font-mono text-[0.5rem] tracking-[0.14em] text-[#5b6b78]">{label}</p>
      <p className="mt-1.5 font-mono text-[1.15rem]/none font-medium text-white tabular-nums">
        {value}
        <span className="text-[#22d3ee]">{suffix}</span>
      </p>
    </div>
  );
}

export function DashboardPreview() {
  const [started, setStarted] = useState(false);
  const donutRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 900);
    return () => clearTimeout(timer);
  }, []);

  // Donut: progressive stroke after mount.
  useEffect(() => {
    if (!started || !donutRef.current) return;
    const c = donutRef.current;
    const circumference = 2 * Math.PI * 26;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      c.style.strokeDashoffset = String(circumference * 0.28);
      return;
    }
    c.style.transition = "stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1)";
    requestAnimationFrame(() => {
      c.style.strokeDashoffset = String(circumference * 0.28);
    });
  }, [started]);

  const circumference = 2 * Math.PI * 26;

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[rgba(7,10,15,0.85)] shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-white/10" />
          <span className="size-2 rounded-full bg-white/10" />
          <span className="size-2 rounded-full bg-white/10" />
        </div>
        <span className="font-mono text-[0.55rem] tracking-[0.18em] text-[#5b6b78]">
          SRIYAAN / ADMIN — DASHBOARD
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[0.5rem] tracking-[0.14em] text-[#2dd4bf]">
          <span className="relative flex size-1.5">
            <span className="login-pulse absolute inline-flex size-full rounded-full bg-[#2dd4bf]" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#2dd4bf]" />
          </span>
          LIVE
        </span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-36 shrink-0 border-r border-white/[0.05] p-3 xl:block">
          {["Dashboard", "Products", "Categories", "Enquiries", "Media", "Settings"].map((item, i) => (
            <div
              key={item}
              className={`login-fill mb-1 rounded px-2.5 py-1.5 text-[0.62rem] ${
                i === 0 ? "bg-[#22d3ee]/10 text-[#22d3ee]" : "text-[#8b98a5]"
              }`}
              style={{ animationDelay: `${500 + i * 90}ms` }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-4">
          {/* KPI row */}
          <div className="grid grid-cols-3 gap-2.5">
            {KPIS.map((kpi, i) => (
              <Kpi key={kpi.label} {...kpi} delay={700 + i * 120} started={started} />
            ))}
          </div>

          {/* Charts */}
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2.5">
            {/* Area chart, self-drawing */}
            <div className="login-fill rounded-lg border border-white/[0.05] bg-white/[0.02] p-3" style={{ animationDelay: "1000ms" }}>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[0.5rem] tracking-[0.14em] text-[#5b6b78]">ENQUIRY VOLUME — 30D</p>
                <p className="font-mono text-[0.5rem] text-[#2dd4bf]">▲ TREND</p>
              </div>
              <svg viewBox="0 0 350 110" className="mt-2 h-24 w-full" fill="none" aria-hidden>
                <defs>
                  <linearGradient id="dp-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[22, 44, 66, 88].map((y) => (
                  <line key={y} x1="0" y1={y} x2="350" y2={y} stroke="rgba(255,255,255,0.04)" />
                ))}
                {started ? (
                  <>
                    <path d={AREA_PATH} fill="url(#dp-fill)" className="login-fill" style={{ animationDelay: "600ms" }} />
                    <path d={LINE_PATH} stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" className="login-draw" style={{ ["--draw-len" as string]: "420" }} />
                  </>
                ) : null}
              </svg>
            </div>

            {/* Donut */}
            <div className="login-fill flex w-32 flex-col items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.02] p-3" style={{ animationDelay: "1150ms" }}>
              <svg viewBox="0 0 64 64" className="size-20" aria-hidden>
                <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
                <circle
                  ref={donutRef}
                  cx="32" cy="32" r="26"
                  stroke="#2dd4bf" strokeWidth="6" fill="none" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                  transform="rotate(-90 32 32)"
                />
                <text x="32" y="36" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="monospace">72%</text>
              </svg>
              <p className="mt-1 font-mono text-[0.5rem] tracking-[0.14em] text-[#5b6b78]">RESOLVED</p>
            </div>
          </div>

          {/* Activity rows */}
          <div className="login-fill mt-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3" style={{ animationDelay: "1300ms" }}>
            <p className="font-mono text-[0.5rem] tracking-[0.14em] text-[#5b6b78]">RECENT ACTIVITY</p>
            <div className="mt-2 space-y-1.5">
              {[
                ["New enquiry received", "NEW", "#22d3ee"],
                ["Product published", "OK", "#2dd4bf"],
                ["Media uploaded", "OK", "#2dd4bf"],
              ].map(([text, tag, color], i) => (
                <div key={i} className="login-fill flex items-center justify-between rounded bg-white/[0.02] px-2.5 py-1.5" style={{ animationDelay: `${1400 + i * 130}ms` }}>
                  <span className="text-[0.6rem] text-[#8b98a5]">{text}</span>
                  <span className="font-mono text-[0.48rem] tracking-[0.12em]" style={{ color: color as string }}>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
