import {
  Container,
  Eyebrow,
  Hairline,
  IndexNumber,
  Section,
  SectionHeading,
} from "@/components/ui";

/**
 * PHASE 1 — FOUNDATION PREVIEW.
 * Not the homepage. This page exists only to verify design tokens,
 * typography hierarchy, surfaces and the six foundation primitives
 * across breakpoints. It is replaced by the real homepage in a later
 * phase. No company/product/certification data appears here (DS §31).
 */
export default function FoundationPreview() {
  return (
    <>
      {/* Surface: dark — hero-rhythm demonstration */}
      <Section surface="dark" rhythm="hero" aria-labelledby="fp-hero">
        <Container>
          <div className="flex flex-col gap-6">
            <Eyebrow code="SM–00">Foundation preview — FORGE/01</Eyebrow>
            <h1 id="fp-hero" className="text-display-xl text-balance">
              Design system foundation
            </h1>
            <p className="text-body-lg text-surface-muted max-w-measure">
              Tokens, typography, surfaces and primitives. This page is a
              build-time verification artifact, not the homepage.
            </p>
          </div>
        </Container>
      </Section>

      {/* Surface: page — offset section heading pattern */}
      <Section rule aria-labelledby="fp-type">
        <Container>
          <SectionHeading
            id="fp-type"
            code="SM–01"
            eyebrow="Typography hierarchy"
            title="Named steps, never raw sizes"
            lede="Display, text and mono roles verified across the fluid scale. Body copy holds a 65ch measure; the meta layer is set in IBM Plex Mono."
          />
          <div className="mt-16 flex flex-col gap-8">
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
        </Container>
      </Section>

      {/* Surface: sunken — ruled row + index numbers */}
      <Section surface="sunken" rule aria-labelledby="fp-grid">
        <Container>
          <SectionHeading
            id="fp-grid"
            code="SM–02"
            eyebrow="Grid & indices"
            title="Ruled rows over card grids"
            align="start"
          />
          <ul className="mt-12 border-t border-edge">
            {["Hairline system", "Index numbering", "Editorial asymmetry"].map(
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
          </ul>
        </Container>
      </Section>
    </>
  );
}
