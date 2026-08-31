import type { LucideIcon } from "lucide-react";
import { Headset, PackageCheck, Scale, Truck } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Container, Section } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * WHY SRIYAAN — "Built on exactness".
 *
 * Restrained, editorial company-principles block:
 *   - Two-column heading (eyebrow + display headline | short statement
 *     with a thin vertical gold divider between them)
 *   - 2×2 grid of four quiet principle cards (icon in a small square
 *     outline, uppercase category label upper-right, bold-but-unsized
 *     headline, readable body)
 *   - Only the first card carries a subtle warm-gold border accent.
 *     No glows, no heavy shadows, no decorative motion.
 */

interface Principle {
  icon: LucideIcon;
  label: string;
  title: string;
  body: string;
}

const PRINCIPLES: Principle[] = [
  {
    icon: Scale,
    label: "Quality",
    title: "Specification, honoured",
    body: "Material supplied to the agreed specification — checked before it ships, documented where required.",
  },
  {
    icon: PackageCheck,
    label: "Reliability",
    title: "Committed, then kept",
    body: "Committed quantities and committed dates. A confirmed order is treated as a fixed obligation.",
  },
  {
    icon: Truck,
    label: "Supply",
    title: "Two supply pathways",
    body: "Domestic trading and import–export pathways from Mumbai, structured around each buyer's requirement.",
  },
  {
    icon: Headset,
    label: "Responsiveness",
    title: "People, not queues",
    body: "Direct access on phone, WhatsApp and email during working hours — enquiries answered by people, not queues.",
  },
];

function PrincipleCard({
  principle,
  featured,
}: {
  principle: Principle;
  featured: boolean;
}) {
  const Icon = principle.icon;
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-sm border p-8 sm:p-10",
        "bg-[#0D1114]",
        featured
          ? "border-[#C8A45D]/45"
          : "border-white/10 transition-colors duration-300 hover:border-white/20 motion-reduce:transition-none",
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-sm border",
            featured ? "border-[#C8A45D]/45" : "border-white/15",
          )}
        >
          <Icon
            size={19}
            strokeWidth={1.4}
            aria-hidden
            className="text-[#C8A45D]"
          />
        </span>
        <span className="pt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[#C8A45D]/80">
          {principle.label}
        </span>
      </div>

      <h3 className="mt-8 font-display text-xl font-semibold tracking-tight text-[#F5F7F8] sm:text-[1.35rem]">
        {principle.title}
      </h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-[#A9B2BA]">
        {principle.body}
      </p>
    </article>
  );
}

export function WhyChooseUsSection() {
  return (
    <Section rule aria-labelledby="home-why" className="overflow-x-clip">
      <Container>
        {/* ---- Heading: headline | gold divider | statement ---- */}
        <Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-0">
            <div className="md:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C8A45D]">
                Why Sriyaan
              </p>
              <h2
                id="home-why"
                className="mt-5 font-display text-[clamp(2.4rem,4.6vw,4.2rem)] font-semibold leading-[1.02] tracking-tight text-[#F5F7F8]"
              >
                Built on exactness
              </h2>
            </div>

            {/* Thin vertical gold divider */}
            <div
              aria-hidden
              className="hidden w-px self-stretch bg-gradient-to-b from-transparent via-[#C8A45D]/40 to-transparent md:col-span-1 md:col-start-8 md:block"
            />

            <div className="flex items-end md:col-span-4 md:col-start-9">
              <p className="max-w-xs text-[15px] leading-7 text-[#A9B2BA]">
                Four working principles — stated as commitments, not
                marketing claims.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ---- 2×2 principle cards ---- */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-16">
          {PRINCIPLES.map((principle, i) => (
            <Reveal key={principle.label} delay={i * 70} className="h-full">
              <PrincipleCard principle={principle} featured={i === 0} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
