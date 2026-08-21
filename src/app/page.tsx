import { Breadcrumbs } from "@/components/layout";
import { CountUp, Reveal, Stagger } from "@/components/motion";
import {
  Carousel,
  CertSlot,
  IndustryRow,
  LogoSlot,
  ProductGrid,
  SpecTable,
  StatItem,
  TestimonialCard,
  WorldMap,
} from "@/components/patterns";
import {
  Container,
  Eyebrow,
  Hairline,
  IndexNumber,
  Section,
  SectionHeading,
} from "@/components/ui";
import {
  PLACEHOLDER_CERTIFICATIONS,
  PLACEHOLDER_INDUSTRIES,
  PLACEHOLDER_LOGO_COUNT,
  PLACEHOLDER_METRICS,
  PLACEHOLDER_PRODUCTS,
  PLACEHOLDER_TESTIMONIALS,
} from "@/content/placeholders";

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

      {/* PHASE 3 — pattern verification (placeholder data only) */}
      <Section rule aria-labelledby="fp-patterns">
        <Container>
          <SectionHeading
            id="fp-patterns"
            code="SM–03"
            eyebrow="Pattern layer"
            title="Reusable patterns, typed placeholders"
            lede="Every pattern below renders exclusively from the placeholder content module — no invented products, certifications, customers or markets."
          />

          <h3 className="mt-16 text-mono-meta text-surface-muted">
            ProductGrid / ProductCard
          </h3>
          <ProductGrid products={PLACEHOLDER_PRODUCTS} className="mt-6" />

          <h3 className="mt-16 text-mono-meta text-surface-muted">
            StatItem — hairline-divided band
          </h3>
          <div className="mt-6 grid grid-cols-2 gap-y-8 border-y border-edge py-8 md:grid-cols-4 md:divide-x md:divide-(--surface-edge) md:[&>*]:px-8 md:[&>*:first-child]:pl-0">
            {PLACEHOLDER_METRICS.map((metric) => (
              <StatItem key={metric.id} metric={metric} />
            ))}
          </div>

          <h3 className="mt-16 text-mono-meta text-surface-muted">
            IndustryRow — ruled list
          </h3>
          <div className="mt-6 border-t border-edge">
            {PLACEHOLDER_INDUSTRIES.map((industry, i) => (
              <IndustryRow
                key={industry.slug}
                industry={industry}
                position={i + 1}
                total={PLACEHOLDER_INDUSTRIES.length}
              />
            ))}
          </div>

          <h3 className="mt-16 text-mono-meta text-surface-muted">
            SpecTable — responsive (table ≥ md, stacked list &lt; md)
          </h3>
          <SpecTable
            className="mt-6"
            specifications={[
              { label: "Specification A", value: { value: null, placeholder: "[PENDING CLIENT INPUT]" } },
              { label: "Specification B", value: { value: null, placeholder: "[PENDING CLIENT INPUT]" } },
              { label: "Specification C", value: { value: null, placeholder: "[PENDING CLIENT INPUT]" } },
            ]}
          />

          <h3 className="mt-16 text-mono-meta text-surface-muted">
            CertSlot / LogoSlot — honest slots
          </h3>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3">
            {PLACEHOLDER_CERTIFICATIONS.map((cert) => (
              <CertSlot key={cert.id} certification={cert} />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: PLACEHOLDER_LOGO_COUNT }, (_, i) => (
              <LogoSlot key={i} />
            ))}
          </div>

          <h3 className="mt-16 text-mono-meta text-surface-muted">
            Carousel / TestimonialCard
          </h3>
          <Carousel label="Testimonials" className="mt-6">
            {PLACEHOLDER_TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} className="h-full" />
            ))}
          </Carousel>

          <h3 className="mt-16 text-mono-meta text-surface-muted">
            WorldMap — neutral state, zero highlighted markets
          </h3>
          <WorldMap className="mt-6" />
        </Container>
      </Section>
    </>
  );
}
