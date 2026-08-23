import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { Container, Hairline, Section, SectionHeading } from "@/components/ui";
import { ContactForm } from "@/components/forms/ContactForm";
import { getCompanyInfo } from "@/lib/company";
import { SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact SRIYAAN METALS — Opera House, Mumbai. Phone, WhatsApp and email during working hours.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default async function ContactPage() {
  const company = await getCompanyInfo();

  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="contact-heading">
      <Container>
        <Breadcrumbs
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        />
        <div className="grid grid-cols-4 gap-8 md:grid-cols-12">
          {/* Contact info — dynamic, single source of truth */}
          <div className="col-span-4 md:col-span-5">
            <SectionHeading
              id="contact-heading"
              code="SM–CT"
              eyebrow="Contact"
              title="Speak to us directly"
              align="start"
              as="h1"
            />

            <div className="mt-10 flex flex-col gap-6">
              <div>
                <h2 className="text-mono-meta text-surface-muted">Phone / WhatsApp</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {company.phones.map((phone, i) => (
                    <li key={phone.href} className="flex flex-wrap items-baseline gap-3">
                      <a href={phone.href} className="text-body-lg text-ink hover:text-accent">
                        {phone.value}
                      </a>
                      <a
                        href={company.whatsapp[i]?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-mono-micro text-slate underline-offset-2 hover:text-accent hover:underline"
                      >
                        WHATSAPP →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <Hairline />

              <div>
                <h2 className="text-mono-meta text-surface-muted">Email</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {company.emails.map((email) => (
                    <li key={email.href} className="flex items-baseline gap-3">
                      <span className="text-mono-micro w-20 text-slate">{email.label.toUpperCase()}</span>
                      <a href={email.href} className="text-body text-ink hover:text-accent">
                        {email.value}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <Hairline />

              <div>
                <h2 className="text-mono-meta text-surface-muted">Office</h2>
                <address className="text-body text-surface-muted mt-3 not-italic">
                  {company.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <p className="text-mono-micro mt-3 text-slate">
                  HOURS {company.hours} IST · {company.gst}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <ContactForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
