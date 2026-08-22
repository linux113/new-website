import Image from "next/image";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";

/**
 * SM–01 / HERO — background-video edition (Apogee-reference motion).
 *
 * Motion architecture follows the approved reference exactly:
 * - Background <video autoPlay loop muted playsInline> (client's
 *   nuts/bolts sequence encoded to MP4 with a ping-pong loop so it
 *   cycles seamlessly instead of jump-cutting)
 * - Pure-CSS entrance timeline: every element starts `opacity-0` in
 *   markup and is revealed by a keyframe with `forwards` fill and
 *   cubic-bezier(0.16, 1, 0.3, 1) — no JS state, no observers
 * - Timeline: headline 300ms → subhead 500ms → CTAs 700ms → glass
 *   card 900ms → chart bars 1100ms + i×30ms
 * - Glass supply-activity card with staggered scaleY bar entrance
 * - prefers-reduced-motion: all reveals instant (globals.css), and
 *   the video holds its poster via `motion-reduce` pause CSS
 *
 * Content/claims: bar chart is explicitly labelled ILLUSTRATIVE —
 * no invented business numbers (DS §31); copy and meta are verified.
 *
 * Server component — zero client JS beyond the video element itself.
 */

/* Illustrative bar silhouette (not data — labelled as such in UI). */
const BAR_HEIGHTS = [
  23, 40, 53, 40, 33, 14, 7, 17, 75, 65,
  88, 75, 65, 47, 33, 88, 4, 7, 9, 14,
  95, 65, 79, 37, 7, 40, 17, 20, 62, 47,
  92, 72,
];
const MAX_BAR = Math.max(...BAR_HEIGHTS);

const AXIS_LABELS = ["SOURCE", "INSPECT", "STORE", "PACK", "DISPATCH"];

export function VideoHero() {
  return (
    <section
      data-surface="dark"
      aria-labelledby="home-hero"
      className="relative min-h-svh w-full overflow-hidden bg-ink text-paper"
    >
      {/* Background video — client frame sequence, ping-pong loop */}
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        src="/hero.mp4"
        poster="/hero-frames/frame-01.jpg"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      {/* Reduced-motion fallback: static frame */}
      <div aria-hidden="true" className="absolute inset-0 hidden motion-reduce:block">
        <Image
          src="/hero-frames/frame-25.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Legibility grade */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-svh flex-col">
        <div className="flex flex-1 items-center pt-28 pb-8 lg:pt-24">
          <Container className="w-full">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              {/* Copy block */}
              <div className="max-w-[37rem]">
                <div className="hero-anim-up" style={{ animationDelay: "150ms" }}>
                  <Eyebrow code="SM–01">
                    Metals · Trading · Import / Export — Mumbai, IN
                  </Eyebrow>
                </div>

                <h1
                  id="home-hero"
                  className="hero-anim-up text-display-xl mt-6 mb-5 text-balance sm:mb-8"
                  style={{ animationDelay: "300ms" }}
                >
                  Precision metals, supplied without compromise.
                </h1>

                <p
                  className="hero-anim-up text-body-lg mb-7 max-w-[23rem] text-mist sm:mb-10"
                  style={{ animationDelay: "500ms" }}
                >
                  Exact specification, dependable supply and direct
                  communication — for industrial buyers.
                </p>

                <div
                  className="hero-anim-up flex flex-wrap gap-3 sm:gap-4"
                  style={{ animationDelay: "700ms" }}
                >
                  <ButtonLink href="/enquiry" variant="primary" size="lg" arrow>
                    Get a Quote
                  </ButtonLink>
                  <ButtonLink href="/products" variant="secondaryDark" size="lg">
                    Explore Products
                  </ButtonLink>
                </div>
              </div>

              {/* Glass supply-activity card */}
              <div
                className="hero-anim-scale w-full max-w-[25rem] lg:mx-0"
                style={{ animationDelay: "900ms" }}
              >
                <div className="w-full rounded-sm border border-paper/10 bg-ink/35 p-5 pb-5 backdrop-blur-[20px] sm:p-8 sm:pb-6">
                  <p className="text-mono-meta mb-3 text-mist sm:mb-4">
                    Supply pipeline — illustrative
                  </p>

                  <p className="text-display-md mb-2 sm:mb-3">
                    Enquiry to dispatch
                  </p>

                  <div className="mb-6 flex items-center gap-2.5 sm:mb-8">
                    <span className="rounded-xs bg-paper/15 px-1.5 py-1.5 text-mono-micro text-paper">
                      RFQ → QUOTE
                    </span>
                    <span className="text-mono-micro text-mist">
                      responses within working hours
                    </span>
                  </div>

                  {/* Chart */}
                  <div className="relative">
                    <div className="flex h-20 items-end gap-[1.5px] sm:h-[6.25rem]" aria-hidden="true">
                      {BAR_HEIGHTS.map((h, i) => (
                        <div
                          key={i}
                          className="hero-anim-bar flex-1 rounded-[0.5px]"
                          style={{
                            height: `${(h / MAX_BAR) * 100}%`,
                            backgroundColor:
                              i >= 28 ? "rgba(245,246,247,0.12)" : "var(--color-paper)",
                            animationDelay: `${1100 + i * 30}ms`,
                          }}
                        />
                      ))}
                    </div>
                    {/* Gridlines */}
                    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 w-px bg-paper/10"
                          style={{ left: `${((i + 1) / 5) * 100}%` }}
                        />
                      ))}
                    </div>
                    {/* Axis */}
                    <div className="mt-3 flex justify-between" aria-hidden="true">
                      {AXIS_LABELS.map((label, i) => (
                        <span
                          key={label}
                          className="text-mono-micro text-mist"
                          style={{ opacity: i >= 3 ? 0.5 : 1 }}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mono meta rail */}
            <div
              className="hero-anim-up mt-14 flex flex-wrap items-center gap-x-10 gap-y-2 border-t border-paper/15 pt-6"
              style={{ animationDelay: "1000ms" }}
            >
              <p className="text-mono-micro text-mist">
                18.9582° N / 72.8118° E — OPERA HOUSE, MUMBAI
              </p>
              <p className="text-mono-micro text-mist">HRS 10:00–19:00 IST</p>
              <p className="text-mono-micro text-mist">GSTIN 27CRKPS0693G1ZB</p>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
