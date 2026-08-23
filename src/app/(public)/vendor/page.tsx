import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { Container, Section, SectionHeading } from "@/components/ui";
import { VendorForm } from "@/components/forms/VendorForm";
import { getCompanyInfo } from "@/lib/company";
import { SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "Vendor Registration",
  description:
    "Suppliers and vendors: propose your material offering to SRIYAAN METALS' purchase team.",
  alternates: { canonical: `${SITE_URL}/vendor` },
};

export default async function VendorPage() {
  const company = await getCompanyInfo();

  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="vendor-heading">
      <Container>
        <Breadcrumbs
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "Vendor registration" }]}
        />
        <div className="grid grid-cols-4 gap-8 md:grid-cols-12">
          <div className="col-span-4 md:col-span-5">
            <SectionHeading
              id="vendor-heading"
              code="SM–V"
              eyebrow="For suppliers"
              title="Propose your material"
              lede="Tell our purchase team what you supply. Requests are reviewed during working hours."
              align="start"
              as="h1"
            />
            <p className="text-mono-meta mt-10 border-t border-edge pt-8 text-surface-muted">
              PURCHASE DESK —{" "}
              <a href={company.emails[2].href} className="text-ink hover:text-accent">
                {company.emails[2].value}
              </a>
            </p>
          </div>
          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <VendorForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
