import { ClipboardCheck, FileCheck, SearchCheck } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Container, Section, SectionHeading } from "@/components/ui";
import { CertSlot, FeatureItem } from "@/components/patterns";
import { PLACEHOLDER_CERTIFICATIONS } from "@/content/placeholders";
import { getPublishedCertifications } from "@/lib/repositories/content";
import { toMediaRef } from "@/lib/mappers";

/**
 * SM–07 / QUALITY & CERTIFICATIONS.
 * Editorial split: quality commitments (left) + certification slots
 * (right). CertSlots render the explicit pending state — no invented
 * certification names, logos or numbers, ever (DS §31.2).
 */

const QUALITY_PRACTICES = [
  {
    icon: SearchCheck,
    heading: "Inspection",
    body: "Incoming and outgoing material checked against the order specification.",
  },
  {
    icon: FileCheck,
    heading: "Documentation",
    body: "Test certificates and compliance papers passed through to the buyer where applicable.",
  },
  {
    icon: ClipboardCheck,
    heading: "Traceability",
    body: "Order-to-dispatch records maintained for every consignment.",
  },
];

export async function QualitySection() {
  const dbCerts = await getPublishedCertifications().catch(() => []);
  const live = dbCerts.length > 0;
  const certifications = live
    ? dbCerts.map((cert) => ({
        id: cert.id,
        name: cert.name,
        status: "provided" as const,
        document: toMediaRef(cert.document),
      }))
    : PLACEHOLDER_CERTIFICATIONS;
  return (
    <Section rule aria-labelledby="home-quality">
      <Container>
        <Reveal>
          <SectionHeading
            id="home-quality"
            code="SM–07"
            eyebrow="Quality"
            title="Verified, then shipped"
            lede={
              live
                ? "Certifications below are admin-verified documents."
                : "Certifications publish here once verified — nothing is displayed before the documents are in hand."
            }
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8">
          {/* Practices — ruled list, cols 1–6 */}
          <Reveal className="col-span-4 md:col-span-6">
            <div className="flex flex-col divide-y divide-(--surface-edge) border-y border-edge">
              {QUALITY_PRACTICES.map((practice, i) => (
                <FeatureItem
                  key={practice.heading}
                  icon={practice.icon}
                  index={i + 1}
                  heading={practice.heading}
                  className="px-0 lg:px-0"
                >
                  {practice.body}
                </FeatureItem>
              ))}
            </div>
          </Reveal>

          {/* Certification slots — cols 8–12 */}
          <Reveal delay={100} className="col-span-4 md:col-span-5 md:col-start-8">
            <p className="text-mono-meta text-surface-muted">
              {live ? "Certifications" : "Certifications — pending verification"}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <CertSlot key={cert.id} certification={cert} />
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
