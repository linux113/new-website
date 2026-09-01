import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { WHATSAPP_NUMBERS, whatsappUrl } from "@/lib/whatsapp";

/**
 * WhatsApp CTA (06). A dedicated, premium area — NOT bright green.
 * Neutral champagne treatment with a subtle green signal used only on
 * the indicator dot and the arrow, keeping the page dark and technical.
 */
export function WhatsAppCTA() {
  const display = "+91 96195 61657";
  const chatUrl = whatsappUrl(
    "Hello SRIYAAN METALS, I would like to make an enquiry.",
    WHATSAPP_NUMBERS.primary,
  );

  return (
    <section
      aria-labelledby="whatsapp-title"
      className="relative overflow-hidden border-t border-white/10 bg-[#0B0D0E] py-20 lg:py-28"
    >
      {/* Subtle warm metallic wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(184,154,98,0.12), transparent 65%)" }}
      />
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 border border-white/10 p-8 md:grid-cols-12 md:p-12 lg:p-16">
            <div className="md:col-span-7">
              <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#B89A62]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400/80" />
                </span>
                Direct
              </p>
              <h2
                id="whatsapp-title"
                className="mt-5 font-display text-4xl font-medium uppercase leading-[0.95] tracking-tight text-[#F5F7F8] md:text-5xl lg:text-6xl"
              >
                Need a quick
                <br />
                response?
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#A9B2BA] md:text-base">
                Connect with our team directly on WhatsApp for fast,
                straightforward answers on stock, grades and delivery.
              </p>
            </div>

            <div className="md:col-span-5 md:justify-self-end">
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full border border-[#B89A62]/40 bg-[#101314] p-8 transition-all duration-300 hover:border-[#B89A62] hover:shadow-[0_0_0_1px_rgba(184,154,98,0.25)] md:w-auto"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#727D86]">
                  WhatsApp
                </p>
                <p className="mt-3 font-display text-3xl font-medium tracking-tight text-[#F5F7F8] md:text-4xl">
                  {display}
                </p>
                <span className="mt-6 inline-flex items-center gap-3 border-t border-white/10 pt-5 font-mono text-[12px] uppercase tracking-[0.22em] text-[#B89A62]">
                  Chat on WhatsApp
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
                  >
                    ↗
                  </span>
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
