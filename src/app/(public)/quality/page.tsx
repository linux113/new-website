import type { Metadata } from "next";
import {
  Search,
  FileText,
  ClipboardCheck,
  ShieldCheck,
  Truck,
  Globe2,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout";
import { Container } from "@/components/ui";
import { SITE_URL } from "@/content/site";
import { getPublishedCertifications } from "@/lib/repositories/content";
import { QualityClient } from "@/components/quality/QualityClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Quality & Certifications — SRIYAAN METALS",
  description:
    "Every SRIYAAN METALS consignment is inspected, documented and traceable before it ships. View verified quality certifications.",
  alternates: { canonical: `${SITE_URL}/quality` },
  openGraph: {
    title: "Quality & Certifications — SRIYAAN METALS",
    description:
      "Inspection, documentation and traceability — practices run on every order, with verified certifications.",
    url: `${SITE_URL}/quality`,
    type: "website",
  },
};

const PRACTICES = [
  {
    index: "01",
    icon: Search,
    title: "Inspection",
    body: "Incoming and outgoing material checked against the order specification.",
  },
  {
    index: "02",
    icon: FileText,
    title: "Documentation",
    body: "Test certificates and compliance papers passed through to the buyer where applicable.",
  },
  {
    index: "03",
    icon: ClipboardCheck,
    title: "Traceability",
    body: "Order-to-dispatch records maintained for every consignment.",
  },
];

const TRUST = [
  { icon: ShieldCheck, title: "Quality Assured", sub: "Tested & certified materials" },
  { icon: Truck, title: "Timely Delivery", sub: "On-time, every time" },
  { icon: Globe2, title: "Global Standards", sub: "ISO & industry compliant" },
  { icon: Headphones, title: "Expert Support", sub: "Here to help you" },
];

