import { Parallax } from "@/components/motion";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { PatternMedia } from "@/components/patterns";
import type { MediaRef } from "@/content/types";

/**
 * SM–01 / HERO (DS §5 homepage composition).
 *
 * Dark Carbon hero on the editorial 12-col grid: headline block cols
 * 1–7, media block cols 8–12 bleeding right (asymmetric, DS §18).
 * Media architecture: swap `HERO_MEDIA.src` with the real client
 * image/video poster — layout, ratio and parallax are already wired.
 *
 * No entrance animation on the headline (LCP protection, DS §20);
 * only the media panel uses the sanctioned parallax (1 of 3).
 */

// PLACEHOLDER-CONTENT: real hero image/video poster pending client asset.
const HERO_MEDIA: MediaRef = {
  src: null,
  alt: "Industrial hero image — pending client asset",
  placeholderLabel: "HERO MEDIA — [AWAITING CLIENT ASSET: FACTORY / MATERIAL]",
};

export function HeroSection() {
  return (
    <section
      data-surface="dark"
      aria-labelledby="home-hero"
      className="bg-surface text-surface-fg relative overflow-hidden"
    >
      {/* Subtle blueprint grid — the one sanctioned background texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-mist) 1px, transparent 1px), linear-gradient(90deg, var(--color-mist) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <Container className="relative">
        <div className="grid grid-cols-4 gap-6 pt-40 pb-24 md:grid-cols-12 md:gap-8 lg:pt-56 lg:pb-32">
          {/* Headline block — cols 1–7 */}
          <div className="col-span-4 flex flex-col items-start gap-6 md:col-span-7">
            <Eyebrow code="SM–01">
              Metals · Trading · Import / Export — Mumbai, IN
            </Eyebrow>

            <h1 id="home-hero" className="text-display-xl text-balance">
              Precision metals,
              <br />
              supplied without
              <br />
              compromise.
            </h1>

            {/* PLACEHOLDER-CONTENT: refine once final business messaging arrives */}
            <p className="text-body-lg text-surface-muted max-w-measure">
              SRIYAAN METALS is a Mumbai-based metals business serving
              industrial buyers — built on exact specification, dependable
              supply and direct communication.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <ButtonLink href="/contact" variant="primary" size="lg" arrow>
                Get a Quote
              </ButtonLink>
              <ButtonLink href="/products" variant="secondaryDark" size="lg">
                Explore Products
              </ButtonLink>
            </div>

            {/* Technical meta line */}
            <p className="mt-8 text-mono-micro text-surface-muted">
              18.9582° N / 72.8118° E — OPERA HOUSE, MUMBAI · HRS 10:00–19:00 IST
            </p>
          </div>

          {/* Media block — cols 8–12, parallax frame ready for real asset */}
          <div className="col-span-4 md:col-span-5 md:self-end">
            {HERO_MEDIA.src ? (
              <Parallax ratio="4/5" range={0.08}>
                <PatternMedia
                  media={HERO_MEDIA}
                  ratio="4/5"
                  sizes="(min-width: 48rem) 40vw, 100vw"
                  priority
                  surface="media"
                  graded
                  className="h-full"
                />
              </Parallax>
            ) : (
              <PatternMedia
                media={HERO_MEDIA}
                ratio="4/5"
                sizes="(min-width: 48rem) 40vw, 100vw"
                surface="media"
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
