import Image from "next/image";
import { Container } from "@/components/ui";

/**
 * Contact hero (premium, dark, cinematic).
 *
 * Masked line reveal for the headline, scale+fade on the background,
 * technical metadata, a 1px measurement line, faint engineering grid
 * and a controlled champagne radial glow. Total intro ≈1.2s; all
 * motion is CSS-only and fully disabled under prefers-reduced-motion.
 */
export function ContactHero() {
  return (
    <section
      aria-labelledby="contact-hero-title"
      className="keep-dark relative isolate overflow-hidden bg-[#080A0B] pt-28 pb-14 md:pt-34 lg:pb-16"
    >
      {/* Background image + treatments */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0 animate-contact-hero-bg"
          style={{ animationFillMode: "both" }}
        >
          <Image
            src="/images/contact/contact-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
        </div>
        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080A0B]/70 via-[#080A0B]/55 to-[#080A0B]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080A0B]/85 via-transparent to-[#080A0B]/40" />
        {/* Controlled champagne glow */}
        <div
          className="absolute left-1/2 top-1/3 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(184,154,98,0.18) 0%, rgba(184,154,98,0.06) 35%, transparent 65%)" }}
        />
        {/* Faint engineering grid */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "88px 88px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 75%)",
          }}
        />
        {/* Grain */}
        <div className="contact-grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
      </div>

      <Container className="flex h-full flex-col justify-end">
        {/* Technical label */}
        <p
          className="animate-contact-fade-up font-mono text-xs uppercase tracking-[0.35em] text-[#A9B2BA]"
          style={{ animationDelay: "120ms", animationFillMode: "both" }}
        >
          Get in touch
        </p>

        {/* Headline — masked line reveal */}
        <h1
          id="contact-hero-title"
          className="mt-6 font-display font-semibold uppercase leading-[0.95] tracking-[-0.025em] text-[#F5F7F8]"
        >
          <span className="block overflow-hidden">
            <span
              className="block animate-contact-reveal-line text-[clamp(2.6rem,6vw,5rem)]"
              style={{ animationDelay: "220ms", animationFillMode: "both" }}
            >
              Let&apos;s
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="block animate-contact-reveal-line text-[clamp(2.6rem,6vw,5rem)] text-[#B89A62]"
              style={{ animationDelay: "340ms", animationFillMode: "both" }}
            >
              Talk
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="block animate-contact-reveal-line text-[clamp(2.6rem,6vw,5rem)]"
              style={{ animationDelay: "460ms", animationFillMode: "both" }}
            >
              Business.
            </span>
          </span>
        </h1>

        {/* Description */}
        <p
          className="animate-contact-fade-up mt-8 max-w-xl text-base leading-relaxed text-[#A9B2BA] md:text-lg"
          style={{ animationDelay: "560ms", animationFillMode: "both" }}
        >
          Connect with SRIYAAN METALS for product enquiries, sourcing,
          vendor opportunities and industrial supply requirements.
        </p>

        {/* Technical measurement line */}
        <div
          className="animate-contact-line mt-14 h-px w-full origin-left bg-white/10"
          style={{ animationDelay: "680ms", animationFillMode: "both" }}
        >
          <span className="block h-px w-full bg-gradient-to-r from-[#B89A62] via-white/20 to-transparent" />
        </div>

        {/* Metadata row */}
        <dl className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-3 font-mono text-xs tracking-[0.18em] text-[#727D86]">
          <div className="flex items-center gap-3">
            <dt>Mumbai / India</dt>
            <span aria-hidden="true" className="h-3 w-px bg-white/15" />
            <dd>19.0760° N, 72.8777° E</dd>
          </div>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-3 w-px bg-white/15" />
            <dt>Hours</dt>
            <dd>10:00 — 19:00 IST</dd>
          </div>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-3 w-px bg-white/15" />
            <dt>Response</dt>
            <dd>Within one business day</dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}
