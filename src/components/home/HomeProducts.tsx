import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

const CATEGORIES = [
  { index: "01", name: "Bolts, Studs & Screws", desc: "Hex bolts, hex screws, stud bolts & threaded rods", href: "/products/bolts-studs-screws" },
  { index: "02", name: "Nuts", desc: "Hex, slotted, break, coupling & thin nuts", href: "/products/nuts-washers" },
  { index: "03", name: "Washers", desc: "Stainless steel & carbon steel plain washers", href: "/products/nuts-washers" },
  { index: "04", name: "Anchors & Foundation Bolts", desc: "Anchor bolts & J-type foundation bolts", href: "/products/anchor-foundation-bolts" },
  { index: "05", name: "Rivets & Inserts", desc: "Rivet nuts, threaded inserts & blind rivets", href: "/products/rivets-inserts" },
  { index: "06", name: "Pipe Fittings", desc: "Butt-weld, socket-weld & threaded fittings", href: "/products/pipe-fittings" },
  { index: "07", name: "Pipe Flanges", desc: "Forged flanges to ASTM, DIN & JIS", href: "/products/pipe-flanges" },
  { index: "08", name: "Carbon Steel Pipes", desc: "Dimensions per ASTM ANSI B36.10", href: "/products/carbon-steel-pipes" },
];

/**
 * Premium B2B products section — clean numbered rows with
 * minimal iconography, strong typography and a CTA.
 */
export function HomeProducts() {
  return (
    <section
      aria-labelledby="home-products-title"
      className="border-t border-white/10 bg-[#05080B] py-20 lg:py-28"
    >
      <Container>
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[1rem] font-semibold uppercase tracking-[0.16em] text-[#C8A45D]">
              Products
            </p>
            <h2
              id="home-products-title"
              className="mt-4 max-w-2xl font-display text-[clamp(1.9rem,3.4vw,3.2rem)] font-semibold leading-[1.05] tracking-tight text-[#F5F7F8]"
            >
              Materials built for demanding applications.
            </h2>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 self-start font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#E5C074] transition-colors hover:text-[#F0C66D] md:self-auto"
          >
            All Products
            <ArrowRight size={14} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <ul className="mt-12 border-t border-white/10">
          {CATEGORIES.map((c, i) => (
            <Reveal as="li" key={c.index} delay={i * 70}>
              <Link
                href={c.href}
                className="group flex items-center gap-5 border-b border-white/10 py-5 transition-colors duration-300 hover:bg-white/[0.025] sm:gap-8"
              >
                <span className="w-10 shrink-0 font-mono text-sm tabular-nums text-[#727D86] transition-colors duration-300 group-hover:text-[#C8A45D]">
                  {c.index}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.35rem] font-medium text-[#F5F7F8] transition-colors duration-300 group-hover:text-white sm:text-[1.5rem]">
                    {c.name}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-[#727D86]">
                    {c.desc}
                  </span>
                </span>
                <ArrowRight
                  size={18}
                  strokeWidth={1.6}
                  className="shrink-0 text-[#727D86] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#C8A45D] group-hover:opacity-100"
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
