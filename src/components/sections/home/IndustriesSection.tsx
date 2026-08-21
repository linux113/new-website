import { Reveal, Stagger } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { IndustryRow } from "@/components/patterns";
import { PLACEHOLDER_INDUSTRIES } from "@/content/placeholders";

/**
 * SM–08 / INDUSTRIES.
 * Sunken band, ruled list (Card/Row — the DS-preferred pattern over
 * card grids). The four sectors are client-requested website
 * categories, not claims of existing customers; descriptions arrive
 * with client copy.
 */
export function IndustriesSection() {
  return (
    <Section surface="sunken" rule aria-labelledby="home-industries">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-industries"
            code="SM–08"
            eyebrow="Sectors served"
            title="Where the material goes"
            lede="Sector pages requested by the client. Detailed descriptions follow with approved copy."
          />
        </Reveal>

        <Stagger className="mt-16 border-t border-edge">
          {PLACEHOLDER_INDUSTRIES.map((industry, i) => (
            <IndustryRow
              key={industry.slug}
              industry={industry}
              position={i + 1}
              total={PLACEHOLDER_INDUSTRIES.length}
            />
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
