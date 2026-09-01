import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

const INDUSTRIES = [
  { index: "01", name: "Construction", desc: "Structural steel, reinforcement & fixing hardware" },
  { index: "02", name: "Automotive", desc: "Grades & finishes for component manufacturing" },
  { index: "03", name: "Engineering", desc: "Stock for fabrication, machinery & machine shops" },
  { index: "04", name: "Infrastructure", desc: "Materials for roads, bridges, utilities & public works" },
];

export function HomeIndustries() {
  return (
    <section
      aria-labelledby="home-industries-title"
      className="border-t border-white/10 bg-[#070B0F] py-20 lg:py-28"
    >
      <Container>
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C8A45D]">
            Industries
          </p>
          <h2
            id="home-industries-title"
            className="mt-4 max-w-2xl font-display text-[clamp(2.4rem,4.4vw,4rem)] font-semibold leading-[1.04] tracking-tight text-[#F5F7F8]"
          >
            Where the material goes.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#A9B2BA]">
            Sourcing and supply support across construction, automotive,
            engineering and infrastructure — matching material to project
            requirement.
          </p>
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {INDUSTRIES.map((ind, i) => (
            <Reveal as="li" key={ind.index} delay={i * 90}>
              <Link
                href="/industries"
                className="group flex h-full items-center gap-6 rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C8A45D]/40 hover:bg-white/[0.04] hover:shadow-[0_20px_50px_-40px_rgba(200,164,93,0.7)] sm:p-7"
              >
                <span className="font-mono text-2xl font-semibold tabular-nums text-[#C8A45D] sm:text-[1.75rem]">
                  {ind.index}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.5rem] font-semibold leading-tight tracking-tight text-[#F5F7F8] sm:text-[1.7rem]">
                    {ind.name}
                  </span>
                  <span className="mt-1.5 block text-[15px] leading-relaxed text-[#A9B2BA]">
                    {ind.desc}
                  </span>
                </span>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#C8A45D] transition-all duration-300 group-hover:border-[#C8A45D] group-hover:bg-[#C8A45D] group-hover:text-[#05080B]">
                  <ArrowRight
                    size={18}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
