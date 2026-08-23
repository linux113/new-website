import { PackageCheck, Scale, Timer, Truck } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { FeatureItem } from "@/components/patterns";

/**
 * SM–05 / WHY CHOOSE US.
 * Signature editorial offset (DS §18): heading block cols 1–5,
 * ruled 2×2 feature grid cols 6–12 with shared hairlines — not
 * floating cards. Neutral commitment themes (quality, reliability,
 * supply, responsiveness); factual claims arrive only with client
 * data (DS §31).
 */

const FEATURES = [
  {
    icon: Scale,
    heading: "Quality",
    body: "Material supplied to the agreed specification — checked before it ships, documented where required.",
  },
  {
    icon: PackageCheck,
    heading: "Reliability",
    body: "Committed quantities and committed dates. A confirmed order is treated as a fixed obligation.",
  },
  {
    icon: Truck,
    heading: "Supply",
    body: "Domestic trading and import–export pathways from Mumbai, structured around each buyer's requirement.",
  },
  {
    icon: Timer,
    heading: "Responsiveness",
    body: "Direct access on phone, WhatsApp and email during working hours — enquiries answered by people, not queues.",
  },
];

export function WhyChooseUsSection() {
  return (
    <Section rule aria-labelledby="home-why">
      <Container>
        <div className="grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8">
          {/* Heading — cols 1–5, sticky on tall viewports */}
          <div className="col-span-4 md:col-span-5">
            <Reveal>
              <SectionHeading
                id="home-why"
                code="SM–05"
                eyebrow="Why SRIYAAN"
                title="Built on exactness"
                lede="Four working principles — stated as commitments, not marketing claims."
                align="start"
              />
            </Reveal>
          </div>

          {/* Ruled 2×2 feature grid — cols 6–12 */}
          <Reveal
            delay={100}
            className="col-span-4 md:col-span-7 md:col-start-6"
          >
            <div className="grid grid-cols-1 border border-edge sm:grid-cols-2 sm:divide-x sm:divide-(--surface-edge) [&>*:nth-child(n+2)]:border-t [&>*:nth-child(n+2)]:border-edge sm:[&>*:nth-child(2)]:border-t-0 sm:[&>*:nth-child(n+3)]:border-t">
              {FEATURES.map((feature, i) => (
                <FeatureItem
                  key={feature.heading}
                  icon={feature.icon}
                  index={i + 1}
                  heading={feature.heading}
                >
                  {feature.body}
                </FeatureItem>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
