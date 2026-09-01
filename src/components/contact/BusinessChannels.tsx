import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

/**
 * Business channels. Four editorial hairline-divided rows —
 * Sales / Purchase / Accounts / General — not a generic icon-card
 * grid. Each row expands its accent line and reveals an arrow on
 * hover/focus.
 */
const CHANNELS = [
  { label: "Sales", email: "sales@sriyaanmetals.com", note: "Quotations & orders" },
  { label: "Purchase", email: "purchase@sriyaanmetals.com", note: "Vendor & sourcing" },
  { label: "Accounts", email: "accounts@sriyaanmetals.com", note: "Billing & GST" },
  { label: "General Enquiries", email: "info@sriyaanmetals.com", note: "Everything else" },
] as const;

export function BusinessChannels() {
  return (
    <section
      aria-labelledby="channels-title"
      className="border-t border-white/10 bg-[#080A0B] py-20 lg:py-28"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#B89A62]">
                Channels
              </p>
              <h2
                id="channels-title"
                className="mt-5 font-display text-3xl font-medium uppercase leading-tight tracking-tight text-[#F5F7F8] md:text-4xl"
              >
                Direct business
                <br />
                channels
              </h2>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            <ul className="border-t border-white/10">
              {CHANNELS.map((channel, i) => (
                <Reveal as="li" key={channel.label} delay={i * 80}>
                  <a
                    href={`mailto:${channel.email}`}
                    className="group relative grid grid-cols-4 items-center gap-4 border-b border-white/10 py-7 transition-colors duration-200 hover:bg-white/[0.02] focus-visible:bg-white/[0.02] md:grid-cols-12"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-px w-0 bg-[#B89A62] transition-all duration-300 ease-out group-hover:w-20 group-focus-visible:w-20"
                    />
                    <span className="col-span-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#727D86] md:col-span-3">
                      {channel.label}
                    </span>
                    <span className="col-span-3 min-w-0 break-words font-display text-lg font-medium text-[#F5F7F8] transition-colors duration-200 group-hover:text-white md:col-span-6 md:text-xl">
                      {channel.email}
                    </span>
                    <span className="col-span-1 hidden justify-self-end font-mono text-[10px] uppercase tracking-[0.2em] text-[#727D86] md:block">
                      {channel.note}
                    </span>
                    <span
                      aria-hidden="true"
                      className="col-span-4 justify-self-start font-mono text-[#B89A62] opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:opacity-100 md:col-span-3 md:justify-self-end"
                    >
                      ↗
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
