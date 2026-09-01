import { Reveal } from "@/components/motion";
import { Container } from "@/components/ui";
import { GlobalReachClient } from "@/components/global-reach/GlobalReachClient";
import { getPublishedGlobalCountries } from "@/lib/repositories/content";
import { getWorldDotsSvg } from "@/components/global-reach/world-map-data";

/**
 * SM–09 / GLOBAL REACH (homepage).
 * Reuses the premium animated map from the /global-reach page with
 * the five regions. Markets also reflect published
 * GlobalCountry rows from the database.
 */
export async function GlobalReachSection() {
  const countries = await getPublishedGlobalCountries().catch(() => []);
  const confirmedCodes = countries.map((c) => c.code.toLowerCase());
  const dotsSvg = getWorldDotsSvg();

  return (
    <section
      className="relative overflow-hidden border-t border-white/10 bg-[#05080B] py-20 text-[#F5F7F8] lg:py-28"
      aria-labelledby="home-global"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%,#000 20%,transparent 80%)",
        }}
      />
      <Container>
        <Reveal>
          <p className="font-mono text-[1rem] font-semibold uppercase tracking-[0.16em] text-[#D8A84E]">
              Global Reach
          </p>
          <h2
            id="home-global"
            className="mt-4 max-w-2xl font-display text-[clamp(1.9rem,3.4vw,3.2rem)] font-semibold leading-[1.05] tracking-tight text-[#F5F7F8]"
          >
            Sourcing and supplying across borders
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#A9B2BA]">
            Import and export operations run from Mumbai to confirmed
            markets across the Middle East, Europe, Southeast Asia,
            Africa and the Americas.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <GlobalReachClient
            confirmedCodes={confirmedCodes}
            dotsSvg={dotsSvg}
            embedded
          />
        </Reveal>
      </Container>
    </section>
  );
}
