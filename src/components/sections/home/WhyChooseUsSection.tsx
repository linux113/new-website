import { PackageCheck, Scale, Timer, Truck } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { GlowCard } from "@/components/patterns/GlowCard";

/**
 * SM–05 / WHY CHOOSE US.
 * Four neon GlowCards — quality, reliability, supply, responsiveness.
 * Body copy is unchanged; only the presentation is upgraded.
 */

const FEATURES = [
  {
    icon: Scale,
    glow: "#00F0FF",
    tag: "Quality",
    title: "Specification, honoured",
    body: "Material supplied to the agreed specification — checked before it ships, documented where required.",
  },
  {
    icon: PackageCheck,
    glow: "#00FF66",
    tag: "Reliability",
    title: "Committed, then kept",
    body: "Committed quantities and committed dates. A confirmed order is treated as a fixed obligation.",
  },
  {
    icon: Truck,
    glow: "#FFB020",
    tag: "Supply",
    title: "Two supply pathways",
    body: "Domestic trading and import–export pathways from Mumbai, structured around each buyer's requirement.",
  },
  {
    icon: Timer,
    glow: "#FF007F",
    tag: "Responsiveness",
    title: "People, not queues",
    body: "Direct access on phone, WhatsApp and email during working hours — enquiries answered by people, not queues.",
  },
];

export function WhyChooseUsSection() {
  return (
    <Section rule aria-labelledby="home-why" className="overflow-x-clip">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-why"
            code="SM–05"
            eyebrow="Why SRIYAAN"
            title="Built on exactness"
            lede="Four working principles — stated as commitments, not marketing claims."
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.tag} delay={i * 70}>
              <GlowCard
                glow={feature.glow}
                tag={feature.tag}
                title={feature.title}
                icon={feature.icon}
              >
                {feature.body}
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
