"use client";

import { useEffect, useRef } from "react";
import { Package, ShieldCheck, Globe, Ship } from "lucide-react";

/**
 * Premium circular capability strip — Products / Quality / Supply /
 * Import-Export. Each item is a large outlined circle with a gold +
 * electric-blue glow, a line icon, a subtle number and a label.
 *
 * Interactions (rAF-throttled):
 *  - slow rotating conic border
 *  - soft pulsing glow
 *  - hover: circle scales, icon illuminates, glow strengthens
 *  - staggered fade-up on scroll into view
 * Respects prefers-reduced-motion.
 */

const ITEMS = [
  { index: "01", label: "Products", Icon: Package, href: "/products" },
  { index: "02", label: "Quality", Icon: ShieldCheck, href: "/quality" },
  { index: "03", label: "Supply", Icon: Globe, href: "/industries" },
  { index: "04", label: "Import / Export", Icon: Ship, href: "/global-reach" },
];

export function CapabilityStrip() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const items = Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-cap]"),
    );
    let raf = 0;
    let visible = false;

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      items.forEach((el, i) => {
        const spin = (time / 6000 + i * 0.4) % 1;
        el.style.setProperty("--spin", `${spin * 360}deg`);
        // gentle pulse
        const pulse = 0.55 + 0.25 * (0.5 + 0.5 * Math.sin(time / 900 + i));
        el.style.setProperty("--pulse", String(pulse));
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible) {
          items.forEach((el, i) => {
            el.classList.add("cap-in");
            el.style.animationDelay = `${i * 110}ms`;
          });
        }
      },
      { threshold: 0.2 },
    );
    io.observe(wrap);
    raf = requestAnimationFrame(draw);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      aria-label="Capabilities"
      className="relative overflow-hidden border-y border-white/10 bg-[#05070A] py-16 sm:py-20"
    >
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 80% at 20% 50%, rgba(37,118,235,0.08), transparent 70%), radial-gradient(60% 80% at 80% 50%, rgba(200,164,93,0.08), transparent 70%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-none px-5 md:px-8 xl:px-12 2xl:px-16">
        <ul className="grid grid-cols-2 gap-y-12 gap-x-6 md:grid-cols-4 md:gap-x-8">
          {ITEMS.map(({ index, label, Icon, href }) => (
            <li key={label} data-cap className="cap-item">
              <a
                href={href}
                className="group flex flex-col items-center text-center"
                aria-label={label}
              >
                <span
                  aria-hidden
                  className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32"
                >
                  {/* Rotating conic ring */}
                  <span
                    className="cap-ring absolute inset-0 rounded-full opacity-80"
                    style={{
                      background:
                        "conic-gradient(from var(--spin,0deg), transparent 0deg, rgba(37,118,235,0.55) 70deg, transparent 150deg, transparent 210deg, rgba(200,164,93,0.6) 290deg, transparent 360deg)",
                      WebkitMask:
                        "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
                      mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
                      opacity: "var(--pulse, 0.7)",
                    }}
                  />
                  {/* Static circle */}
                  <span className="absolute inset-1.5 rounded-full border border-white/10 bg-[#070A0F]/80 transition-all duration-500 group-hover:inset-0.5 group-hover:border-[#C8A45D]/40" />
                  {/* Soft outer glow */}
                  <span
                    aria-hidden
                    className="absolute -inset-3 rounded-full opacity-50 blur-xl transition-opacity duration-500 group-hover:opacity-90"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(200,164,93,0.35), rgba(37,118,235,0.22) 55%, transparent 70%)",
                    }}
                  />
                  {/* Icon */}
                  <Icon
                    size={36}
                    strokeWidth={1.4}
                    className="relative z-10 text-[#C8A45D] transition-all duration-500 group-hover:scale-110 group-hover:text-[#F0C66D] sm:h-10 sm:w-10"
                    style={{
                      filter:
                        "drop-shadow(0 0 10px rgba(200,164,93,0.45))",
                    }}
                  />
                  {/* Number */}
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-[#8AA0BF]">
                    {index}
                  </span>
                </span>

                <span className="mt-5 font-display text-[1.05rem] font-semibold uppercase tracking-[0.14em] text-[#F5F7F8] transition-colors duration-300 group-hover:text-[#F0C66D] sm:text-[1.2rem]">
                  {label}
                </span>
                <span
                  aria-hidden
                  className="mt-3 h-px w-10 origin-center scale-x-100 bg-gradient-to-r from-transparent via-[#C8A45D] to-transparent opacity-60 transition-all duration-500 group-hover:w-16 group-hover:opacity-100"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes cap-in {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cap-item { opacity: 0; }
        .cap-item.cap-in {
          animation: cap-in 0.8s cubic-bezier(0.22,1,0.36,1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .cap-item { opacity: 1 !important; animation: none !important; }
          .cap-ring { animation: none !important; opacity: 0.7 !important; }
        }
      `}</style>
    </section>
  );
}
