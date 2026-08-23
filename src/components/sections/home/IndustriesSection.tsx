import { Reveal, Stagger } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { IndustryRow } from "@/components/patterns";
import { PLACEHOLDER_INDUSTRIES } from "@/content/placeholders";
import { getPublishedIndustries } from "@/lib/repositories/content";

/**
 * SM–08 / INDUSTRIES.
 * Sunken band, ruled list (Card/Row — the DS-preferred pattern over
 * card grids). The four sectors are client-requested website
 * categories, not claims of existing customers; descriptions arrive
 * with client copy.
 */
export async function IndustriesSection() {
  const dbIndustries = await getPublishedIndustries().catch(() => []);
  const industries =
    dbIndustries.length > 0
      ? dbIndustries.map((industry, i) => ({
          slug: industry.slug,
          index: (i + 1).toString().padStart(2, "0"),
          name: industry.name,
          description: industry.description ?? undefined,
          href: "/industries" as string | undefined,
        }))
      : PLACEHOLDER_INDUSTRIES;
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
          {industries.map((industry, i) => (
            <IndustryRow
              key={industry.slug}
              industry={industry}
              position={i + 1}
              total={industries.length}
            />
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
