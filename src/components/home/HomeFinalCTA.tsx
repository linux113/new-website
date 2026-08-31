import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

export function HomeFinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-title"
      className="relative overflow-hidden border-t border-white/10 bg-[#05080B] py-24 lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(200,164,93,0.18), rgba(200,164,93,0.04) 45%, transparent 70%)",
        }}
      />
      <Container className="relative text-center">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C8A45D]">
            Get in touch
          </p>
          <h2
            id="final-cta-title"
            className="mx-auto mt-5 max-w-3xl font-display text-[clamp(2rem,4.2vw,3.6rem)] font-semibold leading-[1.05] tracking-tight text-[#F5F7F8]"
          >
            Have a material requirement?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[#A9B2BA] sm:text-base">
            Share your specification, quantity or application and speak
            with our team for a considered response — not an automated
            reply.
          </p>
          <Link
            href="/enquiry"
            className="group mx-auto mt-9 inline-flex h-13 items-center gap-2 rounded-lg bg-gradient-to-r from-[#D8A84E] to-[#F0C66D] px-9 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[#05080B] shadow-[0_12px_40px_-14px_rgba(216,180,102,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
          >
            Get a Quote
            <ArrowRight
              size={15}
              strokeWidth={2.2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
