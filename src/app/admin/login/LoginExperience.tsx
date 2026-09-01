"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { LoginForm } from "./LoginForm";

export function LoginExperience() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let mx = 0.5;
    let my = 0.5;

    const apply = () => {
      raf = 0;
      const card = cardRef.current;
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
    <main
      ref={stageRef}
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#05070c] px-5 py-12 text-[#F1F0EC]"
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_-10%,#0b1220_0%,#05070c_55%)]" />
      <div
        aria-hidden
        className="login-glow absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.13),transparent_65%)]"
      />
      <div
        aria-hidden
        className="login-glow absolute -right-52 -bottom-56 size-[46rem] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.11),transparent_65%)]"
        style={{ animationDelay: "4.5s" }}
      />
      <div aria-hidden className="login-grid absolute inset-0 opacity-40" />

      <div className="relative flex w-full max-w-md items-center justify-center">
        <div ref={cardRef} className="login-card login-card-enter relative z-10 w-full">
          <div className="login-border pointer-events-none absolute -inset-px rounded-2xl" aria-hidden />
          <div className="login-sheen pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden />

          <div className="relative rounded-2xl border border-white/[0.07] bg-[rgba(10,14,20,0.78)] p-8 shadow-[0_32px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-10">
            <div className="login-reveal flex flex-col items-center gap-3" style={{ animationDelay: "80ms" }}>
              <Image src="/brand/logo-white-gold.png" alt="SRIYAAN METALS" width={167} height={44} className="h-11 w-auto" />
              <span className="text-[0.8125rem] font-medium tracking-[0.18em] text-[#8b98a5] uppercase">
                Admin access
              </span>
            </div>

            <div className="login-reveal mt-6 text-center" style={{ animationDelay: "180ms" }}>
              <h1 className="font-display text-[2rem]/[1.1] font-semibold tracking-tight">
                <span className="bg-gradient-to-r from-[#22d3ee] to-[#2dd4bf] bg-clip-text text-transparent">Sign in</span>
              </h1>
              <p className="mt-2 text-[1rem] text-[#8b98a5]">
                Enter your email and password to continue.
              </p>
            </div>

            <div className="login-reveal" style={{ animationDelay: "300ms" }}>
              <LoginForm />
            </div>

            <div
              className="login-reveal mt-7 flex items-center justify-center gap-2 border-t border-white/[0.06] pt-5"
              style={{ animationDelay: "440ms" }}
            >
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden>
                <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="#8b98a5" strokeWidth="1.2" />
                <path d="M3.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="#8b98a5" strokeWidth="1.2" />
              </svg>
              <span className="text-[0.8125rem] tracking-[0.08em] text-[#8b98a5]">
                Restricted access
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
