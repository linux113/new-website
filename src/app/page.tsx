import { Breadcrumbs } from "@/components/layout";
import { CountUp, Reveal, Stagger } from "@/components/motion";
import {
  Container,
  Eyebrow,
  Hairline,
  IndexNumber,
  Section,
  SectionHeading,
} from "@/components/ui";

/**
 * PHASE 1–2 — FOUNDATION PREVIEW.
 * Not the homepage. Verifies tokens, typography, surfaces, layout
 * shell and the motion layer across breakpoints. Replaced by the real
 * homepage in a later phase. No company/product/certification data
 * appears here (DS §31).
 */
export default function FoundationPreview() {
  return (
    <>
      {/* Surface: dark — hero-rhythm demonstration (under fixed header) */}
      <Section surface="dark" rhythm="hero" aria-labelledby="fp-hero" className="pt-40 lg:pt-56">
        <Container>
          <div className="flex flex-col gap-6">
            <Eyebrow code="SM–00">Foundation preview — FORGE/01</Eyebrow>
            <h1 id="fp-hero" className="text-display-xl text-balance">
              Design system foundation
            </h1>
            <p className="text-body-lg text-surface-muted max-w-measure">
              Tokens, typography, surfaces, layout shell and motion layer.
              This page is a build-time verification artifact, not the
              homepage.
            </p>
          </div>
        </Container>
      </Section>

      {/* Surface: page — offset section heading + scroll reveal */}
      <Section rule aria-labelledby="fp-type">
        <Container>
          <Breadcrumbs
            className="mb-12"
            items={[{ label: "Home", href: "/" }, { label: "Foundation preview" }]}
          />
          <SectionHeading
            id="fp-type"
            code="SM–01"
            eyebrow="Typography hierarchy"
            title="Named steps, never raw sizes"
            lede="Display, text and mono roles verified across the fluid scale. Body copy holds a 65ch measure; the meta layer is set in IBM Plex Mono."
          />
          <Reveal className="mt-16">
            <div className="flex flex-col gap-8">
              <Hairline />
              <p className="text-display-lg">Display large</p>
              <p className="text-display-md">Display medium</p>
              <p className="text-heading-sm">Heading small</p>
              <p className="text-body max-w-measure">
                Body — precision alloy supply, presented with editorial calm.
                Declarative sentences, exact spacing, one accent used
                sparingly.
              </p>
              <p className="text-label">Label / button case</p>
              <p className="text-mono-meta">Mono meta — FIG. 01</p>
              <p className="text-mono-micro">Mono micro — footnote layer</p>
              <Hairline />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Surface: sunken — stagger + ruled rows + count-up */}
      <Section surface="sunken" rule aria-labelledby="fp-grid">
        <Container>
          <SectionHeading
            id="fp-grid"
            code="SM–02"
            eyebrow="Motion layer"
            title="Machinery, not theatre"
            align="start"
          />
          <Stagger as="ul" className="mt-12 border-t border-edge">
            {["Scroll reveal", "Staggered entrance", "Number counters"].map(
              (item, i) => (
                <li
                  key={item}
                  className="group flex items-baseline gap-6 border-b border-edge py-6"
                >
                  <IndexNumber value={i + 1} of={3} />
                  <span className="text-heading-sm">{item}</span>
                </li>
              ),
            )}
          </Stagger>

          {/* CountUp: placeholder-safe demo values only (DS §31.1) */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <p className="text-stat">
                <CountUp value={100} suffix="%" />
              </p>
              <p className="text-mono-meta text-surface-muted">
                Tokens — no raw values
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-stat">
                <CountUp value={null} placeholder="[—]" />
              </p>
              <p className="text-mono-meta text-surface-muted">
                Metric — awaiting client data
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-stat">
                <CountUp value={12} />
              </p>
              <p className="text-mono-meta text-surface-muted">
                Type steps in the scale
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
