import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getCompanyInfo } from "@/lib/company";

/**
 * Office / location (04). Technical block with a vertical champagne
 * accent line, the verified registered address, GSTIN and working
 * hours, and a "Get directions" deep link (without hardcoded coords).
 */
export async function OfficeLocation() {
  const company = await getCompanyInfo();
  const addressQuery = encodeURIComponent(
    ["SRIYAAN METALS", ...company.addressLines].join(", "),
  );
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;

  return (
    <section
      aria-labelledby="office-title"
      className="border-t border-white/10 bg-[#080A0B] py-20 lg:py-32"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#B89A62]">
                Location
              </p>
              <h2
                id="office-title"
                className="mt-5 font-display text-4xl font-medium uppercase leading-[0.95] tracking-tight text-[#F5F7F8] md:text-5xl"
              >
                Visit our
                <br />
                office
              </h2>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-3 border border-white/15 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-[#F5F7F8] transition-all duration-300 hover:border-[#B89A62]/60 hover:bg-white/[0.03]"
              >
                Get Directions
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  ↗
                </span>
              </a>
            </Reveal>
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <Reveal delay={100}>
              <div className="relative border-l border-[#B89A62]/40 pl-8 md:pl-12">
                {/* Accent dot */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rotate-45 bg-[#B89A62]"
                />

                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#727D86]">
                  SRIYAAN METALS
                </p>
                <address className="mt-4 not-italic">
                  <p className="font-display text-xl leading-relaxed text-[#F5F7F8] md:text-2xl">
                    {company.addressLines.map((line, i) => (
                      <span key={line} className="block">
                        {line}
                        {i < company.addressLines.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </p>
                </address>

                <dl className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-[0.18em] text-[#727D86]">
                      GSTIN
                    </dt>
                    <dd className="mt-2 font-mono text-sm tracking-wide text-[#F5F7F8]">
                      {company.gst.replace("GSTIN: ", "")}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-[0.18em] text-[#727D86]">
                      Working Hours
                    </dt>
                    <dd className="mt-2 font-mono text-sm text-[#F5F7F8]">
                      {company.hours}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-[0.18em] text-[#727D86]">
                      Time Zone
                    </dt>
                    <dd className="mt-2 font-mono text-sm text-[#F5F7F8]">
                      IST (UTC+5:30)
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
