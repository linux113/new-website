"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { extractSvgInner } from "@/lib/svg";
import {
  ArrowRight,
  Building2,
  Clock3,
  Handshake,
  HeartHandshake,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui";
import { useReducedMotion } from "@/components/motion";

/**
 * OUR CUSTOMERS — premium B2B buyers section.
 *
 *   1. Header — "OUR CUSTOMERS" label, H2 with gold-glow accent word,
 *      supporting copy (left) + subtle global network visual (right).
 *   2. Four trust indicators with thin-line gold icons + separators.
 *   3. Six customer cards — dark glass/metal panels with 3D tilt,
 *      lift, gold glow, light sweep and a gold accent line.
 *   4. Trust banner with "BECOME OUR PARTNER" CTA.
 *
 * Customer data arrives from the server (admin-managed DB rows, with a
 * typed default set until real logos are published). Motion is
 * scroll-triggered, staggered and disabled under reduced motion.
 */

export interface CustomerEntry {
  name: string;
  industry?: string;
  logo?: { src: string | null; alt: string } | null;
}

interface Props {
  customers: CustomerEntry[];
  dotsSvg: string;
}

const TRUST: { Icon: LucideIcon; title: string; sub: string }[] = [
  { Icon: ShieldCheck, title: "Quality Assured", sub: "Tested. Verified." },
  { Icon: Handshake, title: "Global Partnerships", sub: "Long-term relationships" },
  { Icon: Clock3, title: "On-Time Delivery", sub: "Reliable & Efficient" },
  { Icon: HeartHandshake, title: "Customer Focused", sub: "Built on trust" },
];

/** Static network points for the ambient map (lat/lng → projected). */
const POINTS = [
  { lat: 51.9, lng: 4.48 },
  { lat: 25.2, lng: 55.27 },
  { lat: 1.35, lng: 103.82 },
  { lat: 40.71, lng: -74.0 },
  { lat: -26.2, lng: 28.04 },
  { lat: 19.076, lng: 72.8777 }, // Mumbai origin
];

function project(lat: number, lng: number) {
  return { x: ((lng + 180) / 360) * 1000, y: ((90 - lat) / 180) * 500 };
}

/* --------------------------- scroll reveal --------------------------- */

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            requestAnimationFrame(() => setInView(true));
            io.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

/* ------------------------------ 3D card ----------------------------- */

function CustomerCard({
  customer,
  delay,
  shown,
}: {
  customer: CustomerEntry;
  delay: number;
  shown: boolean;
}) {
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`);
  };
  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl bg-gradient-to-b from-[#0C1218] to-[#070A0E] p-5 transition-[opacity,transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        shown ? "" : "cu-card-pre"
      } ${
        reduced
          ? "border border-white/10 hover:border-[#C8A45D]/45 hover:shadow-[0_30px_60px_-28px_rgba(0,0,0,0.9)]"
          : "border border-white/10 [transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] hover:border-[#C8A45D]/45 hover:shadow-[0_30px_60px_-28px_rgba(0,0,0,0.9),0_0_40px_-18px_rgba(200,164,93,0.35)] hover:[transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))_translateY(-10px)_scale(1.02)] motion-reduce:transform-none"
      }`}
      style={{ transitionDelay: shown ? `${delay}ms` : undefined }}
      aria-label={customer.name}
    >
      {/* inner top highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      <div className="relative flex flex-1 flex-col items-center justify-center gap-3 py-4 text-center">
        {customer.logo?.src ? (
          <span className="relative block h-10 w-24 transition-[filter,transform] duration-300 group-hover:scale-[1.04] group-hover:brightness-125 motion-reduce:transition-none">
            <Image
              src={customer.logo.src}
              alt={customer.logo.alt || `${customer.name} logo`}
              fill
              sizes="(min-width: 64rem) 16vw, (min-width: 40rem) 33vw, 45vw"
              loading="lazy"
              className="object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100"
            />
          </span>
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C8A45D]/25 bg-[#C8A45D]/[0.07] text-[#C8A45D] transition-[transform,box-shadow] duration-300 group-hover:scale-[1.04] group-hover:[box-shadow:0_0_22px_-6px_rgba(200,164,93,0.6)] motion-reduce:transition-none">
            <Building2 size={20} strokeWidth={1.5} aria-hidden />
          </span>
        )}
        <div>
          <p className="font-display text-[15px] font-semibold tracking-wide text-[#F5F7F8] transition-colors duration-300 group-hover:text-white sm:text-[1.05rem]">
            {customer.name}
          </p>
          {customer.industry ? (
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-[#727D86]">
              {customer.industry}
            </p>
          ) : null}
        </div>
      </div>

      {/* gold accent line */}
      <span
        aria-hidden
        className="absolute inset-x-6 bottom-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#C8A45D]/70 to-transparent opacity-70 transition-all duration-300 group-hover:inset-x-3 group-hover:opacity-100 group-hover:[box-shadow:0_0_12px_rgba(200,164,93,0.55)]"
      />
    </article>
  );
}

