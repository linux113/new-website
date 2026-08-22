"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { useReducedMotion } from "@/components/motion";

/**
 * SM–01 / HERO — scroll-driven frame-sequence edition (client asset).
 *
 * The client-supplied 50-frame sequence (nuts/bolts 3D animation)
 * plays as the user scrolls through the hero: a sticky viewport
 * canvas scrubs frames against scroll progress (Apple-style).
 *
 * - Frames drawn to <canvas>, cover-fit, no layout shift
 * - Frame 1 also rendered as an <img> underneath for instant LCP
 *   and no-JS fallback
 * - prefers-reduced-motion: static frame, no scrubbing, section
 *   collapses to a single viewport (no scroll hijack length)
 * - Frames preloaded progressively; scrubbing works with whatever
 *   is loaded so slow networks degrade gracefully
 */

const FRAME_COUNT = 50;
const framePath = (i: number) =>
  `/hero-frames/frame-${String(i + 1).padStart(2, "0")}.jpg`;

export function ScrollFrameHero() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const currentFrame = useRef(-1);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let disposed = false;

    const draw = (img: HTMLImageElement) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth * dpr;
      const ch = canvas.clientHeight * dpr;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      // cover-fit
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const render = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      let target = Math.round(progress * (FRAME_COUNT - 1));
      // fall back to the nearest loaded frame at or below target
      while (target > 0 && !framesRef.current[target]) target--;
      const img = framesRef.current[target];
      if (img && target !== currentFrame.current) {
        currentFrame.current = target;
        draw(img);
        if (!canvasReady) setCanvasReady(true);
      } else if (img && canvas.width === 0) {
        draw(img);
      }
    };

    const schedule = () => {
      if (raf === 0) raf = requestAnimationFrame(render);
    };

    // progressive preload: first frame, then every 5th, then the rest
    const order: number[] = [0];
    for (let i = 0; i < FRAME_COUNT; i += 5) if (i !== 0) order.push(i);
    for (let i = 0; i < FRAME_COUNT; i++) if (!order.includes(i)) order.push(i);

    let loadIndex = 0;
    const loadNext = () => {
      if (disposed || loadIndex >= order.length) return;
      const n = order[loadIndex++];
      const img = new window.Image();
      img.onload = () => {
        framesRef.current[n] = img;
        if (n === 0) schedule();
        loadNext();
      };
      img.onerror = () => loadNext();
      img.src = framePath(n);
    };
    // two parallel loaders
    loadNext();
    loadNext();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      disposed = true;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      data-surface="dark"
      // 250vh scroll runway drives the 50 frames; reduced motion = single screen
      className={reduced ? "relative" : "relative h-[250vh]"}
    >
      <section
        aria-labelledby="home-hero"
        className="sticky top-0 flex min-h-svh items-end overflow-hidden bg-ink text-paper"
      >
        {/* Frame 1 as real <img>: instant LCP + no-JS fallback */}
        <Image
          src={framePath(reduced ? FRAME_COUNT - 1 : 0)}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-300 ${canvasReady ? "opacity-0" : "opacity-100"}`}
        />
        {/* Scrubbed canvas */}
        {!reduced ? (
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
        ) : null}

        {/* Carbon grade for legibility */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/65 via-transparent to-transparent" />

        <Container className="relative pb-16 lg:pb-24">
          <div className="grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8">
            <div className="col-span-4 flex flex-col items-start gap-6 pt-40 md:col-span-9 lg:pt-52">
              <Eyebrow code="SM–01">
                Metals · Trading · Import / Export — Mumbai, IN
              </Eyebrow>

              <h1 id="home-hero" className="text-display-xl text-balance">
                Precision metals,
                <br />
                supplied without compromise.
              </h1>

              <p className="text-body-lg text-mist max-w-measure">
                SRIYAAN METALS is a Mumbai-based metals business serving
                industrial buyers — built on exact specification, dependable
                supply and direct communication.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <ButtonLink href="/enquiry" variant="primary" size="lg" arrow>
                  Get a Quote
                </ButtonLink>
                <ButtonLink href="/products" variant="secondaryDark" size="lg">
                  Explore Products
                </ButtonLink>
              </div>
            </div>
          </div>

          {/* Mono meta rail */}
          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-2 border-t border-paper/15 pt-6">
            <p className="text-mono-micro text-mist">18.9582° N / 72.8118° E — OPERA HOUSE, MUMBAI</p>
            <p className="text-mono-micro text-mist">HRS 10:00–19:00 IST</p>
            <p className="text-mono-micro text-mist">GSTIN 27CRKPS0693G1ZB</p>
            {!reduced ? (
              <p className="text-mono-micro ml-auto hidden text-mist/70 sm:block">
                SCROLL ↓
              </p>
            ) : null}
          </div>
        </Container>
      </section>
    </div>
  );
}
