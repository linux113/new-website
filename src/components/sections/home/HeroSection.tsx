import Image from "next/image";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";

/**
 * SM–01 / HERO — full-bleed editorial photography edition.
 * Dark material image across the full viewport, Carbon gradient for
 * text legibility, display-xl statement, twin CTAs, mono meta rail.
 * LCP-safe: priority image, no entrance animation on the headline.
 */
export function HeroSection() {
  return (
    <section
      data-surface="dark"
      aria-labelledby="home-hero"
      className="relative flex min-h-svh items-end overflow-hidden bg-ink text-paper"
    >
      {/* Full-bleed material photography */}
      <div className="absolute inset-0">
        <Image
          src="/images/material-wide.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.98] contrast-[1.06] saturate-[0.72]"
        />
        {/* Carbon grade for legibility — heavier at the bottom-left where text sits */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent"
        />
      </div>

      <Container className="relative pb-20 lg:pb-28">
        <div className="grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8">
          <div className="col-span-4 flex flex-col items-start gap-6 pt-44 md:col-span-9 lg:pt-56">
            <Eyebrow code="SM–01">
              Metals · Trading · Import / Export — Mumbai, IN
            </Eyebrow>

            <h1 id="home-hero" className="text-display-xl text-balance">
              Precision metals,
              <br />
              supplied without compromise.
            </h1>

            <p className="text-body-lg text-mist max-w-measure">
              SRIYAAN METALS is a Mumbai-based metals business serving
              industrial buyers — built on exact specification, dependable
              supply and direct communication.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <ButtonLink href="/enquiry" variant="primary" size="lg" arrow>
                Get a Quote
              </ButtonLink>
              <ButtonLink href="/products" variant="secondaryDark" size="lg">
                Explore Products
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Mono meta rail */}
        <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-2 border-t border-paper/15 pt-6">
          <p className="text-mono-micro text-mist">18.9582° N / 72.8118° E — OPERA HOUSE, MUMBAI</p>
          <p className="text-mono-micro text-mist">HRS 10:00–19:00 IST</p>
          <p className="text-mono-micro text-mist">GSTIN 27CRKPS0693G1ZB</p>
        </div>
      </Container>
    </section>
  );
}
