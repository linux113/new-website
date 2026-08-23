"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/ui";
import { useReducedMotion } from "@/components/motion";

const LINES = [
  { text: "SOURCED.", accent: false },
  { text: "CHECKED.", accent: false },
  { text: "DELIVERED.", accent: true },
] as const;

const LINE_WIDTH = 0.22;
const SUB_START = 0.48;
const GOLD = { r: 201, g: 172, b: 114 }; // #c9ac72
const MAX_PARTICLES = 110;

type Ember = {
  x: number;
  y: number;
  r: number;
  a: number;
  vx: number;
  vy: number;
  flicker: number;
  parallax: number;
};

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function lineWindow(progress: number, index: number): number {
  const start = 0.12 + index * 0.11;
  return clamp((progress - start) / LINE_WIDTH);
}

function applyScrub(el: HTMLElement, t: number, track = true) {
  const inv = 1 - t;
  el.style.opacity = String(t);
  el.style.filter = t >= 0.999 ? "none" : `blur(${(10 * inv).toFixed(2)}px)`;
  el.style.transform = `translate3d(0, ${(30 * inv).toFixed(2)}px, 0)`;
  if (track) el.style.letterSpacing = `${(0.35 * inv).toFixed(3)}em`;
}

/**
 * SM–K / KINETIC SEQUENCE.
 * Full-bleed dark plate: gold ember field + three headline lines that
 * scrub with scroll progress. Reduced motion renders the final state
 * with no canvas and no interpolation.
 */
export function KineticSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const applyProgress = (progress: number) => {
      LINES.forEach((_, i) => {
        const node = lineRefs.current[i];
        if (node) applyScrub(node, lineWindow(progress, i));
      });
      if (subRef.current) {
        applyScrub(subRef.current, clamp((progress - SUB_START) / 0.22), false);
      }
    };

    if (reduced) {
      applyProgress(1);
      return;
    }

    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx || !stage) {
      applyProgress(0);
      return;
    }

    const particles: Ember[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = false;
    let raf = 0;
    let lastY = window.scrollY;
    let velocity = 0;
    let lastT = performance.now();

    const seed = () => {
      const area = Math.max(1, width * height);
      const count = Math.min(MAX_PARTICLES, Math.max(40, Math.round(area / 16000)));
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.6 + Math.random() * 1.8,
          a: 0.18 + Math.random() * 0.55,
          vx: (Math.random() - 0.5) * 0.18,
          vy: -0.12 - Math.random() * 0.35,
          flicker: Math.random() * Math.PI * 2,
          parallax: 0.35 + Math.random() * 0.85,
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

    const measureProgress = () => {
      const rect = section.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      return clamp(-rect.top / total);
    };

    const tick = (time: number) => {
      raf = 0;
      if (!visible) return;

      const dt = Math.min(2.4, (time - lastT) / 16.67);
      lastT = time;

      const y = window.scrollY;
      velocity += (y - lastY - velocity) * 0.14;
      lastY = y;

      applyProgress(measureProgress());

      ctx.clearRect(0, 0, width, height);
      const driftX = velocity * 0.18;
      const driftY = velocity * 0.28;

      for (const ember of particles) {
        ember.flicker += 0.045 * dt;
        ember.x += (ember.vx + driftX * ember.parallax * 0.04) * dt;
        ember.y += (ember.vy - driftY * ember.parallax * 0.03) * dt;

        if (ember.y < -12) ember.y = height + 12;
        if (ember.y > height + 12) ember.y = -12;
        if (ember.x < -12) ember.x = width + 12;
        if (ember.x > width + 12) ember.x = -12;

        const pulse = ember.a * (0.72 + 0.28 * Math.sin(ember.flicker));
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.r * 3.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${(pulse * 0.16).toFixed(3)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${pulse.toFixed(3)})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible && raf === 0) {
          lastT = performance.now();
          lastY = window.scrollY;
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0 },
    );

    resize();
    applyProgress(measureProgress());
    observer.observe(section);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      data-surface="dark"
      aria-labelledby="home-kinetic"
      className={
        reduced
          ? "relative overflow-hidden bg-ink text-paper"
          : "relative h-[240vh] overflow-hidden bg-ink text-paper"
      }
    >
      <div
        ref={stageRef}
        className={
          reduced
            ? "relative flex min-h-[70vh] items-center py-24 lg:py-32"
            : "sticky top-0 flex h-svh items-center"
        }
      >
        {!reduced ? (
          <canvas
            ref={canvasRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        ) : null}

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
          <p className="text-mono-meta text-mist">The sequence</p>
          <div className="mt-6 flex flex-col gap-2 sm:gap-3">
            {LINES.map((line, i) => (
              <span
                key={line.text}
                ref={(node) => {
                  lineRefs.current[i] = node;
                }}
                aria-hidden
                className={
                  line.accent
                    ? "text-display-xl block font-display tracking-tight text-accent-ondark will-change-[opacity,transform,filter]"
                    : "text-display-xl block font-display tracking-tight text-paper will-change-[opacity,transform,filter]"
                }
                style={
                  reduced
                    ? undefined
                    : {
                        opacity: 0,
                        filter: "blur(10px)",
                        transform: "translate3d(0, 30px, 0)",
                        letterSpacing: "0.35em",
                      }
                }
              >
                {line.text}
              </span>
            ))}
          </div>
          <p
            ref={subRef}
            className="text-body-lg mt-10 max-w-measure text-mist will-change-[opacity,transform,filter]"
            style={
              reduced
                ? undefined
                : {
                    opacity: 0,
                    filter: "blur(10px)",
                    transform: "translate3d(0, 30px, 0)",
                    letterSpacing: "0.35em",
                  }
            }
          >
            Every consignment follows the same sequence — sourced to the
            specification, checked before it ships, delivered as agreed.
          </p>
        </Container>
      </div>
    </section>
  );
}
