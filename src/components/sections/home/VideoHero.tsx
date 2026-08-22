import { HeroVideo } from "./HeroVideo";
import { ButtonLink, Container } from "@/components/ui";

/**
 * SM–01 / HERO — client-reference choreography.
 *
 * Architecture from the approved reference:
 * - Fullscreen black stage; right-side video atmosphere, LEFT-locked
 *   typography over a directional scrim (readable, professional)
 * - Video plays ONCE and freezes on the closing logo-wall frame —
 *   it does not loop forever (client request)
 * - One-shot entrance choreography, absolute timeline:
 *     0.00 eyebrow rise · 0.34 headline lines rise from 120% inside
 *     overflow-hidden masks · 0.74 subcopy rise · 0.90 CTA wipe
 *     (clip-path, not fade) · 0.98 stat rules scaleY · 1.04 stat
 *     numbers rise · 1.10 stat labels rise — done ~1.9s
 * - Easings per reference: EXPO/QUINT/TYPE/QUART cubic-beziers
 * - Sharp corners, no pills, no purple; accent = brand Furnace Orange
 * - Stats are VERIFIED facts only (no invented clients/revenue):
 *   working hours, contact channels, GST-registered
 * - prefers-reduced-motion: static frame, everything visible
 */
export function VideoHero() {
  return (
    <section
      data-surface="dark"
      aria-labelledby="home-hero"
      className="relative flex min-h-svh w-full flex-col overflow-hidden bg-ink text-paper"
    >
      {/* Video plate — plays once, freezes on logo wall */}
      <HeroVideo />

      {/* Directional scrim: solid left for type, open right for video */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, var(--color-ink) 18%, rgb(11 15 20 / 0.82) 42%, rgb(11 15 20 / 0.35) 68%, rgb(11 15 20 / 0.12) 88%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-48"
        style={{
          background: "linear-gradient(180deg, transparent, var(--color-ink))",
        }}
      />

      {/* Content — left-locked column */}
      <Container className="relative z-10 flex min-h-svh w-full flex-col justify-center pt-24 pb-10">
        <div className="max-w-3xl">
          {/* 0.00s — eyebrow */}
          <p
            className="hero-rise text-mono-meta text-mist"
            style={{ animationDelay: "0ms" }}
          >
            <span className="text-accent-ondark">SM–01</span>
            <span aria-hidden> / </span>
            METALS · TRADING · IMPORT / EXPORT — MUMBAI, IN
          </p>

          {/* 0.34s — masked headline lines rise from 120% */}
          <h1 id="home-hero" className="text-display-xl mt-7">
            <span className="hero-line">
              <span className="hero-line-inner" style={{ animationDelay: "340ms" }}>
                Precision metals,
              </span>
            </span>
            <span className="hero-line">
              <span className="hero-line-inner" style={{ animationDelay: "430ms" }}>
                supplied without
              </span>
            </span>
            <span className="hero-line">
              <span className="hero-line-inner" style={{ animationDelay: "520ms" }}>
                compromise.
              </span>
            </span>
          </h1>

          {/* 0.74s — subcopy */}
          <p
            className="hero-rise text-body-lg mt-8 max-w-[26rem] text-mist"
            style={{ animationDelay: "740ms" }}
          >
            Engineered supply for industrial buyers — exact specification,
            dependable delivery, direct communication.
          </p>

          {/* 0.90s — CTAs revealed by wipe, not fade */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="hero-wipe" style={{ animationDelay: "900ms" }}>
              <ButtonLink href="/enquiry" variant="primary" size="lg" arrow>
                Get a Quote
              </ButtonLink>
            </div>
            <div className="hero-wipe" style={{ animationDelay: "1000ms" }}>
              <ButtonLink href="/products" variant="secondaryDark" size="lg">
                Explore Products
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Stats band — verified facts only, gradient hairline rules */}
        <div className="mt-16 flex items-stretch gap-8 sm:gap-12 lg:mt-20">
          {[
            { num: "10–19", unit: "IST", label: "Working hours, Mon–Sat" },
            { num: "2", unit: "LINES", label: "Direct phone & WhatsApp" },
            { num: "GST", unit: "REG.", label: "27CRKPS0693G1ZB" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-stretch gap-8 sm:gap-12">
              {i > 0 ? (
                <div
                  aria-hidden
                  className="hero-rule w-px self-stretch"
                  style={{
                    animationDelay: `${980 + i * 70}ms`,
                    background:
                      "linear-gradient(180deg, rgb(245 246 247 / 0.09), rgb(245 246 247 / 0.24) 50%, rgb(245 246 247 / 0.09))",
                  }}
                />
              ) : null}
              <div>
                <p
                  className="hero-rise font-mono text-[1.75rem]/[1.1] font-medium tracking-tight text-paper tabular-nums sm:text-[2rem]/[1.1]"
                  style={{ animationDelay: `${1040 + i * 85}ms` }}
                >
                  {stat.num}
                  <span className="text-mist/60 text-[0.6em]"> {stat.unit}</span>
                </p>
                <p
                  className="hero-rise text-mono-micro mt-2 text-mist"
                  style={{ animationDelay: `${1100 + i * 85}ms` }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
