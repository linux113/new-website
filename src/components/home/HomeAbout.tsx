import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, MessagesSquare, Truck } from "lucide-react";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

const POINTS = [
  { icon: BadgeCheck, text: "Specification matching & material verification" },
  { icon: PackageCheck, text: "Import, export & sourcing coordination" },
  { icon: MessagesSquare, text: "Direct communication, no middle layers" },
  { icon: Truck, text: "Delivery coordination across India & global markets" },
];

export function HomeAbout() {
  return (
    <section
      aria-labelledby="home-about-title"
      className="border-t border-white/10 bg-[#05080B] py-20 lg:py-28"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-6">
            <p className="font-mono text-[1rem] font-semibold uppercase tracking-[0.16em] text-[#C8A45D]">
              About
            </p>
            <h2
              id="home-about-title"
              className="mt-4 font-display text-[clamp(1.9rem,3.4vw,3.2rem)] font-semibold leading-[1.08] tracking-tight text-[#F5F7F8]"
            >
              A Mumbai trading desk built around reliable supply.
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#A9B2BA] sm:text-base">
              SRIYAAN METALS is a metals trading, import and export
              business operating from Opera House, Mumbai. We source,
              verify and deliver material against the buyer&apos;s
              specification — with procurement support and clear,
              direct communication at every stage. No invented history,
              headcount or market claims: just verified facts and
              dependable supply.
            </p>
            <Link
              href="/about"
              className="group mt-7 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#E5C074] transition-colors hover:text-[#F0C66D]"
            >
              More about SRIYAAN METALS
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-6">
            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/8 sm:grid-cols-2">
              {POINTS.map((p) => {
                const Icon = p.icon;
                return (
                  <li
                    key={p.text}
                    className="flex items-start gap-3 bg-[#05080B] p-5 transition-colors duration-300 hover:bg-[#0A1015]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#C8A45D]/25 bg-[#C8A45D]/10 text-[#C8A45D]">
                      <Icon size={17} strokeWidth={1.6} />
                    </span>
                    <span className="text-[13.5px] leading-snug text-[#C9D0D5]">
                      {p.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
