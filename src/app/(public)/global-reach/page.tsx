import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { WorldMap } from "@/components/patterns";
import { Container, Section, SectionHeading } from "@/components/ui";
import { MAP_PENDING_NOTE } from "@/content/placeholders";
import { SITE_URL } from "@/content/site";
import { getPublishedGlobalCountries } from "@/lib/repositories/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Global Reach",
  description:
    "SRIYAAN METALS import and export operations run from Mumbai. Confirmed markets are plotted here once verified.",
  alternates: { canonical: `${SITE_URL}/global-reach` },
};

export default async function GlobalReachPage() {
  const countries = await getPublishedGlobalCountries().catch(() => []);
  const regions = countries.map((country) => ({
    code: country.code,
    label: country.label,
  }));

  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="global-heading">
      <Container>
        <Breadcrumbs
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "Global Reach" }]}
        />

        <div className="grid grid-cols-4 gap-8 md:grid-cols-12">
          <div className="col-span-4 md:col-span-5">
            <SectionHeading
              id="global-heading"
              code="SM–GR"
              eyebrow="Global reach"
              title="Sourcing and supplying across borders"
              lede="Import and export operations run from Mumbai. Markets appear on this map only after they have been confirmed and published."
              align="start"
              as="h1"
            />
            {regions.length === 0 ? (
              <p className="mt-8 text-mono-meta text-surface-muted">{MAP_PENDING_NOTE}</p>
            ) : (
              <ul className="mt-10 flex flex-col border-t border-edge">
                {regions.map((region, i) => (
                  <li
                    key={region.code}
                    className="flex items-baseline justify-between gap-4 border-b border-edge py-4"
                  >
                    <span className="text-heading-sm text-surface-fg">{region.label}</span>
                    <span className="text-mono-micro text-surface-muted tabular-nums">
                      {region.code.toUpperCase()} · {(i + 1).toString().padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-span-4 md:col-span-7">
            <WorldMap regions={regions} pendingNote={MAP_PENDING_NOTE} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
