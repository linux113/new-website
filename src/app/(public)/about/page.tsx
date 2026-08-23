import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { Container, Hairline, Section, SectionHeading } from "@/components/ui";
import { getCompanyInfo } from "@/lib/company";
import { SITE_URL } from "@/content/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description:
    "SRIYAAN METALS — metals trading, import and export from Opera House, Mumbai. Address, GSTIN, hours and direct contact.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default async function AboutPage() {
  const company = await getCompanyInfo();

  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="about-heading">
      <Container>
        <Breadcrumbs
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "About" }]}
        />

        <div className="grid grid-cols-4 gap-8 md:grid-cols-12">
          <div className="col-span-4 md:col-span-6">
            <SectionHeading
              id="about-heading"
              code="SM–AB"
              eyebrow="About"
              title="A Mumbai trading desk"
              lede="SRIYAAN METALS is a metals trading, import and export business operating from Opera House, Mumbai. We source, check and deliver material against the buyer's specification."
              align="start"
              as="h1"
            />
            <p className="text-body text-surface-muted max-w-measure mt-8">
              This page lists verified facts only — registered address, GSTIN,
              working hours and the numbers we answer. No invented history,
              headcount or market claims.
            </p>
          </div>

          <div className="col-span-4 md:col-span-5 md:col-start-8">
            <p className="text-mono-meta text-surface-muted">Fact file</p>
            <dl className="mt-6 flex flex-col">
              <div className="border-t border-edge py-5">
                <dt className="text-mono-micro text-surface-muted">Address</dt>
                <dd className="text-body mt-2 text-surface-fg">
                  <address className="not-italic">
                    {company.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
              <div className="border-t border-edge py-5">
                <dt className="text-mono-micro text-surface-muted">GSTIN</dt>
                <dd className="text-body mt-2 font-mono tabular-nums text-surface-fg">
                  {company.gst.replace(/^GSTIN:\s*/i, "")}
                </dd>
              </div>
              <div className="border-t border-edge py-5">
                <dt className="text-mono-micro text-surface-muted">Hours</dt>
                <dd className="text-body mt-2 text-surface-fg">
                  {company.hours} IST · Monday–Saturday
                </dd>
              </div>
              <div className="border-t border-edge py-5">
                <dt className="text-mono-micro text-surface-muted">Phones</dt>
                <dd className="mt-2 flex flex-col gap-2">
                  {company.phones.map((phone, i) => (
                    <span key={phone.href} className="flex flex-wrap items-baseline gap-3">
                      <a
                        href={phone.href}
                        className="text-body text-surface-fg transition-colors duration-(--duration-fast) hover:text-accent"
                      >
                        {phone.value}
                      </a>
                      {company.whatsapp[i] ? (
                        <a
                          href={company.whatsapp[i].href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-mono-micro text-surface-muted underline-offset-2 hover:text-accent hover:underline"
                        >
                          WhatsApp →
                        </a>
                      ) : null}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="border-y border-edge py-5">
                <dt className="text-mono-micro text-surface-muted">Email</dt>
                <dd className="mt-2 flex flex-col gap-2">
                  {company.emails.map((email) => (
                    <a
                      key={email.href}
                      href={email.href}
                      className="text-body text-surface-fg transition-colors duration-(--duration-fast) hover:text-accent"
                    >
                      <span className="text-mono-micro mr-3 text-surface-muted">
                        {email.label}
                      </span>
                      {email.value}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
            <Hairline className="mt-8" />
            <p className="text-mono-micro mt-6 text-surface-muted">
              Registered name {company.name} · {company.gst}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
