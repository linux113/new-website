import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getCompanyInfo } from "@/lib/company";

/**
 * Contact information — asymmetric technical grid (DS-aligned).
 * Left column holds the section statement; the right column is a set
 * of full-width hairline-divided information rows. Each row has a
 * grow-on-hover accent line and an arrow that fades in.
 */
export async function ContactInformation() {
  const company = await getCompanyInfo();

  const phoneRows = company.phones.map((p) => ({
    label: "Phone",
    value: p.value,
    href: p.href,
  }));
  const whatsappRows = company.whatsapp.map((w, i) => ({
    label: "WhatsApp",
    value: w.value,
    href: i === 0 ? "#whatsapp" : w.href,
  }));
  const emailRows = [
    { label: "Email", value: "info@sriyaanmetals.com", href: "mailto:info@sriyaanmetals.com" },
    { label: "Sales", value: "sales@sriyaanmetals.com", href: "mailto:sales@sriyaanmetals.com" },
    { label: "Purchase", value: "purchase@sriyaanmetals.com", href: "mailto:purchase@sriyaanmetals.com" },
    { label: "Accounts", value: "accounts@sriyaanmetals.com", href: "mailto:accounts@sriyaanmetals.com" },
  ];

  // De-duplicate phone rows by value (phones and whatsapp share numbers).
  const phoneValues = new Set(phoneRows.map((r) => r.value));
  const whatsappUnique = whatsappRows.filter((w) => !phoneValues.has(w.value));
  const rows = [...phoneRows, ...whatsappUnique, ...emailRows];

  return (
    <section
      aria-labelledby="contact-info-title"
      className="border-t border-white/10 bg-[#080A0B] py-20 lg:py-32"
    >
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Left — statement */}
          <div className="md:col-span-4 lg:col-span-4">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#B89A62]">
                Contact
              </p>
              <h2
                id="contact-info-title"
                className="mt-5 font-display text-3xl font-medium leading-tight tracking-tight text-[#F5F7F8] md:text-4xl"
              >
                Speak directly
                <br />
                with our team.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#A9B2BA]">
                For specifications, quotes, sourcing or vendor proposals,
                reach the right desk directly. We respond during working
                hours, {company.hours} IST.
              </p>
            </Reveal>
          </div>

          {/* Right — technical information rows */}
          <div className="max-w-2xl md:col-span-8 md:col-start-6 lg:col-span-7 lg:col-start-6">
            <ul className="border-t border-white/10">
              {rows.map((row, i) => (
                <Reveal as="li" key={`${row.label}-${row.value}-${i}`} delay={i * 70}>
                  <a
                    href={row.href}
                    {...(row.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group relative grid grid-cols-4 items-center gap-4 border-b border-white/10 py-6 transition-colors duration-200 hover:bg-white/[0.02] focus-visible:bg-white/[0.02] md:grid-cols-12"
                  >
                    {/* Accent line grows on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-px w-0 bg-[#B89A62] transition-all duration-300 ease-out group-hover:w-16 group-focus-visible:w-16"
                    />
                    <span className="col-span-1 font-mono text-xs uppercase tracking-[0.2em] text-[#727D86] md:col-span-3">
                      {row.label}
                    </span>
                    <span className="col-span-3 min-w-0 break-words text-[15px] font-medium leading-snug tracking-tight text-[#F5F7F8] transition-colors duration-200 group-hover:text-white md:col-span-8 md:text-lg">
                      {row.value}
                    </span>
                    <span
                      aria-hidden="true"
                      className="col-span-4 justify-self-start font-mono text-[#B89A62] opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:opacity-100 md:col-span-1 md:justify-self-end"
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
