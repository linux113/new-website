import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { MediaFigure } from "@/components/patterns";
import { Container, Section, SectionHeading } from "@/components/ui";
import type { MediaRef } from "@/content/types";
import { SITE_URL } from "@/content/site";
import { toMediaRef } from "@/lib/mappers";
import { getPublishedInfrastructure } from "@/lib/repositories/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Manufacturing",
  description:
    "From sourcing and inspection to warehousing and dispatch — the sequence every SRIYAAN METALS consignment follows.",
  alternates: { canonical: `${SITE_URL}/manufacturing` },
};

const PRIMARY_MEDIA: MediaRef = {
  src: "/images/material-wide.jpg",
  alt: "Metal stock in storage — representative imagery",
};

const SECONDARY_MEDIA: MediaRef = {
  src: "/images/material-detail.jpg",
  alt: "Machined steel surface detail — representative imagery",
};

const PROCESS_STEPS = [
  { index: "01", label: "Sourcing", note: "Material sourced against the buyer's specification" },
  { index: "02", label: "Inspection", note: "Checked against order requirements before acceptance" },
  { index: "03", label: "Warehousing", note: "Held and handled to preserve material condition" },
  { index: "04", label: "Packaging & dispatch", note: "Packed and dispatched per the agreed schedule" },
];

export default async function ManufacturingPage() {
  const infrastructure = await getPublishedInfrastructure().catch(() => []);

  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="manufacturing-heading">
      <Container>
        <Breadcrumbs
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "Manufacturing" }]}
        />
        <SectionHeading
          id="manufacturing-heading"
          code="SM–MF"
          eyebrow="Infrastructure"
          title="From intake to dispatch"
          lede="Every consignment moves through the same sequence. Facility photography below is representative until client plant imagery is published."
          as="h1"
        />

        <div className="mt-16 grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8">
          <div className="col-span-4 md:col-span-8">
            <MediaFigure
              media={PRIMARY_MEDIA}
              figure={1}
              caption="REPRESENTATIVE IMAGERY — CLIENT FACILITY PHOTOGRAPHY PENDING"
              ratio="16/9"
              sizes="(min-width: 48rem) 66vw, 100vw"
            />
          </div>
          <div className="col-span-4 flex flex-col gap-8 md:col-span-4">
            <MediaFigure
              media={SECONDARY_MEDIA}
              figure={2}
              caption="MATERIAL DETAIL — REPRESENTATIVE IMAGERY"
              ratio="4/3"
              sizes="(min-width: 48rem) 33vw, 100vw"
            />
            <ol className="border-t border-edge">
              {PROCESS_STEPS.map((step) => (
                <li
                  key={step.index}
                  className="flex items-baseline gap-4 border-b border-edge py-4"
                >
                  <span className="text-mono-meta text-surface-muted tabular-nums">
                    {step.index}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-heading-sm text-surface-fg">{step.label}</span>
                    <span className="text-mono-micro text-surface-muted">{step.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-20">
          <p className="text-mono-meta text-surface-muted">Published infrastructure</p>
          {infrastructure.length === 0 ? (
            <p className="text-body text-surface-muted mt-4 max-w-measure">
              Factory, machinery, warehouse and packaging frames publish here
              once they are uploaded and marked published. Nothing is shown
              before then.
            </p>
          ) : (
            <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {infrastructure.map((item, i) => (
                <li key={item.id}>
                  <MediaFigure
                    media={
                      toMediaRef(item.media) ?? {
                        src: null,
                        alt: item.title,
                        placeholderLabel: "IMAGE — [AWAITING CLIENT ASSET]",
                      }
                    }
                    figure={i + 3}
                    caption={item.caption ?? item.title}
                    ratio="4/3"
                    sizes="(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </Section>
  );
}
