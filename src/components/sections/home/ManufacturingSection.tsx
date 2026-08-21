import { Parallax, Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { MediaFigure, PatternMedia } from "@/components/patterns";
import type { MediaRef } from "@/content/types";

/**
 * SM–06 / MANUFACTURING & INFRASTRUCTURE.
 * Dark storytelling section. The client requested real factory /
 * machinery / warehouse / packaging photography — these frames are
 * the drop-in architecture for those images (correct ratios, grade,
 * captions). Until supplied, honest placeholder panels render; no
 * stock imagery pretending to be the company (DS §25.7).
 *
 * The large frame uses the sanctioned parallax quota slot 2 of 3 —
 * it activates automatically once a real image src is set.
 */

// PLACEHOLDER-CONTENT: real client facility imagery pending.
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

export function ManufacturingSection() {
  return (
    <Section surface="dark" rule aria-labelledby="home-manufacturing">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-manufacturing"
            code="SM–06"
            eyebrow="Infrastructure"
            title="From intake to dispatch"
            lede="From sourcing and inspection to warehousing and dispatch — every consignment moves through the same disciplined sequence."
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8">
          {/* Large media frame — cols 1–8, parallax-ready */}
          <Reveal className="col-span-4 md:col-span-8">
            {PRIMARY_MEDIA.src ? (
              <Parallax ratio="16/9" range={0.08}>
                <PatternMedia
                  media={PRIMARY_MEDIA}
                  ratio="16/9"
                  sizes="(min-width: 48rem) 66vw, 100vw"
                  surface="media"
                  graded
                  className="h-full"
                />
              </Parallax>
            ) : (
              <MediaFigure
                media={PRIMARY_MEDIA}
                figure={1}
                caption="REPRESENTATIVE IMAGERY — CLIENT FACILITY PHOTOGRAPHY PENDING"
                ratio="16/9"
                sizes="(min-width: 48rem) 66vw, 100vw"
              />
            )}
          </Reveal>

          {/* Secondary media + process list — cols 9–12 */}
          <div className="col-span-4 flex flex-col gap-8 md:col-span-4">
            <Reveal delay={100}>
              <MediaFigure
                media={SECONDARY_MEDIA}
                figure={2}
                caption="MATERIAL DETAIL — REPRESENTATIVE IMAGERY"
                ratio="4/3"
                sizes="(min-width: 48rem) 33vw, 100vw"
              />
            </Reveal>

            <Reveal delay={160}>
              <ol className="border-t border-edge">
                {PROCESS_STEPS.map((step) => (
                  <li
                    key={step.index}
                    className="group flex items-baseline gap-4 border-b border-edge py-4"
                  >
                    <span className="text-mono-meta text-surface-muted tabular-nums transition-colors duration-(--duration-base) group-hover:text-accent">
                      {step.index}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-heading-sm text-surface-fg">
                        {step.label}
                      </span>
                      <span className="text-mono-micro text-surface-muted">
                        {step.note}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
