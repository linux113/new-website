import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getCompanyInfo } from "@/lib/company";

/**
 * Map section (05). Large dark-styled map area.
 *
 * Architecture:
 *  - If NEXT_PUBLIC_GOOGLE_MAPS_EMBED is set (a Google Maps Embed URL
 *    or API-enabled src), it is rendered directly — this is where the
 *    real key/configured map plugs in.
 *  - Otherwise we fall back to a keyless Google Maps embed built from
 *    the verified address (no API key required), so the map is real
 *    and usable out of the box.
 *  - A CSS invert/hue-rotate treatment gives it a dark, minimal look
 *    consistent with the page.
 *
 * No fake coordinates are ever hardcoded — the query is always the
 * verified company address.
 */
export async function MapSection() {
  const company = await getCompanyInfo();
  const addressQuery = ["SRIYAAN METALS", ...company.addressLines].join(", ");
  const configuredSrc = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED;
  const mapSrc =
    configuredSrc && configuredSrc.trim().length > 0
      ? configuredSrc
      : `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&z=15&output=embed`;

  return (
    <section
      aria-label="Office location map"
      className="border-t border-white/10 bg-[#080A0B] py-20 lg:py-28"
    >
      <Container>
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#B89A62]">
                <span className="text-[#727D86]">05 —</span> Map
              </p>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-[#F5F7F8] md:text-4xl">
                Find us in Mumbai
              </h2>
            </div>
            <p className="max-w-xs font-mono text-xs tracking-[0.12em] text-[#727D86]">
              Opera House, Charni Road
            </p>
          </div>

          <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/10 bg-[#0B0D0E] md:aspect-[21/9]">
            {/* Corner ticks for the engineered look */}
            <span aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 border-l border-t border-[#B89A62]/50" />
            <span aria-hidden="true" className="absolute right-3 top-3 h-4 w-4 border-r border-t border-[#B89A62]/50" />
            <span aria-hidden="true" className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-[#B89A62]/50" />
            <span aria-hidden="true" className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-[#B89A62]/50" />

            <iframe
              title="SRIYAAN METALS office location"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="contact-map absolute inset-0 h-full w-full border-0 grayscale-[0.4] contrast-[1.05]"
              allow="fullscreen"
            />

            {/* Label chip */}
            <div className="pointer-events-none absolute bottom-5 left-5 border border-white/15 bg-[#080A0B]/85 px-4 py-2.5 backdrop-blur-sm">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B89A62]">
                SRIYAAN METALS
              </p>
              <p className="mt-1 max-w-[14rem] font-mono text-xs tracking-[0.06em] leading-relaxed text-[#A9B2BA]">
                Platinum Arcade, JSS Road, Opera House, Mumbai
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
