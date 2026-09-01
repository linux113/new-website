"use client";

import Link from "next/link";
import { Clock, Phone, FileText, ShieldCheck, ArrowRight } from "lucide-react";
import { HeroVideoBackground } from "./HeroVideoBackground";

interface HeroCompany {
  hours: string;
  gst: string;
  phones: { value: string }[];
}

/**
 * Premium cinematic homepage hero.
 *
 * Structure:
 *   <section relative min-h-screen>
 *     <HeroVideoBackground absolute inset-0>  -> brand video, loops w/ end hold
 *     <relative min-h-screen flex items-end>  -> foreground content, shifted down
 *   </section>
 */
export function HomeHero({ company }: { company: HeroCompany }) {
  const gst = company.gst.replace(/^GSTIN:\s*/i, "") || "27CRKPS0693G1ZB";
  const phoneCount = company.phones?.length || 2;

  return (
    <section
      className="keep-dark relative isolate min-h-screen bg-[#05080B]"
      aria-labelledby="home-hero-title"
    >
      {/* Background — client brand video, smooth native playback */}
      <HeroVideoBackground />

      {/* Foreground — sits over the sticky canvas for the first screen */}
      <div className="relative z-10 flex min-h-screen items-end pb-14 pt-36 lg:pb-20 lg:pt-48">
        <div className="w-full">
          <div className="w-full max-w-none px-5 md:px-8 xl:px-12 2xl:px-16">
            <div className="max-w-3xl md:max-w-none xl:ml-0">

              <h1
                id="home-hero-title"
                className="hh-line mt-6 font-display text-[clamp(1.15rem,5.3vw,1.7rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-[#F5F7F8] sm:text-[clamp(2rem,5.7vw,5.75rem)]"
                style={{
                  textShadow:
                    "0 2px 30px rgba(5,8,11,0.65), 0 1px 8px rgba(5,8,11,0.55)",
                }}
              >
                {/* Two deliberate lines on every viewport — the mobile
                    clamp scales down so "supplied without compromise."
                    holds one line instead of wrapping back to three. */}
                <span className="block">Precision metals,</span>
                <span className="block">
                  supplied without{" "}
                  <span className="hh-gold bg-gradient-to-r from-[#F0C66D] via-[#C8A45D] to-[#A8843D] bg-clip-text text-transparent">
                    compromise.
                  </span>
                </span>
              </h1>

              <span
                aria-hidden
                className="hh-rule mt-5 block h-px w-24 origin-left bg-gradient-to-r from-[#C8A45D] to-transparent"
              />

              <p
                className="hh-fade mt-6 max-w-xl text-[16px] leading-relaxed text-[#D3DAE0] sm:text-lg"
                style={{
                  animationDelay: "360ms",
                  textShadow: "0 1px 14px rgba(5,8,11,0.85), 0 1px 4px rgba(5,8,11,0.6)",
                }}
              >
                Engineered supply for industrial buyers — exact
                specification, dependable delivery, direct communication.
              </p>

              <div
                className="hh-fade mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
                style={{ animationDelay: "480ms" }}
              >
                <Link
                  href="/enquiry"
                  className="group inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#D8A84E] to-[#F0C66D] px-8 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[#05080B] shadow-[0_10px_30px_-12px_rgba(216,180,102,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(216,180,102,1)]"
                >
                  Get a Quote
                  <ArrowRight
                    size={15}
                    strokeWidth={2.2}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/products"
                  className="group inline-flex h-13 items-center justify-center gap-2 rounded-lg border border-white/30 bg-[#05080B]/60 px-8 font-mono text-[12px] font-semibold tracking-[0.08em] text-[#F5F7F8] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C8A45D]/70 hover:bg-[#05080B]/75 hover:text-[#F0C66D] hover:shadow-[0_0_30px_-12px_rgba(200,164,93,0.8)]"
                >
                  Explore products
                </Link>
              </div>
            </div>

            {/* Information bar */}
            <div
              className="hh-fade mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/8 backdrop-blur-md sm:grid-cols-4"
              style={{ animationDelay: "620ms" }}
            >
              <InfoCell
                icon={<Clock size={18} strokeWidth={1.6} />}
                value="10–19 IST"
                label="Working hours, Mon–Sat"
              />
              <InfoCell
                icon={<Phone size={18} strokeWidth={1.6} />}
                value={`${phoneCount} LINES`}
                label="Direct phone & WhatsApp"
              />
              <InfoCell
                icon={<FileText size={18} strokeWidth={1.6} />}
                value={gst}
                label="GST Registered"
              />
              <InfoCell
                icon={<ShieldCheck size={18} strokeWidth={1.6} />}
                value="100%"
                label="Commitment to quality"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hh-fade { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:none;} }
        @keyframes hh-line { from{opacity:0;transform:translateY(34px);filter:blur(8px);} to{opacity:1;transform:none;filter:blur(0);} }
        @keyframes hh-rule { from{transform:scaleX(0);} to{transform:scaleX(1);} }
        .hh-fade { animation: hh-fade .8s cubic-bezier(0.22,1,0.36,1) both; }
        .hh-line { animation: hh-line .95s cubic-bezier(0.22,1,0.36,1) both; animation-delay:160ms; }
        .hh-rule { animation: hh-rule .9s cubic-bezier(0.65,0,0.35,1) .8s both; }
        .hh-gold { text-shadow: 0 0 30px rgba(200,164,93,0.25); }
        @media (prefers-reduced-motion: reduce){
          .hh-fade,.hh-line,.hh-rule{animation:none!important;opacity:1!important;transform:none!important;filter:none!important;}
        }
      `}</style>
    </section>
  );
}

function InfoCell({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 bg-[#05080B]/55 px-4 py-4 sm:px-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#C8A45D]/25 bg-[#C8A45D]/10 text-[#E5C074]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[13px] font-semibold tracking-[0.08em] text-[#F5F7F8] [overflow-wrap:anywhere]">
          {value}
        </p>
        <p className="mt-0.5 text-[13px] leading-snug text-[#A9B2BA]">
          {label}
        </p>
      </div>
    </div>
  );
}
