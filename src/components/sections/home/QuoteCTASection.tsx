import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/motion";
import { ButtonLink, Container, Icon, Section } from "@/components/ui";
import { CONTACT } from "@/content/site";

/**
 * SM–14 / QUOTE CTA — the strongest conversion moment on the page.
 * Dark Carbon band: oversized display statement, primary GET A QUOTE
 * → /contact (future enquiry route), secondary WhatsApp pathway on
 * the verified numbers, direct phone/email lines beneath.
 */
export function QuoteCTASection() {
  const whatsapp = CONTACT.whatsapp[0];

  return (
    <Section surface="dark" rule aria-labelledby="home-quote" rhythm="hero">
      <Container>
        <div className="grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8">
          <div className="col-span-4 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">
            <Reveal>
              <p className="text-mono-meta text-accent-ondark">
                SM–14 / Enquiry
              </p>
              <h2
                id="home-quote"
                className="text-display-xl mt-6 text-balance"
              >
                Send the specification.
                <br />
                We take it from there.
              </h2>
              <p className="text-body-lg text-surface-muted max-w-measure mt-6">
                Share your requirement — material, quantity, delivery point —
                and receive a considered response during working hours,
                {" "}{CONTACT.hours} IST.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <ButtonLink href="/contact" variant="primary" size="lg" arrow>
                  Get a Quote
                </ButtonLink>
                <ButtonLink
                  href={whatsapp.href}
                  variant="secondaryDark"
                  size="lg"
                  external
                >
                  <Icon icon={MessageCircle} size={20} />
                  WhatsApp Enquiry
                </ButtonLink>
              </div>

              {/* Direct lines — verified contact data */}
              <div className="mt-12 flex flex-col gap-2 border-t border-edge pt-8 sm:flex-row sm:flex-wrap sm:gap-x-10">
                {CONTACT.phones.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="text-mono-meta text-surface-muted transition-colors duration-(--duration-fast) hover:text-paper"
                  >
                    TEL {phone.value}
                  </a>
                ))}
                <a
                  href={CONTACT.emails[1].href}
                  className="text-mono-meta text-surface-muted transition-colors duration-(--duration-fast) hover:text-paper"
                >
                  {CONTACT.emails[1].value.toUpperCase()}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
