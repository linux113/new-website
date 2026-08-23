import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { Container, Section, SectionHeading } from "@/components/ui";
import { SITE_NAME, SITE_URL } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SRIYAAN METALS handles the information you submit through the website contact, enquiry and vendor forms.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <Section rhythm="default" className="pt-32 lg:pt-44" aria-labelledby="privacy-heading">
      <Container>
        <Breadcrumbs
          className="mb-10"
          items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        />
        <SectionHeading
          id="privacy-heading"
          code="SM–PV"
          eyebrow="Legal"
          title="Privacy Policy"
          lede={`${SITE_NAME} collects only the information you type into the public forms on this website, so we can read it and reply.`}
          as="h1"
        />

        <div className="text-body text-surface-muted mt-16 flex max-w-measure flex-col gap-10">
          <section>
            <h2 className="text-heading-sm text-surface-fg">What we collect</h2>
            <p className="mt-3">
              We do not run advertising pixels, analytics products or marketing
              cookies on this site. The only personal data we take is what you
              choose to send through a form:
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <strong className="text-surface-fg">Contact</strong> — name,
                email and message; optionally company, phone and subject.
              </li>
              <li>
                <strong className="text-surface-fg">Product enquiry</strong> —
                name, email and message; optionally company, phone, WhatsApp,
                quantity / requirement, and the product you were viewing.
              </li>
              <li>
                <strong className="text-surface-fg">Vendor registration</strong> —
                contact name, company, email and what you supply; optionally
                phone, WhatsApp, website and additional information.
              </li>
            </ul>
            <p className="mt-4">
              A hidden “honeypot” field is present on each form to deter bots.
              If it is filled we discard the submission and store nothing.
              We also read the connecting IP address in memory for a short
              window so we can limit repeated submissions; that address is
              not written to the database.
            </p>
          </section>

          <section>
            <h2 className="text-heading-sm text-surface-fg">How we use it</h2>
            <p className="mt-3">
              Submissions are stored so our team can review them, and used
              only to respond. We send an internal notification to our desk
              and, for contact and enquiry forms, an acknowledgement to the
              email address you provided. We do not sell this information or
              use it for marketing lists.
            </p>
          </section>

          <section>
            <h2 className="text-heading-sm text-surface-fg">Cookies</h2>
            <p className="mt-3">
              The public website does not set tracking cookies. A session
              cookie is used only on the staff administration area after
              login; visitors who never open that area are not given one.
            </p>
          </section>

          <section>
            <h2 className="text-heading-sm text-surface-fg">Questions</h2>
            <p className="mt-3">
              To ask about a submission or to request that we delete it,
              write to us from the{" "}
              <a href="/contact" className="text-surface-fg underline-offset-2 hover:text-accent hover:underline">
                contact page
              </a>{" "}
              or use the phone numbers listed there.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
