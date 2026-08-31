import Link from "next/link";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

/**
 * Final cinematic CTA (08). Full-width dark band with a subtle
 * metallic radial glow, a thin animated top border, and two actions.
 */
export function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-title"
      className="relative overflow-hidden border-t border-white/10 bg-[#080A0B] py-24 lg:py-36"
    >
      {/* Metallic radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(184,154,98,0.16), rgba(184,154,98,0.04) 40%, transparent 68%)" }}
      />
      {/* Faint grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent 75%)",
        }}
      />

      <Container className="relative text-center">
        {/* Animated thin border line above heading */}
        <Reveal>
          <div className="mx-auto mb-10 h-px w-40 overflow-hidden bg-white/10">
            <span className="block h-px w-full origin-left animate-contact-line bg-[#B89A62]" />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#B89A62]">
            08 — Next step
          </p>
          <h2
            id="final-cta-title"
            className="mx-auto mt-6 max-w-4xl font-display text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-[#F5F7F8] md:text-7xl lg:text-8xl"
          >
            Ready to discuss
            <br />
            your requirement?
          </h2>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/enquiry"
              className="group inline-flex h-13 items-center justify-center gap-3 border border-[#B89A62] bg-[#B89A62] px-9 font-mono text-[12px] uppercase tracking-[0.22em] text-[#080A0B] transition-colors duration-300 hover:bg-[#c9ac72]"
            >
              Get a Quote
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
              >
                ↗
              </span>
            </Link>
            <Link
              href="/products"
              className="group inline-flex h-13 items-center justify-center gap-3 border border-white/15 px-9 font-mono text-[12px] uppercase tracking-[0.22em] text-[#F5F7F8] transition-all duration-300 hover:border-[#B89A62]/60 hover:bg-white/[0.03]"
            >
              Explore Products
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
