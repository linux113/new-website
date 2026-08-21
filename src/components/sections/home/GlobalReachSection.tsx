import { Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { WorldMap } from "@/components/patterns";
import { MAP_PENDING_NOTE } from "@/content/placeholders";
import { getPublishedGlobalCountries } from "@/lib/repositories/content";

/**
 * SM–09 / GLOBAL REACH.
 * Dark section. Markets render only when the admin publishes
 * verified GlobalCountry rows; otherwise the neutral graticule
 * state with zero highlighted countries (DS §31.5).
 */
export async function GlobalReachSection() {
  const countries = await getPublishedGlobalCountries().catch(() => []);
  const regions = countries.map((country) => ({
    code: country.code,
    label: country.label,
  }));
  return (
    <Section surface="dark" rule aria-labelledby="home-global">
      <Container>
        <div className="grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8">
          {/* Copy — cols 1–4 */}
          <div className="col-span-4 md:col-span-4">
            <Reveal>
              <SectionHeading
                id="home-global"
                code="SM–09"
                eyebrow="Global reach"
                title="Sourcing and supplying across borders"
                lede="Import and export operations run from Mumbai. Confirmed market data will be plotted here once verified."
                align="start"
              />
            </Reveal>
            {regions.length === 0 ? (
              <p className="mt-8 text-mono-meta text-surface-muted">
                {MAP_PENDING_NOTE}
              </p>
            ) : null}
          </div>

          {/* Map — cols 5–12 */}
          <Reveal delay={100} className="col-span-4 md:col-span-8">
            <WorldMap regions={regions} pendingNote={MAP_PENDING_NOTE} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
