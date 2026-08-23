import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Container, Hairline, Icon, Section, SectionHeading } from "@/components/ui";

/**
 * SM–10 / IMPORT & EXPORT.
 * Two-column directional composition split by a vertical hairline —
 * inbound (import) vs outbound (export). Directional arrows carry
 * the visual language; copy stays conservative until the client
 * supplies trade specifics (DS §31).
 */

const FLOWS = [
  {
    icon: ArrowDownLeft,
    direction: "Inbound",
    heading: "Import",
    body: "Sourcing material from international suppliers against specific buyer requirements — grades, quantities and schedules confirmed before commitment.",
    meta: "ROUTES & ORIGINS — [PENDING CLIENT INPUT]",
  },
  {
    icon: ArrowUpRight,
    direction: "Outbound",
    heading: "Export",
    body: "Supplying material to overseas buyers with export documentation and coordinated dispatch from Mumbai.",
    meta: "MARKETS & TERMS — [PENDING CLIENT INPUT]",
  },
];

export function ImportExportSection() {
  return (
    <Section rule aria-labelledby="home-trade">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-trade"
            code="SM–10"
            eyebrow="Trade"
            title="Two directions, one standard"
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-16 grid grid-cols-1 border border-edge md:grid-cols-2 md:divide-x md:divide-(--surface-edge)">
            {FLOWS.map((flow) => (
              <article
                key={flow.heading}
                className="group flex flex-col gap-5 p-6 max-md:nth-2:border-t max-md:nth-2:border-edge lg:p-12"
              >
                <div className="flex items-center justify-between">
                  <Icon
                    icon={flow.icon}
                    size={24}
                    className="text-accent transition-transform duration-(--duration-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  />
                  <p className="text-mono-meta text-surface-muted">{flow.direction}</p>
                </div>

                <h3 className="text-display-md text-surface-fg">{flow.heading}</h3>

                <p className="text-body text-surface-muted max-w-measure">
                  {flow.body}
                </p>

                <Hairline className="mt-auto" />
                <p className="text-mono-micro text-surface-muted">{flow.meta}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
