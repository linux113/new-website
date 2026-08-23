import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { IndustryRow } from "@/components/patterns";
import { Container, Section, SectionHeading } from "@/components/ui";
import { PLACEHOLDER_INDUSTRIES } from "@/content/placeholders";
import { SITE_URL } from "@/content/site";
import { getPublishedIndustries } from "@/lib/repositories/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Sectors SRIYAAN METALS supplies — construction, automotive, engineering and infrastructure. Descriptions publish when approved.",
  alternates: { canonical: `${SITE_URL}/industries` },
};

export default async function IndustriesPage() {
  const dbIndustries = await getPublishedIndustries().catch(() => []);
  const industries =
    dbIndustries.length > 0
      ? dbIndustries.map((industry, i) => ({
          slug: industry.slug,
          index: (i + 1).toString().padStart(2, "0"),
          name: industry.name,
          description: industry.description ?? undefined,
        }))
      : PLACEHOLDER_INDUSTRIES.map(({ slug, index, name, description }) => ({
          slug,
          index,
          name,
          description,
        }));

  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="industries-heading">
      <Container>
        <Breadcrumbs
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        />
        <SectionHeading
          id="industries-heading"
          code="SM–IN"
          eyebrow="Sectors"
          title="Where the material goes"
          lede="Sector pages requested for the site. These are categories, not claims of existing customers. Detailed descriptions appear when the client publishes them."
          as="h1"
        />

        <div className="mt-16 border-t border-edge">
          {industries.map((industry, i) => (
            <IndustryRow
              key={industry.slug}
              industry={industry}
              position={i + 1}
              total={industries.length}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
