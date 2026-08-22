"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { LoginForm } from "./LoginForm";

/**
 * Premium 2026 industrial admin login (client spec).
 *
 * Split screen: LEFT brand/visual panel (≥lg) with technical grid,
 * drifting particles, animated data-flow lines, live status
 * indicators and cursor parallax; RIGHT floating glass login card
 * with reflection sweep and staged entrance.
 *
 * Restraint rules honored: accent is the brand's warm metallic gold
 * (#B89A62) used as the "glow" hue; no purple, no neon overload.
 * All effects are CSS + one rAF parallax handler; everything is
 * disabled under prefers-reduced-motion. Zero dependencies added.
 */
export function LoginExperience() {
  const leftRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Cursor parallax: layers move at different speeds; glass panel
  // gets a light-position variable for the reflection.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let mx = 0.5;
    let my = 0.5;

    const apply = () => {
      raf = 0;
      const left = leftRef.current;
      const card = cardRef.current;
      if (left) {
        left.style.setProperty("--par-x", String((mx - 0.5) * 2));
        left.style.setProperty("--par-y", String((my - 0.5) * 2));
      }
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--light-x", `${((mx * window.innerWidth - rect.left) / rect.width) * 100}%`);
        card.style.setProperty("--light-y", `${((my * window.innerHeight - rect.top) / rect.height) * 100}%`);
      }
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
      if (raf === 0) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="login-stage relative flex min-h-svh w-full overflow-hidden bg-[#0B0D0E] text-[#F1F0EC]">
      {/* ================= LEFT — brand / visual (≥ lg) ================= */}
      <div
        ref={leftRef}
        className="relative hidden flex-1 overflow-hidden lg:block"
        aria-hidden="true"
      >
        {/* Technical grid — slow drift, parallax layer 1 */}
        <div
          className="login-grid absolute inset-[-10%]"
          style={{ transform: "translate(calc(var(--par-x, 0) * -8px), calc(var(--par-y, 0) * -8px))" }}
        />
        {/* Radial glow behind composition */}
        <div className="absolute top-1/2 left-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,154,98,0.14),transparent_65%)]" />

        {/* Data-flow lines — parallax layer 2 */}
        <svg
          className="absolute inset-0 h-full w-full"
          style={{ transform: "translate(calc(var(--par-x, 0) * -16px), calc(var(--par-y, 0) * -16px))" }}
          viewBox="0 0 800 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {[
            "M-40 220 H 360 V 430 H 620",
            "M-40 560 H 220 V 340 H 520 V 620 H 840",
            "M180 940 V 700 H 470 V 520",
            "M840 180 H 560 V 300",
          ].map((d, i) => (
            <g key={i}>
              <path d={d} stroke="rgba(241,240,236,0.07)" strokeWidth="1" />
              <path
                d={d}
                stroke="rgba(184,154,98,0.55)"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="login-flow"
                style={{ animationDelay: `${i * 1.7}s` }}
              />
            </g>
          ))}
          {/* Nodes */}
          {[[360, 430], [220, 340], [470, 520], [560, 300], [360, 220]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="rgba(184,154,98,0.8)" className="login-node" style={{ animationDelay: `${i * 0.9}s` }} />
          ))}
        </svg>

        {/* Floating particles — parallax layer 3 */}
        <div style={{ transform: "translate(calc(var(--par-x, 0) * -26px), calc(var(--par-y, 0) * -26px))" }}>
          {[
            [12, 18, 9], [26, 64, 12], [44, 32, 8], [58, 78, 14], [70, 22, 10],
            [82, 52, 11], [18, 86, 13], [64, 44, 9], [36, 58, 15], [78, 84, 10],
          ].map(([x, y, dur], i) => (
            <span
              key={i}
              className="login-particle absolute block size-1 rounded-full bg-[#B89A62]/50"
              style={{ left: `${x}%`, top: `${y}%`, animationDuration: `${dur}s`, animationDelay: `${i * 0.8}s` }}
            />
          ))}
        </div>

        {/* Bottom-left copy block */}
        <div className="absolute inset-x-0 bottom-0 p-14">
          <div className="login-reveal" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3">
              <Image src="/brand/logo-mark.png" alt="" width={40} height={40} className="size-10" />
              <span className="font-display text-lg font-semibold tracking-tight">
                SRIYAAN <span className="text-[#686D6C]">/ ADMIN</span>
              </span>
            </div>
          </div>

          <h2 className="login-reveal font-display mt-8 max-w-lg text-[2.6rem]/[1.08] font-semibold tracking-tight" style={{ animationDelay: "340ms" }}>
            Powering Smarter Industrial Commerce.
          </h2>
          <p className="login-reveal mt-4 max-w-md text-[0.95rem]/[1.6] text-[#A7A9A6]" style={{ animationDelay: "480ms" }}>
            Manage products, enquiries, customers, content, and business
            operations from one intelligent workspace.
          </p>

          {/* Status indicators */}
          <div className="login-reveal mt-9 flex flex-wrap gap-6" style={{ animationDelay: "620ms" }}>
            {["SYSTEM ONLINE", "GLOBAL OPERATIONS", "SECURE ADMIN ACCESS"].map((label, i) => (
              <span key={label} className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.14em] text-[#A7A9A6]">
                <span className="relative flex size-1.5">
                  <span className="login-pulse absolute inline-flex size-full rounded-full bg-[#B89A62]" style={{ animationDelay: `${i * 0.6}s` }} />
                  <span className="relative inline-flex size-1.5 rounded-full bg-[#B89A62]" />
                </span>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Right edge divider */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#2A2E30] to-transparent" />
      </div>

      {/* ================= RIGHT — login card ================= */}
      <div className="relative flex w-full items-center justify-center px-5 py-12 lg:w-[34rem] lg:shrink-0 lg:px-12 xl:w-[38rem]">
        {/* Mobile-only ambient background */}
        <div className="login-grid absolute inset-0 opacity-60 lg:hidden" aria-hidden />
        <div className="absolute top-0 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(184,154,98,0.10),transparent_70%)] lg:hidden" aria-hidden />

        <div
          ref={cardRef}
          className="login-card login-card-enter relative w-full max-w-105"
        >
          {/* Animated gradient border */}
          <div className="login-border pointer-events-none absolute -inset-px rounded-2xl" aria-hidden />
          {/* Reflection sweep */}
          <div className="login-sheen pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden />

          <div className="relative rounded-2xl border border-[#2A2E30] bg-[rgba(17,20,22,0.72)] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-9">
            {/* Logo + heading */}
            <div className="login-reveal flex items-center gap-3 lg:hidden" style={{ animationDelay: "80ms" }}>
              <Image src="/brand/logo-mark.png" alt="" width={34} height={34} className="size-8.5" />
              <span className="font-display text-base font-semibold tracking-tight">
                SRIYAAN <span className="text-[#686D6C]">/ ADMIN</span>
              </span>
            </div>

            <div className="login-reveal mt-6 lg:mt-0" style={{ animationDelay: "160ms" }}>
              <h1 className="font-display text-[1.9rem]/[1.15] font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="mt-2 text-[0.9rem] text-[#A7A9A6]">
                Sign in to your admin workspace
              </p>
            </div>

            <div className="login-reveal" style={{ animationDelay: "280ms" }}>
              <LoginForm />
            </div>

            {/* Secure indicator */}
            <div className="login-reveal mt-7 flex items-center justify-center gap-2 border-t border-[#2A2E30] pt-5" style={{ animationDelay: "420ms" }}>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden>
                <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="#686D6C" strokeWidth="1.2" />
                <path d="M3.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="#686D6C" strokeWidth="1.2" />
              </svg>
              <span className="font-mono text-[0.62rem] tracking-[0.16em] text-[#686D6C]">
                SECURE ENTERPRISE ACCESS · SESSION ENCRYPTED
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
