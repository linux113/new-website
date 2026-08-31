"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Container, Globe2, FileCheck2, Handshake } from "lucide-react";
import { useReducedMotion } from "@/components/motion";
import {
  GLOBAL_REGIONS,
  GLOBAL_STATS,
  type GlobalRegion,
} from "@/content/global-regions";
import { WorldMapPanel } from "./WorldMapPanel";
import { RegionCard } from "./RegionCard";

interface Props {
  /** Published region codes from the database (used to mark confirmed). */
  confirmedCodes: string[];
  /** Server-rendered dotted world map SVG inner markup. */
  dotsSvg: string;
  /**
   * Embedded mode (e.g. inside the homepage section): the wrapper
   * already renders the eyebrow/H2/lede, so this component skips its
   * own page-hero heading block — avoiding a duplicate headline and
   * a second H1 in the document outline.
   */
  embedded?: boolean;
}

/**
 * Interactive Global Reach experience.
 *
 * Holds the active-region state shared between the left-side region
 * cards and the right-side world map. Cards and markers stay in sync
 * via hover and click.
 */
export function GlobalReachClient({ confirmedCodes, dotsSvg, embedded = false }: Props) {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [counts, setCounts] = useState<number[]>(
    GLOBAL_STATS.map(() => 0),
  );

  const regions: GlobalRegion[] = GLOBAL_REGIONS.map((r) => ({
    ...r,
    confirmed: r.confirmed || confirmedCodes.includes(r.code.toLowerCase()),
  }));

  const active = regions.find((r) => r.id === activeId) ?? null;

  // Count-up for stats once the section is in view (one-shot).
  useEffect(() => {
    if (reduced) {
      const id = requestAnimationFrame(() =>
        setCounts(GLOBAL_STATS.map((s) => s.value)),
      );
      return () => cancelAnimationFrame(id);
    }
    const el = document.getElementById("gr-stats");
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            const duration = 1500;
            const t0 = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - t0) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setCounts(
                GLOBAL_STATS.map((s) => Math.round(s.value * eased)),
              );
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div className="relative">
      {/* ---- Top: hero + map ---- */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
        {/* LEFT */}
        <div className="lg:col-span-5 xl:col-span-5">
          {!embedded && (
            <>
              {/* Eyebrow */}
              <p
                className="gr-fade-up font-mono text-xs uppercase tracking-[0.3em] text-[#D8A84E]"
                style={{ animationDelay: "100ms" }}
              >
                Global Reach
              </p>

              {/* Headline */}
              <h1
                id="global-heading"
                className="mt-5 font-display text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-[#F5F7F8]"
              >
                {"Sourcing and supplying".split(" ").map((w, i) => (
                  <span key={i} className="gr-word inline-block align-bottom">
                    {w}{" "}
                  </span>
                ))}
                <br />
                <span className="gr-shimmer relative inline-block bg-gradient-to-r from-[#F2C766] via-[#E5C074] to-[#B8892E] bg-clip-text text-transparent">
                  across borders
                  <span
                    aria-hidden
                    className="gr-sheen absolute -bottom-1 left-0 h-px w-full"
                  />
                </span>
              </h1>

              {/* Lede */}
              <p
                className="gr-fade-up mt-6 max-w-md text-[15px] leading-relaxed text-[#A9B2BA] sm:text-base"
                style={{ animationDelay: "420ms" }}
              >
                Import and export operations run from Mumbai. Markets appear
                on this map only after they have been confirmed and
                published.
              </p>
            </>
          )}

          {/* Region cards */}
          <div className="mt-9 flex flex-col gap-3">
            {regions.map((region, i) => (
              <RegionCard
                key={region.id}
                region={region}
                index={i}
                active={activeId === region.id}
                onEnter={() => setActiveId(region.id)}
                onLeave={() => setActiveId(null)}
                onToggle={() =>
                  setActiveId(activeId === region.id ? null : region.id)
                }
              />
            ))}
          </div>

          {/* Active region detail */}
          <div
            className="mt-6 min-h-[3.5rem] transition-opacity duration-300"
            aria-live="polite"
          >
            {active ? (
              <div className="gr-fade-up border-l-2 border-[#D8A84E] pl-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D8A84E]">
                  {active.name} · {active.code}
                </p>
                <p className="mt-1.5 text-sm text-[#C9D0D5]">
                  {active.blurb}
                </p>
              </div>
            ) : (
              <p className="font-mono text-xs tracking-[0.06em] text-[#727D86]">
                Hover or select a region to inspect →
              </p>
            )}
          </div>
        </div>

        {/* RIGHT — map */}
        <div
          className="gr-map-in lg:col-span-7 xl:col-span-7"
        >
          <WorldMapPanel
            regions={regions}
            activeId={activeId}
            onHover={setActiveId}
            dotsSvg={dotsSvg}
          />
        </div>
      </div>

      {/* ---- Statistics strip ---- */}
      <div
        id="gr-stats"
        className="gr-fade-up mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#252A2D] bg-[#252A2D] lg:mt-24 lg:grid-cols-4"
        style={{ animationDelay: "200ms" }}
      >
        {GLOBAL_STATS.map((stat, i) => {
          const Icon = [Globe2, Container, Handshake, FileCheck2][i];
          return (
            <div
              key={stat.label}
              className="group relative flex flex-col gap-3 bg-[#080B0D] p-6 transition-colors duration-300 hover:bg-[#0D1114] sm:p-8"
            >
              <Icon
                size={20}
                strokeWidth={1.4}
                className="text-[#D8A84E] opacity-80 transition-opacity duration-300 group-hover:opacity-100"
              />
              <p className="font-display text-4xl font-semibold tracking-tight text-[#F5F7F8] sm:text-5xl">
                <span className="gr-count" key={counts[i]}>
                  {counts[i]}
                </span>
                <span className="text-[#D8A84E]">{stat.suffix}</span>
              </p>
              <p className="text-xs tracking-[0.06em] text-[#A9B2BA] sm:text-[13.5px]">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* ---- CTA ---- */}
      <div
        className="gr-fade-up mt-10 flex flex-col items-start justify-between gap-6 border-t border-[#252A2D] pt-10 sm:flex-row sm:items-center"
        style={{ animationDelay: "300ms" }}
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#D8A84E]">
            Next step
          </p>
          <p className="mt-2 font-display text-2xl font-medium text-[#F5F7F8] sm:text-3xl">
            Tell us where you need material.
          </p>
        </div>
        <Link
          href="/enquiry"
          className="group inline-flex h-13 items-center gap-3 rounded-lg bg-gradient-to-r from-[#D8A84E] to-[#F2C766] px-8 font-mono text-[12px] font-semibold uppercase tracking-[0.22em] text-[#050708] shadow-[0_10px_30px_-12px_rgba(214,168,74,0.9)] transition-all duration-300 hover:brightness-105"
        >
          <span>Get a Quote</span>
          <ArrowRight
            size={16}
            strokeWidth={2}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
          <span
            aria-hidden
            className="absolute inset-0 -z-0 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
            style={{ boxShadow: "0 0 30px rgba(214,168,74,0.45)" }}
          />
        </Link>
      </div>

      {/* Animation keyframes (component-local) */}
      <style>{`
        @keyframes gr-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gr-word {
          from { opacity: 0; transform: translateY(24px); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes gr-map-in {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes gr-sheen {
          0%   { transform: translateX(-100%); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        .gr-fade-up { animation: gr-fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .gr-word { animation: gr-word 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .gr-map-in { animation: gr-map-in 1.1s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 350ms; }
        .gr-sheen {
          background: linear-gradient(90deg, transparent, rgba(242,199,102,0.85), transparent);
          filter: drop-shadow(0 0 6px rgba(242,199,102,0.8));
          animation: gr-sheen 3.5s ease-in-out 1.2s infinite;
        }
        .gr-word:nth-of-type(1) { animation-delay: 180ms; }
        .gr-word:nth-of-type(2) { animation-delay: 250ms; }
        .gr-word:nth-of-type(3) { animation-delay: 320ms; }
        .gr-shimmer { filter: drop-shadow(0 0 12px rgba(214,168,74,0.25)); }
        .gr-shimmer:hover { filter: drop-shadow(0 0 18px rgba(242,199,102,0.55)); }
        @media (prefers-reduced-motion: reduce) {
          .gr-fade-up, .gr-word, .gr-map-in, .gr-sheen { animation: none !important; opacity: 1 !important; transform: none !important; filter: none !important; }
        }
      `}</style>
    </div>
  );
}
