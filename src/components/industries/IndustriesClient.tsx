"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ClipboardList } from "lucide-react";
import { useReducedMotion } from "@/components/motion";
import { INDUSTRIES, TRUST } from "@/content/industries";

/**
 * Premium Industries page client composition.
 * Owns the subtle hero-image parallax and staggered card reveals;
 * all content is data-driven (src/content/industries.ts).
 */
export function IndustriesClient() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  const onHeroMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroRef.current.style.setProperty("--px", `${(x * 8).toFixed(1)}px`);
    heroRef.current.style.setProperty("--py", `${(y * 8).toFixed(1)}px`);
  };

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
        {/* LEFT */}
        <div className="lg:col-span-5 xl:col-span-5">
          <p
            className="in-fade font-mono text-[11px] uppercase tracking-[0.3em] text-[#D8A84E]"
            style={{ animationDelay: "60ms" }}
          >
            Our Industries
          </p>

          <h1
            id="industries-heading"
            className="in-line mt-6 font-display text-[clamp(2.5rem,5.2vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-[#F5F7F8]"
            style={{ animationDelay: "160ms" }}
          >
            Where the
            <br />
            material goes
          </h1>
          <span
            aria-hidden
            className="in-rule mt-5 block h-px w-28 origin-left bg-gradient-to-r from-[#D8A84E] to-transparent"
          />

          <p
            className="in-fade mt-6 max-w-lg text-[15px] leading-relaxed text-[#A9B2BA] sm:text-base"
            style={{ animationDelay: "380ms" }}
          >
            SRIYAAN METALS supports material sourcing and supply across
            construction, automotive, engineering and infrastructure
            applications — a metals trading company in Mumbai helping
            businesses identify suitable materials based on project
            requirements, specifications and procurement needs.
          </p>
        </div>

        {/* RIGHT — industrial image + world network overlay */}
        <div
          ref={heroRef}
          onMouseMove={onHeroMove}
          onMouseLeave={() => {
            heroRef.current?.style.setProperty("--px", "0px");
            heroRef.current?.style.setProperty("--py", "0px");
          }}
          className="in-card relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#0A1015] lg:col-span-7 xl:col-span-7"
        >
          <div
            className="absolute inset-0"
            style={
              reduced
                ? undefined
                : {
                    transform:
                      "translate3d(var(--px,0), var(--py,0), 0) scale(1.04)",
                    transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
                  }
            }
          >
            <Image
              src="/images/industries/hero-pipes.jpg"
              alt="Stacked steel pipes and structural steel in an industrial warehouse"
              fill
              priority
              sizes="(min-width:1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
          {/* No shade overlays — the photograph shows in full */}
          {/* Dotted world network */}
          <WorldNetwork />
        </div>
      </section>

      {/* ===================== INDUSTRY CARDS ===================== */}
      <section
        aria-labelledby="industries-served-heading"
        className="mt-16 lg:mt-24"
      >
        <h2 id="industries-served-heading" className="sr-only">
          Industries we serve
        </h2>
        <ul className="flex flex-col gap-4">
          {INDUSTRIES.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <li
                key={industry.slug}
                className="in-card"
                style={{ animationDelay: `${i * 110}ms` }}
              >
                <Link
                  href="/products"
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A1015]/80 transition-all duration-[400ms] ease-out hover:-translate-y-1 hover:border-[#D8A84E]/45 hover:shadow-[0_24px_60px_-40px_rgba(216,168,78,0.6)] sm:flex-row sm:items-stretch"
                  aria-label={`${industry.name} industry — view products`}
                >
                  {/* Left gold accent bar */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-gradient-to-b from-[#F0C66D] to-[#B8892E] transition-transform duration-400 ease-out group-hover:scale-y-100"
                  />

                  {/* Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-auto sm:w-64 lg:w-72">
                    <Image
                      src={industry.image}
                      alt={industry.alt}
                      fill
                      sizes="(min-width:1024px) 18vw, 100vw"
                      className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 items-center gap-3.5 p-5 sm:gap-5 sm:p-6">
                    <span className="hidden font-mono text-2xl font-semibold tabular-nums leading-none text-[#D8A84E] sm:block">
                      {industry.index}
                      <span className="block text-xs tracking-[0.2em] text-[#727D86]">
                        / {industry.total}
                      </span>
                    </span>

                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#D8A84E]/25 bg-[#D8A84E]/5 text-[#D8A84E] transition-all duration-300 group-hover:border-[#D8A84E]/50 group-hover:shadow-[0_0_22px_-8px_rgba(216,168,78,0.9)]">
                      <Icon size={24} strokeWidth={1.5} aria-hidden />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs tabular-nums text-[#D8A84E] sm:hidden">
                          {industry.index} / {industry.total}
                        </span>
                      </div>
                      <h3 className="font-display text-[1.35rem] font-semibold tracking-tight text-[#F5F7F8] transition-colors duration-300 group-hover:text-white sm:text-[1.6rem]">
                        {industry.name}
                      </h3>
                      <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-[#A9B2BA] transition-colors duration-300 group-hover:text-[#C9D0D5]">
                        {industry.description}
                      </p>
                    </div>

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D8A84E]/40 text-[#F0C66D] transition-all duration-300 group-hover:border-[#D8A84E] group-hover:bg-[#D8A84E] group-hover:text-[#05080B] group-hover:shadow-[0_0_22px_-6px_rgba(216,168,78,0.9)]">
                      <ArrowRight
                        size={18}
                        strokeWidth={2}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ===================== CTA PANEL ===================== */}
      <section
        aria-labelledby="app-heading"
        className="in-fade relative mt-8 overflow-hidden rounded-2xl border border-[#D8A84E]/25 bg-gradient-to-br from-[#0A1015] to-[#05080B] p-6 sm:p-10"
        style={{ animationDelay: "200ms" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(216,168,78,0.18), transparent 70%)",
          }}
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#D8A84E]/30 bg-[#D8A84E]/10 text-[#F0C66D]">
              <ClipboardList size={22} strokeWidth={1.6} aria-hidden />
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#D8A84E]">
                Need a specific material?
              </p>
              <h2
                id="app-heading"
                className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-[#F5F7F8] sm:text-3xl"
              >
                Let&apos;s identify the right material for your application.
              </h2>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-[#A9B2BA]">
                Tell us your material requirement, specification or project
                application and our team can help you evaluate the
                appropriate sourcing option.
              </p>
              <p className="mt-3 font-mono text-xs font-medium tracking-[0.08em] text-[#A9B2BA]">
                B2B sourcing • Procurement support • Material verification
              </p>
            </div>
          </div>

          <Link
            href="/enquiry"
            className="group inline-flex h-13 shrink-0 items-center gap-2 rounded-lg border border-[#D8A84E] bg-gradient-to-r from-[#D8A84E] to-[#F0C66D] px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#05080B] shadow-[0_10px_36px_-14px_rgba(216,168,78,0.9)] transition-all duration-300 hover:brightness-105 hover:shadow-[0_14px_44px_-12px_rgba(216,168,78,1)]"
          >
            Discuss Your Requirement
            <ArrowRight
              size={15}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </section>

      {/* ===================== TRUST STRIP ===================== */}
      <section aria-label="Why SRIYAAN METALS" className="mt-8">
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => {
            const Icon = t.icon;
            return (
              <li
                key={t.title}
                className="flex items-start gap-3 bg-[#05080B] p-5 transition-colors duration-300 hover:bg-[#0A1015]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D8A84E]/25 bg-[#D8A84E]/5 text-[#D8A84E]">
                  <Icon size={18} strokeWidth={1.5} aria-hidden />
                </span>
                <div>
                  <p className="font-display text-[14px] font-semibold text-[#F5F7F8]">
                    {t.title}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-snug text-[#727D86]">
                    {t.sub}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <style>{`
        @keyframes in-fade { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:none;} }
        @keyframes in-line { from{opacity:0;transform:translateY(26px);filter:blur(8px);} to{opacity:1;transform:none;filter:blur(0);} }
        @keyframes in-card { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:none;} }
        @keyframes in-rule { from{transform:scaleX(0);} to{transform:scaleX(1);} }
        .in-fade { animation: in-fade .7s cubic-bezier(0.22,1,0.36,1) both; }
        .in-line { animation: in-line .9s cubic-bezier(0.22,1,0.36,1) both; }
        .in-card { animation: in-card .8s cubic-bezier(0.22,1,0.36,1) both; }
        .in-rule { animation: in-rule .9s cubic-bezier(0.65,0,0.35,1) .8s both; transform-origin:left; }
        @media (prefers-reduced-motion: reduce){
          .in-fade,.in-line,.in-card,.in-rule{animation:none!important;opacity:1!important;transform:none!important;filter:none!important;}
        }
      `}</style>
    </>
  );
}

/**
 * Faint dotted world map with glowing connection arcs over the hero
 * image. Pure decorative SVG; nodes pulse slowly.
 */
function WorldNetwork() {
  const nodes = [
    { x: 72, y: 38 },  // Europe
    { x: 80, y: 52 },  // Middle East
    { x: 86, y: 60 },  // SE Asia
    { x: 60, y: 64 },  // Africa
    { x: 28, y: 42 },  // Americas
    { x: 84, y: 70 },  // India/Mumbai hub
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 56"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
    >
      <defs>
        <radialGradient id="in-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBE7A8" />
          <stop offset="100%" stopColor="#D8A84E" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* arcs from Mumbai hub (84,70) */}
      {nodes
        .filter((n) => !(n.x === 84 && n.y === 70))
        .map((n, i) => (
          <path
            key={i}
            d={`M84 70 Q ${(84 + n.x) / 2} ${Math.min(n.y, 70) - 14} ${n.x} ${n.y}`}
            fill="none"
            stroke="#D8A84E"
            strokeWidth="0.15"
            strokeDasharray="2 1.5"
            opacity="0.55"
          />
        ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="2.2" fill="url(#in-node)" />
          <circle
            cx={n.x}
            cy={n.y}
            r="0.7"
            fill="#F0C66D"
            style={{
              filter: "drop-shadow(0 0 2px rgba(240,198,109,0.9))",
              animation: `in-pulse ${3 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
              transformOrigin: `${n.x}px ${n.y}px`,
            }}
          />
        </g>
      ))}
      <style>{`
        @keyframes in-pulse { 0%,100%{opacity:.4;} 50%{opacity:1;} }
        @media (prefers-reduced-motion: reduce){ circle{animation:none!important;} }
      `}</style>
    </svg>
  );
}
