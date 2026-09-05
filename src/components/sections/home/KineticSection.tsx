"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui";
import { useReducedMotion } from "@/components/motion";

/**
 * SM–K / KINETIC SEQUENCE.
 *
 * Full-bleed dark plate with a gold ember field (canvas) and three
 * headline lines — SOURCED. CHECKED. DELIVERED. — that animate in
 * when the section scrolls into view.
 *
 * The previous implementation scrubbed headline opacity/filter from
 * scroll position over a 240vh pinned stage, which left the content
 * invisible at the top of the section on some devices/browsers. This
 * version uses IntersectionObserver to trigger a one-time reveal and
 * is robust across viewports. Reduced motion renders the final state
 * with no canvas or animation.
 */

const LINES = [
  { text: "SOURCED.", accent: false, delay: 0 },
  { text: "CHECKED.", accent: false, delay: 120 },
  { text: "DELIVERED.", accent: true, delay: 240 },
] as const;

const GOLD = { r: 201, g: 172, b: 114 }; // #c9ac72
const MAX_PARTICLES = 90;

type Ember = {
  x: number;
  y: number;
  r: number;
  a: number;
  vx: number;
  vy: number;
  flicker: number;
};

export function KineticSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  // Server-rendered markup must show the final, visible state. Starting
  // hidden meant the section stayed blank whenever JS was slow or blocked.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const shown = active || reduced || !mounted;

  // Reveal when the middle of the section enters the viewport.
  useEffect(() => {
    if (reduced) {
      const id = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(id);
    }
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Defer so setState is not synchronous in the effect body.
            requestAnimationFrame(() => setActive(true));
            observer.disconnect();
          }
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [reduced]);

  // Ember canvas — only runs once active and with motion allowed.
  useEffect(() => {
    if (reduced || !active) return;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let lastT = performance.now();

    const particles: Ember[] = [];
    const seed = () => {
      const area = Math.max(1, width * height);
      const count = Math.min(
        MAX_PARTICLES,
        Math.max(36, Math.round(area / 22000)),
      );
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.5 + Math.random() * 1.6,
          a: 0.18 + Math.random() * 0.5,
          vx: (Math.random() - 0.5) * 0.14,
          vy: -0.08 - Math.random() * 0.28,
          flicker: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = stage.clientWidth;
      height = stage.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const tick = (time: number) => {
      const dt = Math.min(2.4, (time - lastT) / 16.67);
      lastT = time;

      ctx.clearRect(0, 0, width, height);
      for (const ember of particles) {
        ember.flicker += 0.04 * dt;
        ember.x += ember.vx * dt;
        ember.y += ember.vy * dt;
        if (ember.y < -12) ember.y = height + 12;
        if (ember.x < -12) ember.x = width + 12;
        if (ember.x > width + 12) ember.x = -12;

        const pulse = ember.a * (0.7 + 0.3 * Math.sin(ember.flicker));
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.r * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${(pulse * 0.14).toFixed(3)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${pulse.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced, active]);

  return (
    <section
      ref={sectionRef}
      data-surface="dark"
      aria-labelledby="home-kinetic"
      className="keep-dark relative overflow-hidden bg-ink py-28 text-paper lg:py-40"
    >
      <div ref={stageRef} className="relative">
        {!reduced ? (
          <canvas
            ref={canvasRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        ) : null}

        {/* Vignette to keep text legible over the ember field */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 20%, rgb(11 13 14 / 0.55) 78%, var(--color-ink) 100%)",
          }}
        />

        <Container className="relative z-10">
          <h2 id="home-kinetic" className="sr-only">
            Sourced. Checked. Delivered.
          </h2>

          <p
            className={`text-mono-meta text-mist transition-all duration-700 ease-out motion-reduce:transition-none ${
              shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            The sequence
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:gap-3">
            {LINES.map((line) => (
              <span
                key={line.text}
                aria-hidden
                className="text-display-xl block font-display tracking-tight will-change-[opacity,transform] motion-reduce:transform-none motion-reduce:opacity-100"
                style={{
                  color: line.accent
                    ? "var(--color-accent-on-dark)"
                    : "var(--color-paper)",
                  opacity: shown ? 1 : 0,
                  transform: shown
                    ? "translate3d(0,0,0)"
                    : "translate3d(0,28px,0)",
                  filter: shown ? "none" : "blur(8px)",
                  transition: `opacity 800ms cubic-bezier(0.22,1,0.36,1) ${line.delay}ms, transform 800ms cubic-bezier(0.22,1,0.36,1) ${line.delay}ms, filter 800ms cubic-bezier(0.22,1,0.36,1) ${line.delay}ms`,
                }}
              >
                {line.text}
              </span>
            ))}
          </div>

          <p
            className="text-body-lg mt-10 max-w-xl text-mist transition-all duration-700 ease-out motion-reduce:transition-none"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown
                ? "translate3d(0,0,0)"
                : "translate3d(0,20px,0)",
              transitionDelay: "380ms",
            }}
          >
            Every consignment follows the same sequence — sourced to the
            specification, checked before it ships, delivered as agreed.
          </p>
        </Container>
      </div>
    </section>
  );
}
