"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe } from "lucide-react";
import { useReducedMotion } from "@/components/motion";
import {
  HERO_FEATURES,
  INFRASTRUCTURE_ITEMS,
  PROCESS_STEPS,
} from "@/content/manufacturing";
import { ProcessWorkflow } from "./ProcessWorkflow";

/**
 * Client composition for the Manufacturing page — owns the subtle
 * mouse-parallax on the hero image and all entrance animations.
 * Content is data-driven (src/content/manufacturing.ts) so an admin
 * layer can later drive titles, steps and imagery.
 */
export function ManufacturingClient() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Very subtle: max 4px movement.
    heroRef.current.style.setProperty("--px", `${(x * 6).toFixed(2)}px`);
    heroRef.current.style.setProperty("--py", `${(y * 6).toFixed(2)}px`);
  };
  const onLeave = () => {
    if (!heroRef.current) return;
    heroRef.current.style.setProperty("--px", "0px");
    heroRef.current.style.setProperty("--py", "0px");
  };

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section
        ref={heroRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-7"
        style={{ ["--px" as string]: "0px", ["--py" as string]: "0px" } as React.CSSProperties}
      >
        {/* LEFT — 28% */}
        <div className="flex flex-col lg:col-span-3 xl:col-span-3">
          <p
            className="mf-fade-up font-mono text-xs uppercase tracking-[0.3em]"
            style={{ animationDelay: "80ms" }}
          >
              <span className="text-[#D8A84E]">Infrastructure</span>
          </p>

          <h1
            id="manufacturing-heading"
            className="mt-6 font-display font-semibold leading-[1.02] tracking-[-0.025em] text-[#F5F7F8]"
          >
            <span
              className="mf-line block text-[clamp(2.5rem,4vw,4.6rem)]"
              style={{ animationDelay: "180ms" }}
            >
              From intake
            </span>
            <span
              className="mf-line mf-gold relative mt-1 block text-[clamp(2.5rem,4vw,4.6rem)]"
              style={{ animationDelay: "320ms" }}
            >
              to dispatch
              <span
                aria-hidden
                className="mf-sheen absolute -bottom-1 left-0 h-px w-full"
              />
            </span>
          </h1>

          <p
            className="mf-fade-up mt-7 max-w-md text-[15px] leading-relaxed text-[#A9B2BA] sm:text-base"
            style={{ animationDelay: "460ms" }}
          >
            Every consignment moves through the same sequence. Facility
            photography below is representative until client plant imagery
            is published.
          </p>

          {/* Feature blocks */}
          <div
            className="mf-fade-up mt-9 grid grid-cols-2 gap-6 border-t border-[#252A2D] pt-7"
            style={{ animationDelay: "560ms" }}
          >
            {HERO_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group cursor-default"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={22}
                      strokeWidth={1.4}
                      className="text-[#D8A84E] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(214,168,74,0.7)]"
                      aria-hidden
                    />
                    <p className="font-display text-sm font-medium tracking-tight text-[#F5F7F8] transition-colors duration-300 group-hover:text-white">
                      {f.title}
                    </p>
                  </div>
                  <p className="mt-1.5 pl-8 text-[12px] text-[#A9B2BA]">
                    {f.sub}
                  </p>
                  <span
                    aria-hidden
                    className="mt-3 block h-px w-0 bg-gradient-to-r from-[#D8A84E] to-transparent transition-all duration-400 group-hover:w-full"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER — 46% */}
        <div className="lg:col-span-6 xl:col-span-6">
          <div
            className="mf-reveal group relative aspect-[16/10] overflow-hidden rounded-xl border border-[#252A2D] bg-[#0A0C0D] shadow-[0_30px_80px_-40px_rgba(214,168,74,0.25)]"
            style={{
              transform: reduced
                ? undefined
                : "translate3d(var(--px), var(--py), 0)",
              transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                boxShadow: "inset 0 0 0 1px rgba(214,168,74,0.5)",
              }}
            />
            <Image
              src="/images/manufacturing/hero-coils.jpg"
              alt="Rows of massive steel coils stored inside an industrial warehouse"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.015]"
            />
            {/* Hover gradient overlay */}
            <div
              aria-hidden
              className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
            />
            <p
              className="absolute bottom-4 left-4 z-20 font-mono text-xs tracking-[0.08em] text-[#A9B2BA] transition-colors duration-500 group-hover:text-[#C9D0D5]"
            >
              FIG. 01 · Representative imagery — client facility photography pending
            </p>
          </div>
        </div>

        {/* RIGHT — 26% */}
        <div className="flex flex-col gap-6 lg:col-span-3 xl:col-span-3">
          <div
            className="mf-reveal group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#252A2D] bg-[#0A0C0D]"
            style={{ animationDelay: "300ms" }}
          >
            <Image
              src="/images/manufacturing/material-detail.jpg"
              alt="Precision CNC-machined steel component with circular bores"
              fill
              sizes="(min-width: 1024px) 26vw, 100vw"
              className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
            />
            <p className="absolute bottom-3 left-4 right-4 font-mono text-xs tracking-[0.08em] text-[#A9B2BA]">
              FIG. 02 · Material detail — representative imagery
            </p>
          </div>

          <ProcessWorkflow steps={PROCESS_STEPS} />

          {/* CTA card */}
          <div
            className="mf-fade-up relative overflow-hidden rounded-xl border border-[#252A2D] bg-[#0A0C0D]/80 p-6 backdrop-blur-sm"
            style={{ animationDelay: "1100ms" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(214,168,74,0.18), transparent 70%)",
              }}
            />
            <Globe
              size={26}
              strokeWidth={1.3}
              className="text-[#D8A84E]"
              aria-hidden
            />
            <p className="mt-4 font-display text-lg font-medium leading-tight tracking-tight text-[#F5F7F8]">
              Supplying strength
              <br />
              across industries
            </p>
            <p className="mt-2 text-[12.5px] text-[#A9B2BA]">
              Reliable. Consistent. Global.
            </p>
            <Link
              href="/enquiry"
              className="group/cta mt-5 inline-flex h-12 items-center gap-2 rounded-lg bg-gradient-to-r from-[#D8A84E] to-[#E5C074] px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#050708] shadow-[0_8px_30px_-10px_rgba(214,168,74,0.7)] transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(214,168,74,0.9)] hover:brightness-105"
            >
              Get a Quote
              <ArrowRight
                size={16}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover/cta:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== INFRASTRUCTURE ===================== */}
      <section aria-labelledby="infrastructure-heading" className="mt-24 lg:mt-32">
        <p
          className="mf-fade-up font-mono text-xs uppercase tracking-[0.3em] text-[#D8A84E]"
        >
          <span className="text-[#D8A84E]">Published</span>
          <span className="ml-2 text-[#727D86]">Infrastructure</span>
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {INFRASTRUCTURE_ITEMS.map((item, i) => (
            <article
              key={item.figure}
              className="mf-card group relative overflow-hidden rounded-xl border border-[#252A2D] bg-[#080B0D] transition-all duration-500 hover:border-[#D8A84E]/45 hover:shadow-[0_0_40px_-12px_rgba(214,168,74,0.35)]"
              style={{
                animation: "mf-fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: `${200 + i * 120}ms`,
              }}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-all duration-[600ms] ease-out group-hover:scale-[1.03] group-hover:brightness-110"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    boxShadow: "inset 0 0 0 1px rgba(214,168,74,0.5)",
                  }}
                />
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-5">
                <div>
                  <p className="font-mono text-xs tracking-[0.08em] text-[#A9B2BA] transition-colors duration-400 group-hover:text-[#C9D0D5]">
                    {item.figure} · {item.caption}
                  </p>
                  <p className="mt-2 font-display text-sm font-medium uppercase tracking-wide text-[#F5F7F8] sm:text-base">
                    {item.description}
                  </p>
                </div>
                <ArrowUpRight
                  size={22}
                  strokeWidth={1.5}
                  className="shrink-0 text-[#727D86] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#E5C074]"
                  aria-hidden
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Local keyframes (also registered in globals.css) */}
      <style>{`
        @keyframes mf-fade-up { from { opacity:0; transform: translateY(16px);} to {opacity:1; transform:none;} }
        @keyframes mf-line    { from { opacity:0; transform: translateY(24px); filter: blur(8px);} to {opacity:1; transform:none; filter: blur(0);} }
        @keyframes mf-reveal  { from { opacity:0; transform: scale(0.97) translateY(10px);} to {opacity:1; transform:none;} }
        @keyframes mf-sheen   { 0%{transform:translateX(-100%);opacity:0;} 20%{opacity:1;} 100%{transform:translateX(120%);opacity:0;} }
        .mf-fade-up { animation: mf-fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .mf-line    { animation: mf-line 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .mf-reveal  { animation: mf-reveal 1s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 280ms; }
        .mf-gold    { background: linear-gradient(90deg,#F2C766,#E5C074 45%,#B8892E); -webkit-background-clip:text; background-clip:text; color: transparent; text-shadow: 0 0 24px rgba(214,168,74,0.22); transition: filter .4s ease, text-shadow .4s ease; }
        .mf-gold:hover { filter: brightness(1.08); text-shadow: 0 0 30px rgba(242,199,102,0.5); }
        .mf-sheen { background: linear-gradient(90deg,transparent,rgba(242,199,102,0.9),transparent); filter: drop-shadow(0 0 6px rgba(242,199,102,0.8)); animation: mf-sheen 2.6s ease-out 0.9s 1; }
        @media (prefers-reduced-motion: reduce) {
          .mf-fade-up,.mf-line,.mf-reveal,.mf-sheen { animation:none !important; opacity:1 !important; transform:none !important; filter:none !important; }
        }
      `}</style>
    </>
  );
}
