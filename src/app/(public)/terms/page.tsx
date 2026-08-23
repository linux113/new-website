import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { Container, Section, SectionHeading } from "@/components/ui";
import { SITE_NAME, SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using the SRIYAAN METALS website and submitting a contact, enquiry or vendor form.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="terms-heading">
      <Container>
        <Breadcrumbs
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]}
        />
        <SectionHeading
          id="terms-heading"
          code="SM–TU"
          eyebrow="Legal"
          title="Terms of Use"
          lede={`These terms cover this website and the forms on it. They are not a supply contract.`}
          as="h1"
        />

        <div className="text-body text-surface-muted mt-16 flex max-w-measure flex-col gap-10">
          <section>
            <h2 className="text-heading-sm text-surface-fg">The website</h2>
            <p className="mt-3">
              {SITE_NAME} publishes this site to describe the business and to
              receive enquiries. Catalogue entries, images and copy may be
              updated or withdrawn without notice. Nothing on the site is an
              offer, a quotation, or a representation that a grade, quantity
              or delivery date is available until we confirm it in writing.
            </p>
          </section>

          <section>
            <h2 className="text-heading-sm text-surface-fg">Forms</h2>
            <p className="mt-3">
              The contact, enquiry and vendor forms collect only the fields
              shown on those pages (name, company, email, phone, WhatsApp,
              message, and — where present — subject, quantity, product,
              offering and website). Sending a form asks us to consider the
              request. It does not create an order, a price or a supply
              obligation.
            </p>
          </section>

          <section>
            <h2 className="text-heading-sm text-surface-fg">Accuracy</h2>
            <p className="mt-3">
              Please submit information that is yours to give and that is
              accurate enough for us to reply. Do not use the forms to send
              unlawful content or to probe the site.
            </p>
          </section>

          <section>
            <h2 className="text-heading-sm text-surface-fg">Contact</h2>
            <p className="mt-3">
              Questions about these terms can be sent through the{" "}
              <a href="/contact" className="text-surface-fg underline-offset-2 hover:text-accent hover:underline">
                contact page
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
