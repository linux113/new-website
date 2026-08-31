import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { ContactEnquiryForm } from "./ContactEnquiryForm";

/**
 * Enquiry form section (02). Asymmetric two-column: editorial heading
 * on the left, the premium form on the right. The form is a client
 * component wired to the secure server action.
 */
export function EnquirySection() {
  return (
    <section
      aria-labelledby="enquiry-heading"
      className="relative border-t border-white/10 bg-[#080A0B] py-20 lg:py-32"
    >
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4 lg:col-span-4">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#B89A62]">
                <span className="text-[#727D86]">02 —</span> Enquiry
              </p>
              <h2
                id="enquiry-heading"
                className="mt-5 font-display text-4xl font-medium uppercase leading-[0.95] tracking-tight text-[#F5F7F8] md:text-5xl lg:text-6xl"
              >
                Send an
                <br />
                enquiry
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#A9B2BA]">
                Tell us what you are looking for. Our team will get back
                to you during working hours — with a considered response,
                not an automated reply.
              </p>
              <div className="mt-10 space-y-3 border-t border-white/10 pt-8 font-mono text-xs tracking-[0.12em] text-[#727D86]">
                <p className="flex justify-between gap-4">
                  <span>Response time</span>
                  <span className="text-[#A9B2BA]">≤ 1 business day</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>Format</span>
                  <span className="text-[#A9B2BA]">Specification-first</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span>Handling</span>
                  <span className="text-[#A9B2BA]">Direct to sales desk</span>
                </p>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-6">
            <Reveal delay={120}>
              <div className="contact-form-frame relative">
                {/* Soft outer metallic glow */}
                <div
                  aria-hidden="true"
                  className="contact-form-glow pointer-events-none absolute -inset-px"
                />
                {/* Animated gradient hairline border */}
                <div
                  aria-hidden="true"
                  className="contact-form-border pointer-events-none absolute -inset-px"
                />
                {/* Corner accents */}
                <span aria-hidden="true" className="contact-corner contact-corner-tl" />
                <span aria-hidden="true" className="contact-corner contact-corner-tr" />
                <span aria-hidden="true" className="contact-corner contact-corner-bl" />
                <span aria-hidden="true" className="contact-corner contact-corner-br" />

                <div className="relative bg-[#101314]/95 p-6 backdrop-blur-sm md:p-10 lg:p-12">
                  <ContactEnquiryForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
