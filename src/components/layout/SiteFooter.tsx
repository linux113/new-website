import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui";
import { SITE_NAME } from "@/content/site";
import { getCompanyInfo } from "@/lib/company";
import { FooterSocials } from "./FooterSocials";

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Manufacturing", href: "/manufacturing" },
  { label: "Quality", href: "/quality" },
  { label: "Industries", href: "/industries" },
  { label: "Global Reach", href: "/global-reach" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const PRODUCT_LINKS = [
  { label: "Bolts, Studs & Screws", href: "/products" },
  { label: "Nuts & Washers", href: "/products" },
  { label: "Anchors & Foundation Bolts", href: "/products" },
  { label: "Rivets & Inserts", href: "/products" },
  { label: "Pipe Fittings & Flanges", href: "/products" },
  { label: "All Products", href: "/products" },
];

const BOTTOM_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

const TRUST = [
  { title: "Verified & Compliant", sub: "GSTIN & business verified" },
  { title: "Reliable Supply", sub: "On-time, every time" },
  { title: "Global Network", sub: "Trusted global partners" },
];

/**
 * Premium B2B footer (server component).
 * Four columns: company, company links, products, contact — plus a
 * quote/CTA panel, 3D social icons and a bottom legal bar. All
 * contact data flows from getCompanyInfo() (admin-editable).
 */
export async function SiteFooter() {
  const company = await getCompanyInfo();
  const year = new Date().getFullYear();
  const gst = company.gst.replace(/^GSTIN:\s*/i, "");

  return (
    <footer
      data-surface="dark"
      className="relative overflow-hidden border-t border-white/10 bg-[#05080B] text-[#F5F7F8]"
    >
      {/* Faint grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%,#000 20%,transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-32 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(200,164,93,0.10), transparent 70%)",
        }}
      />

      <Container className="relative py-16 lg:py-20">
        {/* ---- CTA panel ---- */}
        <div className="ft-reveal rounded-2xl border border-white/10 bg-gradient-to-r from-[#0A1015] to-[#070B0F] p-6 shadow-[0_20px_60px_-40px_rgba(200,164,93,0.5)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#C8A45D]/30 bg-[#C8A45D]/10 text-[#E5C074]">
                <ClipboardIcon />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-[#F5F7F8] sm:text-xl">
                  Need a custom material or bulk requirement?
                </h2>
                <p className="mt-1 max-w-xl text-[13.5px] leading-relaxed text-[#A9B2BA]">
                  Share your specification and our team will help you find
                  the right sourcing solution.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link
                href="/enquiry"
                className="group inline-flex items-center gap-2 shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#E5C074] transition-colors hover:text-[#F0C66D]"
              >
                Get a Quote
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                {TRUST.map((t) => (
                  <li key={t.title} className="flex items-center gap-2">
                    <CheckGlyph />
                    <span className="whitespace-nowrap">
                      <span className="block text-[12.5px] font-medium text-[#F5F7F8]">
                        {t.title}
                      </span>
                      <span className="block text-xs text-[#727D86]">
                        {t.sub}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ---- Four columns ---- */}
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12 md:gap-x-8">
          {/* Company */}
          <div className="ft-reveal col-span-2 md:col-span-3">
            <Link href="/" className="flex items-center gap-3" aria-label={`${SITE_NAME} home`}>
              <Image
                src="/brand/logo-white-gold.png"
                alt="SRIYAAN METALS"
                width={158}
                height={42}
                className="logo-dark h-[42px] w-auto"
              />
              <Image
                src="/brand/logo-original.png"
                alt="SRIYAAN METALS"
                width={158}
                height={42}
                className="logo-light h-[42px] w-auto"
              />
            </Link>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-[#C8A45D]">
              Trading • Import • Export
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {[
                { label: "Full Catalogue (PDF)", href: "/catalogue/sriyaan-metals-catalog.pdf" },
                { label: "Carbon Steel Pipes (PDF)", href: "/catalogue/carbon-steel-pipes.pdf" },
              ].map((c) => (
                <li key={c.href}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-[13px] text-[#A9B2BA] transition-colors duration-200 hover:text-[#F5F7F8]"
                  >
                    <span aria-hidden className="text-[#C8A45D]">↓</span>
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-[#A9B2BA]">
              {company.content["content.footer.description"]?.trim() ||
                "Mumbai-based metals trading, import & export company providing reliable industrial material solutions across India and global markets."}
            </p>
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-[#727D86]">
              GSTIN: <span className="text-[#C8A45D]">{gst}</span>
            </p>
          </div>

          {/* Company links */}
          <nav
            aria-label="Company"
            className="ft-reveal col-span-1 md:col-span-3"
          >
            <FooterHeading>Company</FooterHeading>
            <ul className="mt-5 flex flex-col gap-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[13.5px] text-[#A9B2BA] transition-colors duration-200 hover:text-[#F5F7F8]"
                  >
                    <span
                      aria-hidden
                      className="text-[#C8A45D] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      ›
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Products */}
          <nav
            aria-label="Products"
            className="ft-reveal col-span-1 md:col-span-3"
          >
            <FooterHeading>Products</FooterHeading>
            <ul className="mt-5 flex flex-col gap-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[13.5px] text-[#A9B2BA] transition-colors duration-200 hover:text-[#F5F7F8]"
                  >
                    <span
                      aria-hidden
                      className="text-[#C8A45D] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      ›
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="ft-reveal col-span-2 md:col-span-3">
            <FooterHeading>Contact</FooterHeading>
            <ul className="mt-5 flex flex-col gap-3.5 text-[13.5px]">
              {company.phones.map((phone, i) => (
                <li key={phone.href} className="flex items-baseline gap-3">
                  <PhoneGlyph />
                  <a
                    href={phone.href}
                    className="text-[#F5F7F8] transition-colors hover:text-[#E5C074]"
                  >
                    {phone.value}
                  </a>
                  {company.whatsapp[i] ? (
                    <a
                      href={company.whatsapp[i].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[1rem] font-semibold uppercase tracking-[0.14em] text-[#C8A45D] hover:text-[#E5C074]"
                    >
                      WhatsApp
                    </a>
                  ) : null}
                </li>
              ))}
              {company.emails.slice(0, 2).map((email) => (
                <li key={email.href} className="flex items-baseline gap-3">
                  <MailGlyph />
                  <a
                    href={email.href}
                    className="transition-colors hover:text-[#E5C074]"
                  >
                    <span className="text-[#F5F7F8]">{email.value}</span>
                  </a>
                </li>
              ))}
              <li className="flex items-baseline gap-3">
                <MailGlyph />
                <Link
                  href="/contact"
                  className="font-mono text-xs uppercase tracking-[0.14em] text-[#C8A45D] transition-colors hover:text-[#E5C074]"
                >
                  All contact channels →
                </Link>
              </li>
              <li className="flex items-baseline gap-3 pt-1">
                <ClockGlyph />
                <span className="text-[#A9B2BA]">
                  {company.hours} IST
                  <span className="block text-[#727D86]">
                    Monday – Saturday
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="mt-14 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex items-center gap-4">
                <FooterSocials links={company.social} />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#727D86]">
                  Follow Us
                </span>
                <span aria-hidden className="hidden h-4 w-px bg-white/15 sm:block" />
              </div>
              <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {BOTTOM_LINKS.map((link, i) => (
                  <span key={link.label} className="flex items-center gap-5">
                    <Link
                      href={link.href}
                      className="text-[12.5px] text-[#A9B2BA] transition-colors hover:text-[#F5F7F8]"
                    >
                      {link.label}
                    </Link>
                    {i < BOTTOM_LINKS.length - 1 ? (
                      <span aria-hidden className="hidden h-3 w-px bg-white/15 sm:block" />
                    ) : null}
                  </span>
                ))}
              </nav>
            </div>

            <p className="font-mono text-xs tracking-wide text-[#727D86]">
              © {year} {SITE_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>

      <style>{`
        @keyframes ft-up { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:none;} }
        .ft-reveal { animation: ft-up .7s cubic-bezier(0.22,1,0.36,1) both; }
        .ft-reveal:nth-child(2){ animation-delay:.08s; }
        .ft-reveal:nth-child(3){ animation-delay:.16s; }
        .ft-reveal:nth-child(4){ animation-delay:.24s; }
        @media (prefers-reduced-motion: reduce){ .ft-reveal{animation:none!important;opacity:1!important;transform:none!important;} }
      `}</style>
    </footer>
  );
}

/* ---------------- small presentational bits ---------------- */

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="relative inline-block font-mono text-[1rem] font-semibold uppercase tracking-[0.16em] text-[#C8A45D]">
      {children}
      <span
        aria-hidden
        className="absolute -bottom-2 left-0 h-px w-8 bg-gradient-to-r from-[#C8A45D] to-transparent"
      />
    </h2>
  );
}

function CheckGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C8A45D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function PhoneGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A45D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
function MailGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A45D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" />
    </svg>
  );
}
function ClockGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A45D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function ClipboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" />
    </svg>
  );
}
