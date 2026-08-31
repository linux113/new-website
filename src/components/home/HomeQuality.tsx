import Link from "next/link";
import { ArrowRight, Search, FileCheck, ClipboardCheck, MessagesSquare } from "lucide-react";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

const ITEMS = [
  { icon: Search, title: "Material verification", desc: "Incoming & outgoing checks against order specification." },
  { icon: FileCheck, title: "Documentation", desc: "Test certificates and compliance papers where applicable." },
  { icon: ClipboardCheck, title: "Specification matching", desc: "Grades, sizes and finishes aligned to the requirement." },
  { icon: MessagesSquare, title: "Consistent communication", desc: "Clear updates from enquiry through to dispatch." },
];

export function HomeQuality() {
  return (
    <section
      aria-labelledby="home-quality-title"
      className="border-t border-white/10 bg-[#070B0F] py-20 lg:py-28"
    >
      <Container>
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C8A45D]">
              Quality
            </p>
            <h2
              id="home-quality-title"
              className="mt-4 max-w-2xl font-display text-[clamp(1.9rem,3.4vw,3.2rem)] font-semibold leading-[1.05] tracking-tight text-[#F5F7F8]"
            >
              Verified, then shipped.
            </h2>
          </div>
          <Link
            href="/quality"
            className="group inline-flex items-center gap-2 self-start font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#E5C074] md:self-auto"
          >
            Our quality process
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal as="li" key={item.title} delay={i * 90}>
                <div className="group h-full rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C8A45D]/35 hover:bg-white/[0.04]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#C8A45D]/25 bg-[#C8A45D]/10 text-[#C8A45D] transition-all duration-300 group-hover:shadow-[0_0_22px_-8px_rgba(200,164,93,0.9)]">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-4 font-display text-[1.25rem] font-semibold leading-snug text-[#F5F7F8] sm:text-[1.4rem]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#A9B2BA]">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
