import { Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { WorldMap } from "@/components/patterns";
import { MAP_PENDING_NOTE, PLACEHOLDER_MAP_REGIONS } from "@/content/placeholders";

/**
 * SM–09 / GLOBAL REACH.
 * Dark section. The map ships in its neutral graticule state with
 * ZERO highlighted countries (DS §31.5) — the MapRegion[] contract
 * lights up markets only when the client confirms them.
 */
export function GlobalReachSection() {
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
            <p className="mt-8 text-mono-meta text-surface-muted">
              {MAP_PENDING_NOTE}
            </p>
          </div>

          {/* Map — cols 5–12 */}
          <Reveal delay={100} className="col-span-4 md:col-span-8">
            <WorldMap regions={PLACEHOLDER_MAP_REGIONS} pendingNote={MAP_PENDING_NOTE} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
