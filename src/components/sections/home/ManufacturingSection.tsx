import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  PackageCheck,
  Search,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion";
import { Container, Section } from "@/components/ui";

/**
 * INFRASTRUCTURE — "From intake to dispatch" (homepage).
 *
 * Restrained premium composition matching the /manufacturing page:
 *   - Two-column editorial heading (eyebrow + display H2 | thin gold
 *     divider | supporting statement)
 *   - Large facility imagery with sentence-case figure captions
 *   - Four process rows — gold line icon in a square outline, number,
 *     title, note — closed by a mono-gold "View infrastructure" link
 * No glows, no heavy motion: staggered reveals only.
 */

interface Step {
  index: string;
  icon: LucideIcon;
  title: string;
  note: string;
}

const STEPS: Step[] = [
  {
    index: "01",
    icon: Search,
    title: "Sourcing",
    note: "Material sourced against the buyer's specification",
  },
  {
    index: "02",
    icon: ClipboardCheck,
    title: "Inspection",
    note: "Checked against order requirements before acceptance",
  },
  {
    index: "03",
    icon: Warehouse,
    title: "Warehousing",
    note: "Held and handled to preserve material condition",
  },
  {
    index: "04",
    icon: PackageCheck,
    title: "Packaging & dispatch",
    note: "Packed and dispatched per the agreed schedule",
  },
];

export function ManufacturingSection() {
  return (
    <Section
      rule
      aria-labelledby="home-manufacturing"
      className="overflow-x-clip bg-[#05080B] text-[#F5F7F8]"
    >
      <Container>
        {/* ---- Heading: headline | gold divider | statement ---- */}
        <Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-0">
            <div className="md:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C8A45D]">
                Infrastructure
              </p>
              <h2
                id="home-manufacturing"
                className="mt-5 font-display text-[clamp(2.4rem,4.6vw,4.2rem)] font-semibold leading-[1.02] tracking-tight text-[#F5F7F8]"
              >
                From intake to dispatch
              </h2>
            </div>

            <div
              aria-hidden
              className="hidden w-px self-stretch bg-gradient-to-b from-transparent via-[#C8A45D]/40 to-transparent md:col-span-1 md:col-start-8 md:block"
            />

            <div className="flex items-end md:col-span-4 md:col-start-9">
              <p className="max-w-xs text-[15px] leading-7 text-[#A9B2BA]">
                From sourcing and inspection to warehousing and dispatch —
                every consignment moves through the same disciplined
                sequence.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          {/* ---- Left: facility imagery ---- */}
          <div className="flex flex-col gap-5 lg:col-span-7">
            <Reveal className="keep-dark relative overflow-hidden rounded-lg border border-white/10">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/images/manufacturing/hero-coils.jpg"
                  alt="Steel coils staged for inspection and dispatch — representative infrastructure imagery"
                  fill
                  sizes="(min-width: 64rem) 55vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
                />
                {/* quiet grade so text overlays stay legible */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05080B]/55 via-transparent to-transparent"
                />
                <span className="absolute bottom-4 left-4 font-mono text-xs tracking-[0.05em] text-[#C9D0D5]">
                  FIG. 01 — Intake, inspection and staging
                </span>
              </div>
            </Reveal>

            <Reveal delay={100} className="keep-dark relative overflow-hidden rounded-lg border border-white/10">
              <div className="relative aspect-[16/7] w-full">
                <Image
                  src="/images/manufacturing/dispatch.jpg"
                  alt="Packed material prepared for dispatch — representative infrastructure imagery"
                  fill
                  sizes="(min-width: 64rem) 55vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05080B]/55 via-transparent to-transparent"
                />
                <span className="absolute bottom-3 left-4 font-mono text-xs tracking-[0.05em] text-[#C9D0D5]">
                  FIG. 02 — Packaging and dispatch
                </span>
              </div>
            </Reveal>
          </div>

          {/* ---- Right: the four-step sequence ---- */}
          <Reveal delay={80} className="lg:col-span-5">
            <ol className="flex h-full flex-col border-t border-white/10">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.index}
                    className={`group flex flex-1 items-center gap-5 border-b border-white/10 py-6 transition-colors duration-300 hover:bg-white/[0.02] motion-reduce:transition-none ${
                      i === 0 ? "border-l border-l-[#C8A45D]/45 pl-5" : ""
                    }`}
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-white/15 text-[#C8A45D]">
                      <Icon size={19} strokeWidth={1.4} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-[15px] font-semibold tabular-nums text-[#C8A45D]">
                          {step.index}
                        </span>
                        <span className="font-display text-lg font-semibold tracking-tight text-[#F5F7F8]">
                          {step.title}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[#A9B2BA]">
                        {step.note}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>

            <Link
              href="/manufacturing"
              className="group mt-8 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#E5C074] transition-colors hover:text-[#F0C66D]"
            >
              View infrastructure
              <ArrowRight
                size={14}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