/* ------------------------------ section ----------------------------- */

export function CustomersClient({ customers, dotsSvg }: Props) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const shown = inView || reduced;
  const origin = project(19.076, 72.8777);

  return (
    <section
      aria-labelledby="home-customers"
      className="relative overflow-hidden border-t border-white/10 bg-[#05080B] py-24 text-[#F5F7F8] lg:py-32"
    >
      {/* Ambient background: grid + gold/blue light + fine particles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%,#000 20%,transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[26rem] w-[26rem] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(200,164,93,0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-44 -right-40 h-[26rem] w-[26rem] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.06), transparent 70%)",
        }}
      />

      <div ref={ref} className={shown ? "cu-on" : undefined}>
        <Container className="relative">
          {/* ---------------- Header + network visual ---------------- */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <p
                className="cu-el font-mono text-[1rem] font-semibold uppercase tracking-[0.16em] text-[#C8A45D]"
                style={{ transitionDelay: "0ms" }}
              >
                Our Customers
              </p>
              <h2
                id="home-customers"
                className="cu-el mt-5 font-display text-[clamp(2.1rem,4.2vw,3.6rem)] font-semibold leading-[1.05] tracking-tight text-[#F5F7F8]"
                style={{ transitionDelay: "80ms" }}
              >
                Buyers we{" "}
                <span
                  className="bg-gradient-to-r from-[#F2C766] via-[#E5C074] to-[#C8A45D] bg-clip-text text-transparent"
                  style={{ filter: "drop-shadow(0 0 18px rgba(230,190,110,0.32))" }}
                >
                  serve
                </span>{" "}
                globally
              </h2>
              <p
                className="cu-el mt-6 max-w-xl text-[15px] leading-relaxed text-[#A9B2BA] sm:text-base"
                style={{ transitionDelay: "160ms" }}
              >
                Trusted by manufacturers, contractors, and OEMs worldwide for
                quality materials and reliable supply — global metal supply
                partners for quality-assured metals and dependable sourcing.
              </p>
            </div>

            {/* Global network visual */}
            <div className="lg:col-span-6">
              <div
                className={`cu-map relative aspect-[2/1] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#070B0E] via-[#05080B] to-[#04060A] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${
                  shown ? "" : "cu-map-pre"
                }`}
                role="img"
                aria-label="World map showing the global customer and supply network of SRIYAAN METALS"
              >
                <div
                  aria-hidden
                  className="keep-dark pointer-events-none absolute inset-0"
                  style={{
                    background: `radial-gradient(18rem 11rem at ${origin.x / 10}% ${
                      origin.y / 5
                    }%, rgba(214,168,74,0.12), transparent 70%)`,
                  }}
                />
                <svg
                  viewBox="0 0 1000 500"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="cu-route" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#F2C766" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#D8A84E" stopOpacity="0.15" />
                    </linearGradient>
                    <filter id="cu-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <g
                    dangerouslySetInnerHTML={{ __html: extractSvgInner(dotsSvg) }}
                    opacity="0.55"
                  />

                  {/* minimal trade routes from origin */}
                  <g fill="none" stroke="url(#cu-route)" strokeWidth="0.9" filter="url(#cu-glow)">
                    {POINTS.filter((p) => !(p.lat === 19.076 && p.lng === 72.8777)).map((p, i) => {
                      const t = project(p.lat, p.lng);
                      const mx = (origin.x + t.x) / 2;
                      const my = Math.min(origin.y, t.y) - Math.abs(t.x - origin.x) * 0.16;
                      return (
                        <path
                          key={`${p.lat},${p.lng}`}
                          d={`M ${origin.x} ${origin.y} Q ${mx} ${my} ${t.x} ${t.y}`}
                          strokeDasharray="1200"
                          strokeDashoffset={shown ? 0 : 1200}
                          style={{
                            transition: `stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1) ${
                              300 + i * 160
                            }ms`,
                          }}
                        />
                      );
                    })}
                  </g>

                  {/* connection points */}
                  {POINTS.map((p, i) => {
                    const isOrigin = p.lat === 19.076 && p.lng === 72.8777;
                    const t = project(p.lat, p.lng);
                    return (
                      <g key={`pt-${i}`} transform={`translate(${t.x},${t.y})`}>
                        {!reduced && (
                          <circle
                            r={isOrigin ? 8 : 6}
                            fill="none"
                            stroke="#E5C074"
                            strokeWidth="0.7"
                            opacity="0.5"
                            style={{
                              transformOrigin: "center",
                              animation: `cu-ping 3.2s ease-out ${i * 0.5}s infinite`,
                            }}
                          />
                        )}
                        <circle
                          r={isOrigin ? 3 : 1.9}
                          fill="#FBE7A8"
                          opacity="0.9"
                          style={{ filter: "drop-shadow(0 0 5px rgba(242,199,102,0.8))" }}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* ---------------- Trust indicators ---------------- */}
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] lg:mt-16 lg:grid-cols-4">
            {TRUST.map(({ Icon, title, sub }, i) => (
              <div
                key={title}
                className="cu-el flex items-start gap-4 bg-[#070A0D] p-6 sm:p-7"
                style={{ transitionDelay: `${240 + i * 80}ms` }}
              >
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  aria-hidden
                  className="mt-0.5 shrink-0 text-[#C8A45D] drop-shadow-[0_0_8px_rgba(200,164,93,0.35)]"
                />
                <div>
                  <p className="text-[13.5px] font-medium text-[#F5F7F8]">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#727D86]">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ---------------- Customer cards ---------------- */}
          <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-16 lg:grid-cols-6 lg:gap-5">
            {customers.slice(0, 6).map((customer, i) => (
              <li key={customer.name} className="h-full">
                <CustomerCard customer={customer} delay={120 + i * 70} shown={shown} />
              </li>
            ))}
          </ul>

          {/* ---------------- Trust banner ---------------- */}
          <div
            className="cu-el mt-14 flex flex-col gap-7 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0A1015] to-[#070B0F] p-7 shadow-[0_20px_60px_-40px_rgba(200,164,93,0.5)] sm:p-9 lg:flex-row lg:items-center lg:justify-between"
            style={{ transitionDelay: "480ms" }}
          >
            <div className="max-w-2xl">
              <h3 className="font-display text-xl font-semibold tracking-tight text-[#F5F7F8] sm:text-2xl">
                Built on quality. Driven by trust.
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[#A9B2BA] sm:text-sm">
                Reliable material supply and long-term partnerships for
                businesses across industries and global markets.
              </p>
            </div>
            <Link
              href="/enquiry"
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#C8A45D]/60 px-7 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#E5C074] shadow-[0_0_24px_-12px_rgba(200,164,93,0.5)] transition-all duration-300 hover:border-[#C8A45D] hover:shadow-[0_0_32px_-8px_rgba(200,164,93,0.7)]"
            >
              Become Our Partner
              <ArrowRight
                size={15}
                strokeWidth={2}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Container>
      </div>

      <style>{`
        .cu-el { opacity: 0; transform: translateY(20px); }
        .cu-on .cu-el {
          opacity: 1; transform: none;
          transition: opacity .8s cubic-bezier(0.22,1,0.36,1),
                      transform .8s cubic-bezier(0.22,1,0.36,1);
        }
        .cu-map-pre { opacity: 0; }
        .cu-map { transition: opacity 1.4s ease; }
        .cu-card-pre { opacity: 0; }
        @keyframes cu-ping { 0% { transform: scale(.5); opacity:.9; } 100% { transform: scale(2.6); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .cu-el, .cu-map-pre, .cu-card-pre { opacity: 1 !important; transform: none !important; }
          .cu-on .cu-el, .cu-map { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
