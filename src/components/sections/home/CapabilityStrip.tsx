import { Stagger } from "@/components/motion";
import { Container, Section } from "@/components/ui";

/**
 * SM–02 / CAPABILITY STRIP.
 * Restrained hairline-divided trust band. No invented statistics —
 * neutral capability labels only (the brief's PRODUCTS / QUALITY /
 * SUPPLY / IMPORT-EXPORT structure). When verified metrics arrive,
 * swap these entries for StatItem + CountUp without layout change.
 */

const CAPABILITIES = [
  { index: "01", label: "Products", note: "Enquiry-driven catalogue" },
  { index: "02", label: "Quality", note: "Checked before dispatch" },
  { index: "03", label: "Supply", note: "Domestic trading & distribution" },
  { index: "04", label: "Import / Export", note: "International sourcing & sales" },
];

export function CapabilityStrip() {
  return (
    <Section rule rhythm="none" aria-label="Capabilities" className="py-0">
      <Container>
        <Stagger
          as="ul"
          className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-(--surface-edge)"
          itemClassName="border-b border-edge md:border-b-0"
        >
          {CAPABILITIES.map((cap) => (
            <div key={cap.index} className="flex flex-col gap-2 py-8 md:px-8 md:first:pl-0 md:py-10">
              <p className="text-mono-meta text-accent tabular-nums">{cap.index}</p>
              <p className="text-display-md text-surface-fg">{cap.label}</p>
              <p className="text-mono-micro text-surface-muted">{cap.note}</p>
            </div>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
