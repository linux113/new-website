import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { Container, Section, SectionHeading } from "@/components/ui";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getCompanyInfo } from "@/lib/company";
import { SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Send your material specification to SRIYAAN METALS — quantity, grade and delivery point — for a considered quotation.",
  alternates: { canonical: `${SITE_URL}/enquiry` },
};

export default async function EnquiryPage() {
  const company = await getCompanyInfo();

  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="enquiry-heading">
      <Container>
        <Breadcrumbs
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "Get a Quote" }]}
        />
        <div className="grid grid-cols-4 gap-8 md:grid-cols-12">
          <div className="col-span-4 md:col-span-5">
            <SectionHeading
              id="enquiry-heading"
              code="SM–RFQ"
              eyebrow="Enquiry"
              title="Send the specification"
              lede={`Material, quantity, delivery point — our sales team responds during working hours, ${company.hours} IST.`}
              align="start"
              as="h1"
            />
            <dl className="mt-10 flex flex-col gap-4 border-t border-edge pt-8">
              {company.phones.map((phone) => (
                <div key={phone.href} className="flex items-baseline gap-4">
                  <dt className="text-mono-micro w-20 text-surface-muted">PHONE</dt>
                  <dd>
                    <a href={phone.href} className="text-body text-ink hover:text-accent">
                      {phone.value}
                    </a>
                  </dd>
                </div>
              ))}
              <div className="flex items-baseline gap-4">
                <dt className="text-mono-micro w-20 text-surface-muted">EMAIL</dt>
                <dd>
                  <a href={company.emails[1].href} className="text-body text-ink hover:text-accent">
                    {company.emails[1].value}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <EnquiryForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
