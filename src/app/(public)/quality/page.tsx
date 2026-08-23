import type { Metadata } from "next";
import { ClipboardCheck, FileCheck, SearchCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { CertSlot, FeatureItem } from "@/components/patterns";
import { Container, Section, SectionHeading } from "@/components/ui";
import { PLACEHOLDER_CERTIFICATIONS } from "@/content/placeholders";
import { SITE_URL } from "@/content/site";
import { toMediaRef } from "@/lib/mappers";
import { getPublishedCertifications } from "@/lib/repositories/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Quality",
  description:
    "How SRIYAAN METALS inspects, documents and traces material. Certifications appear here only once the documents are in hand.",
  alternates: { canonical: `${SITE_URL}/quality` },
};

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

export default async function QualityPage() {
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
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="quality-heading">
      <Container>
        <Breadcrumbs
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "Quality" }]}
        />
        <SectionHeading
          id="quality-heading"
          code="SM–QL"
          eyebrow="Quality"
          title="Verified, then shipped"
          lede={
            live
              ? "Practices we run on every order, and certifications that have been verified."
              : "Practices we run on every order. Certification marks publish here only after the documents are in hand."
          }
          as="h1"
        />

        <div className="mt-16 grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8">
          <div className="col-span-4 md:col-span-6">
            <p className="text-mono-meta text-surface-muted">Practices</p>
            <div className="mt-4 flex flex-col divide-y divide-(--surface-edge) border-y border-edge">
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
          </div>

          <div className="col-span-4 md:col-span-5 md:col-start-8">
            <p className="text-mono-meta text-surface-muted">
              {live ? "Certifications" : "Certifications — pending verification"}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <CertSlot key={cert.id} certification={cert} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
