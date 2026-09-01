"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  BadgeCheck,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Eye,
  Lock,
  Headphones,
  Users,
  FileText,
  Truck,
  Handshake,
  ArrowUpRight,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

interface AboutClientProps {
  company: {
    name: string;
    addressLines: string[];
    gst: string;
    hours: string;
    phones: { label: string; value: string; href: string }[];
    whatsapp: { href: string }[];
    emails: { label: string; value: string; href: string }[];
  };
}

const TRUST = [
  { icon: ShieldCheck, title: "Verified", sub: "Accurate & verifiable business details" },
  { icon: Eye, title: "Transparent", sub: "Clear communication & timelines" },
  { icon: Lock, title: "Secure", sub: "Professional and secure business practices" },
  { icon: Headphones, title: "Responsive", sub: "Quick replies on what matters" },
];

const VALUE = [
  { icon: Users, title: "Compliant & Professional", sub: "We follow Indian laws and best practices" },
  { icon: FileText, title: "Document-Driven", sub: "Transactions backed by proper documentation" },
  { icon: Truck, title: "On-Time Delivery", sub: "Reliable logistics & delivery partners" },
  { icon: Handshake, title: "Long-Term Partnerships", sub: "Built on trust, quality & transparency" },
];

export function AboutClient({ company }: AboutClientProps) {
  const [activeTrust, setActiveTrust] = useState<number | null>(null);
  const gst = company.gst.replace(/^GSTIN:\s*/i, "");

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
        {/* LEFT */}
        <div className="lg:col-span-6 xl:col-span-5">
          <p
            className="ab-fade font-mono text-xs uppercase tracking-[0.3em] text-[#D8A84E]"
            style={{ animationDelay: "60ms" }}
          >
            About {company.name}
          </p>

          <h1
            id="about-heading"
            className="ab-line mt-6 font-display text-[clamp(2.5rem,5.2vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-[#F5F7F8]"
            style={{ animationDelay: "160ms" }}
          >
            A Mumbai
            <br />
            <span className="ab-gold">Trading Desk</span>
          </h1>

          <p
            className="ab-fade mt-7 max-w-lg text-[15px] leading-relaxed text-[#A9B2BA] sm:text-base"
            style={{ animationDelay: "380ms" }}
          >
            {company.name} is a metals trading, import and export business
            operating from Opera House, Mumbai. We source, check and deliver
            material against the buyer&apos;s specification — a B2B metal
            supply, metal sourcing and metal trading and procurement partner
            for industrial buyers.
          </p>

          {/* Verification card */}
          <div
            className="ab-fade mt-8 flex items-start gap-4 rounded-2xl border border-[#D8A84E]/25 bg-gradient-to-br from-[#0A1015] to-[#05080B] p-5 shadow-[0_20px_60px_-40px_rgba(216,168,78,0.6)] sm:p-6"
            style={{ animationDelay: "500ms" }}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D8A84E]/30 bg-[#D8A84E]/10 text-[#F0C66D]">
              <BadgeCheck size={22} strokeWidth={1.6} aria-hidden />
            </span>
            <div>
              <p className="font-display text-[15px] font-semibold text-[#F5F7F8]">
                Verified business information
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#A9B2BA]">
                This page lists verified facts only — registered address,
                GSTIN, working hours and the numbers we answer. No invented
                history, headcount or market claims.
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <ul
            className="ab-fade mt-10 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4"
            style={{ animationDelay: "620ms" }}
          >
            {TRUST.map((t, i) => {
              const Icon = t.icon;
              const active = activeTrust === i;
              return (
                <li
                  key={t.title}
                  onMouseEnter={() => setActiveTrust(i)}
                  onMouseLeave={() => setActiveTrust(null)}
                  className="group flex flex-col items-center text-center sm:items-start sm:text-left"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 ${
                      active
                        ? "border-[#D8A84E] bg-[#D8A84E]/10 text-[#F0C66D] shadow-[0_0_24px_-8px_rgba(216,168,78,0.9)]"
                        : "border-white/12 bg-white/[0.02] text-[#D8A84E]"
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.5} aria-hidden />
                  </span>
                  <p className="mt-3 font-display text-sm font-semibold text-[#F5F7F8]">
                    {t.title}
                  </p>
                  <p className="mt-1 text-[12px] leading-snug text-[#727D86]">
                    {t.sub}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT — FACT FILE */}
        <aside
          className="ab-card relative lg:col-span-6 xl:col-span-6 xl:col-start-7"
          aria-labelledby="fact-file-heading"
        >
          {/* Ambient gold + world dot grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle, rgba(216,168,78,0.16), transparent 65%)",
            }}
          />
          <div
            aria-hidden
            className="ab-dots pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.15]"
          />

          <div className="relative rounded-2xl border border-white/[0.07] bg-[#0A1015]/50 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D8A84E]/25 bg-[#D8A84E]/10 text-[#F0C66D]">
                <FileText size={18} strokeWidth={1.6} aria-hidden />
              </span>
              <h2
                id="fact-file-heading"
                className="font-mono text-xs uppercase tracking-[0.22em] text-[#F5F7F8]"
              >
                Fact File
              </h2>
            </div>

            <dl className="mt-6 divide-y divide-white/8">
              {/* Address + GSTIN */}
              <div className="grid grid-cols-1 gap-6 py-5 sm:grid-cols-2">
                <div className="flex gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-[#D8A84E]" aria-hidden />
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-[0.18em] text-[#727D86]">
                      Address
                    </dt>
                    <dd className="mt-1.5 text-[14px] leading-relaxed text-[#F5F7F8]">
                      <address className="not-italic">
                        {company.addressLines.map((l) => (
                          <span key={l} className="block">{l}</span>
                        ))}
                      </address>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <BadgeCheck size={18} className="mt-0.5 shrink-0 text-[#D8A84E]" aria-hidden />
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-[0.18em] text-[#727D86]">
                      GSTIN
                    </dt>
                    <dd className="mt-1.5 font-mono text-[14px] tracking-wide text-[#F5F7F8]">
                      {gst}
                    </dd>
                  </div>
                </div>
              </div>

              {/* Hours + phones */}
              <div className="grid grid-cols-1 gap-6 py-5 sm:grid-cols-2">
                <div className="flex gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-[#D8A84E]" aria-hidden />
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-[0.18em] text-[#727D86]">
                      Hours
                    </dt>
                    <dd className="mt-1.5 text-[14px] text-[#F5F7F8]">
                      {company.hours} IST
                      <span className="block text-[12.5px] text-[#727D86]">
                        Monday – Saturday
                      </span>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-[#D8A84E]" aria-hidden />
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-[0.18em] text-[#727D86]">
                      Phones
                    </dt>
                    <dd className="mt-1.5 flex flex-col gap-1.5">
                      {company.phones.map((p, i) => (
                        <span key={p.href} className="flex flex-wrap items-baseline gap-2">
                          <a
                            href={p.href}
                            className="text-[14px] text-[#F5F7F8] transition-colors hover:text-[#F0C66D]"
                          >
                            {p.value}
                          </a>
                          {company.whatsapp[i] ? (
                            <a
                              href={company.whatsapp[i].href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[1rem] font-semibold uppercase tracking-[0.14em] text-[#D8A84E] transition-colors hover:text-[#F0C66D]"
                            >
                              <MessageCircle size={11} /> WhatsApp
                              <ArrowUpRight size={10} />
                            </a>
                          ) : null}
                        </span>
                      ))}
                    </dd>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="py-5">
                <div className="flex gap-3">
                  <Mail size={18} className="mt-0.5 shrink-0 text-[#D8A84E]" aria-hidden />
                  <div className="w-full">
                    <dt className="font-mono text-xs uppercase tracking-[0.18em] text-[#727D86]">
                      Email
                    </dt>
                    <dd className="mt-2 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                      {company.emails.map((e) => (
                        <div key={e.href} className="flex items-baseline gap-3">
                          <span className="w-20 shrink-0 text-[13px] text-[#A9B2BA]">
                            {e.label}
                          </span>
                          <a
                            href={e.href}
                            className="min-w-0 break-all text-[14px] text-[#F0C66D] transition-colors hover:text-[#FBE7A8]"
                          >
                            {e.value}
                          </a>
                        </div>
                      ))}
                    </dd>
                  </div>
                </div>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/8 pt-5 font-mono text-xs tracking-[0.04em] text-[#727D86]">
              <span>Registered name: <span className="text-[#A9B2BA]">{company.name}</span></span>
              <span aria-hidden className="hidden sm:inline">|</span>
              <span>GSTIN: <span className="text-[#A9B2BA]">{gst}</span></span>
            </div>
          </div>
        </aside>
      </section>

      {/* ===================== VALUE STRIP ===================== */}
      <section aria-labelledby="why-heading" className="mt-16 lg:mt-24">
        <h2 id="why-heading" className="sr-only">
          Why work with us
        </h2>
        <ul
          className="ab-fade grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUE.map((v) => {
            const Icon = v.icon;
            return (
              <li
                key={v.title}
                className="group flex items-start gap-4 bg-[#05080B] p-5 transition-colors duration-300 hover:bg-[#0A1015] sm:p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D8A84E]/25 bg-[#D8A84E]/5 text-[#D8A84E] transition-all duration-300 group-hover:border-[#D8A84E]/50 group-hover:shadow-[0_0_22px_-8px_rgba(216,168,78,0.8)]">
                  <Icon size={20} strokeWidth={1.5} aria-hidden />
                </span>
                <div>
                  <p className="font-display text-[15px] font-semibold text-[#F5F7F8]">
                    {v.title}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#727D86]">
                    {v.sub}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="ab-fade mt-8 flex w-full max-w-3xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <p className="max-w-xl text-[14px] leading-relaxed text-[#A9B2BA]">
            Ready to discuss a requirement? Reach the Mumbai trading desk
            directly for metal import and export, metal sourcing and B2B
            metal supply.
          </p>
          <Link
            href="/contact"
            className="group inline-flex h-13 shrink-0 items-center gap-2 rounded-lg border border-[#D8A84E]/50 bg-[#D8A84E]/10 px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[#F0C66D] transition-all duration-300 hover:border-[#D8A84E] hover:bg-[#D8A84E] hover:text-[#05080B] hover:shadow-[0_10px_36px_-12px_rgba(216,168,78,0.9)]"
          >
            Get in Touch
            <ArrowRight
              size={15}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes ab-fade { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:none;} }
        @keyframes ab-line { from{opacity:0;transform:translateY(26px);filter:blur(8px);} to{opacity:1;transform:none;filter:blur(0);} }
        @keyframes ab-sheen { 0%{background-position:0% 50%;} 100%{background-position:200% 50%;} }
        @keyframes ab-drift { 0%{transform:translate3d(0,0,0);} 50%{transform:translate3d(-12px,-8px,0);} 100%{transform:translate3d(0,0,0);} }
        .ab-fade { animation: ab-fade .7s cubic-bezier(0.22,1,0.36,1) both; }
        .ab-line { animation: ab-line .9s cubic-bezier(0.22,1,0.36,1) both; }
        .ab-gold {
          background: linear-gradient(90deg,#F0C66D,#D8A84E 45%,#B8892E, #F0C66D);
          background-size: 200% 100%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          text-shadow: 0 0 26px rgba(216,168,78,.25);
          animation: ab-sheen 6s linear infinite;
        }
        .ab-card::before {
          content:""; position:absolute; inset:-1px; border-radius:1rem; padding:1px;
          background: linear-gradient(135deg, rgba(216,168,78,.5), rgba(255,255,255,.06) 40%, transparent 60%, rgba(216,168,78,.35));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events:none;
        }
        .ab-dots {
          background-image: radial-gradient(rgba(216,168,78,.35) 1px, transparent 1px);
          background-size: 18px 18px;
          mask-image: radial-gradient(ellipse 60% 70% at 85% 20%, #000 0%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse 60% 70% at 85% 20%, #000 0%, transparent 70%);
          animation: ab-drift 18s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce){
          .ab-fade,.ab-line,.ab-dots,.ab-gold{animation:none!important;opacity:1!important;transform:none!important;filter:none!important;}
        }
      `}</style>
    </>
  );
}