export default async function QualityPage() {
  const dbCerts = await getPublishedCertifications().catch(() => []);

  // Map DB certifications to the card shape. DB documents render when
  // an image upload exists; otherwise each certification shows its
  // branded certificate plate (no placeholder/sample wording).
  const PLATES: Record<string, string> = {
    "ISO 9001:2015 Quality Management": "/images/certs/cert-01.svg",
    "EN 10204 3.1 & 3.2 Test Certificates": "/images/certs/cert-02.svg",
    "IBR Approval": "/images/certs/cert-03.svg",
    "NACE MR-01-75 Conformance": "/images/certs/cert-04.svg",
    "Third-Party Inspection Certificates": "/images/certs/cert-05.svg",
  };
  const fallback = [
    { id: "iso", title: "ISO 9001:2015 Quality Management" },
    { id: "en", title: "EN 10204 3.1 & 3.2 Test Certificates" },
    { id: "ibr", title: "IBR Approval" },
    { id: "nace", title: "NACE MR-01-75 Conformance" },
    { id: "tpi", title: "Third-Party Inspection Certificates" },
  ];

  const certificates = dbCerts.length
    ? dbCerts.map((c) => ({
        id: c.id,
        title: c.name,
        image:
          c.document?.publicUrl && c.document.mimeType?.startsWith("image/")
            ? c.document.publicUrl
            : PLATES[c.name] ?? "/images/certs/cert-01.svg",
        alt: `${c.name} for SRIYAAN METALS`,
        documentUrl: c.document?.publicUrl,
      }))
    : fallback.map((c) => ({
        ...c,
        image: PLATES[c.title] ?? "/images/certs/cert-01.svg",
        alt: c.title,
        documentUrl: null,
      }));

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#05080B] pb-20 pt-28 text-[#F5F7F8] lg:pt-36"
      aria-labelledby="quality-heading"
    >
      {/* Background atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "88px 88px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%,#000 20%,transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%,#000 20%,transparent 80%)",
          }}
        />
        <div
          className="absolute -right-40 top-10 h-[42rem] w-[42rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(142,161,174,0.10) 0%, transparent 70%)",
          }}
        />
      </div>

      <Container>
        <nav aria-label="Breadcrumb" className="ql-bc mb-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Quality" },
            ]}
          />
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* LEFT */}
          <section className="lg:col-span-5">
            <p className="ql-fade font-mono text-[11px] uppercase tracking-[0.3em]">
              <span className="text-[#D8A84E]">Quality</span>
            </p>

            <h1
              id="quality-heading"
              className="mt-6 font-display font-semibold leading-[1.02] tracking-[-0.025em] text-[#F5F7F8]"
            >
              <span
                className="ql-line block text-[clamp(2.5rem,5.2vw,4.5rem)]"
                style={{ animationDelay: "140ms" }}
              >
                Verified,
              </span>
              <span
                className="ql-line ql-gold relative mt-1 block text-[clamp(2.5rem,5.2vw,4.5rem)]"
                style={{ animationDelay: "260ms" }}
              >
                then shipped
                <span
                  aria-hidden
                  className="ql-rule absolute -bottom-3 left-0 h-px w-full origin-left"
                />
              </span>
            </h1>

            <p
              className="ql-fade mt-10 max-w-md text-[15px] leading-relaxed text-[#A9B2BA] sm:text-base"
              style={{ animationDelay: "420ms" }}
            >
              Practices we run on every order, and certifications that
              have been verified.
            </p>

            {/* Practices */}
            <div className="ql-fade mt-10" style={{ animationDelay: "520ms" }}>
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#A9B2BA]">
                Our Practices
              </h2>
              <ul className="mt-4 border-t border-white/10">
                {PRACTICES.map((p) => {
                  const Icon = p.icon;
                  return (
                    <li key={p.title}>
                      <button
                        type="button"
                        className="group relative flex w-full items-center gap-4 border-b border-white/10 py-5 text-left transition-colors duration-300 hover:bg-white/[0.025] focus-visible:outline-none"
                      >
                        <span
                          aria-hidden
                          className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-gradient-to-b from-[#F0C66D] to-[#B8892E] transition-transform duration-400 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100"
                        />
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-[#A9B2BA] transition-all duration-300 group-hover:border-[#D8A84E]/40 group-hover:text-[#D8A84E] group-hover:shadow-[0_0_20px_-8px_rgba(216,168,78,0.8)] group-focus-visible:border-[#D8A84E]/40 group-focus-visible:text-[#D8A84E]">
                          <Icon size={22} strokeWidth={1.5} aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline gap-3">
                            <h3 className="font-display text-[1.35rem] font-semibold tracking-tight text-[#F5F7F8] transition-colors group-hover:text-white sm:text-[1.5rem]">
                              {p.title}
                            </h3>
                            <span className="font-mono text-[15px] font-semibold tabular-nums tracking-[0.12em] text-[#D8A84E]">
                              {p.index}
                            </span>
                          </span>
                          <p className="mt-1 max-w-sm text-[13.5px] leading-relaxed text-[#A9B2BA]">
                            {p.body}
                          </p>
                        </span>
                        <ArrowRight
                          size={18}
                          strokeWidth={1.6}
                          className="shrink-0 text-[#727D86] transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#D8A84E]"
                          aria-hidden
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* RIGHT — certifications */}
          <section
            className="lg:col-span-7"
            aria-labelledby="certs-heading"
          >
            <div className="flex items-center gap-4">
              <h2
                id="certs-heading"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#F5F7F8]"
              >
                Certifications
              </h2>
              <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-[#D8A84E]/70 to-transparent" />
            </div>

            <QualityClient certificates={certificates} />
          </section>
        </div>

        {/* Trust strip */}
        <section
          aria-label="Why SRIYAAN METALS"
          className="ql-fade mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-2"
        >
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/5 lg:grid-cols-4">
            {TRUST.map((t) => {
              const Icon = t.icon;
              return (
                <li
                  key={t.title}
                  className="flex items-center gap-4 bg-[#05080B] p-5 transition-colors duration-300 hover:bg-[#0A1015]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D8A84E]/25 bg-[#D8A84E]/5 text-[#D8A84E]">
                    <Icon size={20} strokeWidth={1.5} aria-hidden />
                  </span>
                  <div>
                    <p className="font-display text-[1.15rem] font-semibold text-[#F5F7F8]">
                      {t.title}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[#727D86]">
                      {t.sub}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </Container>

      <style>{`
        @keyframes ql-fade { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:none;} }
        @keyframes ql-line { from{opacity:0;transform:translateY(26px);filter:blur(8px);} to{opacity:1;transform:none;filter:blur(0);} }
        @keyframes ql-rule { from{transform:scaleX(0);} to{transform:scaleX(1);} }
        @keyframes ql-in { from{opacity:0;transform:translateY(28px) rotateX(8deg);filter:blur(6px);} to{opacity:1;transform:none;filter:blur(0);} }
        @keyframes ql-bc { from{opacity:0;transform:translateY(-6px);} to{opacity:1;transform:none;} }
        @keyframes ql-modal { from{opacity:0;transform:scale(.96) translateY(10px);} to{opacity:1;transform:none;} }
        .ql-bc { animation: ql-bc .6s cubic-bezier(0.22,1,0.36,1) both; }
        .ql-fade { animation: ql-fade .7s cubic-bezier(0.22,1,0.36,1) both; }
        .ql-line { animation: ql-line .9s cubic-bezier(0.22,1,0.36,1) both; }
        .ql-gold { background:linear-gradient(90deg,#F0C66D,#D8A84E 55%,#B8892E); -webkit-background-clip:text; background-clip:text; color:transparent; text-shadow:0 0 26px rgba(216,168,78,.28); transition:filter .4s ease,text-shadow .4s ease; }
        .ql-gold:hover { filter:brightness(1.08); text-shadow:0 0 34px rgba(240,198,109,.55); }
        .ql-rule { background:linear-gradient(90deg,#D8A84E,transparent); animation: ql-rule .9s cubic-bezier(0.65,0,0.35,1) .9s both; }
        @media (prefers-reduced-motion: reduce){ .ql-bc,.ql-fade,.ql-line,.ql-rule,.ql-card-wrap{animation:none!important;opacity:1!important;transform:none!important;filter:none!important;} }
      `}</style>
    </main>
  );
}
