"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FileText, ArrowUpRight, X, Download } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/components/motion";

export interface Certificate {
  id: string;
  title: string;
  image: string;
  alt: string;
  documentUrl?: string | null;
}

interface Props {
  cert: Certificate;
  index: number;
  onOpen: (cert: Certificate) => void;
}

/**
 * Premium 3D certificate card.
 *
 * Layered structure (translateZ depth) inside a preserve-3d stage:
 *   card bg < shadow < certificate paper < badge < arrow button.
 * Pointer position drives rotateX/rotateY (max ±6deg), a cursor-follow
 * gold radial light, and a diagonal reflection. On enter the paper
 * lifts forward (translateZ) and the card rises; on click the
 * certificate opens in an accessible modal via the parent.
 *
 * All motion is rAF-throttled and disabled under prefers-reduced-motion
 * (cards remain clickable with a simple fade/scale).
 */
export function CertificateCard({ cert, index, onOpen }: Props) {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLButtonElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(false);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (reduced) return;
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        // Tilt toward cursor; top-left -> rotateX(4) rotateY(-5)
        const ry = (px - 0.5) * 12; // ±6deg
        const rx = (0.5 - py) * 10; // ±5deg
        el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
        el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      });
    },
    [reduced],
  );

  const handleEnter = useCallback(() => {
    setActive(true);
    if (reduced) return;
    const el = stageRef.current;
    el?.style.setProperty("--lift", "1");
  }, [reduced]);

  const handleLeave = useCallback(() => {
    setActive(false);
    if (frame.current) cancelAnimationFrame(frame.current);
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--lift", "0");
  }, []);

  return (
    <div
      className="ql-card-wrap"
      style={{
        animation: reduced
          ? undefined
          : "ql-in 0.8s cubic-bezier(0.22,1,0.36,1) both",
        animationDelay: `${index * 130}ms`,
      }}
    >
      <button
        ref={stageRef}
        type="button"
        onClick={() => onOpen(cert)}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        aria-label={`View certificate: ${cert.title}`}
        className="group relative block w-full cursor-pointer rounded-2xl border border-white/10 bg-[#0A1015] p-4 text-left outline-none transition-[border-color,box-shadow] duration-400 ease-out focus-visible:border-[#D8A84E] focus-visible:shadow-[0_0_0_1px_rgba(216,168,78,0.4)]"
        style={
          {
            perspective: "1000px",
            ["--rx" as string]: "0deg",
            ["--ry" as string]: "0deg",
            ["--mx" as string]: "50%",
            ["--my" as string]: "30%",
            ["--lift" as string]: "0",
          } as React.CSSProperties
        }
      >
        {/* Cursor-follow gold light */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
            active && "opacity-100",
          )}
          style={{
            background:
              "radial-gradient(280px circle at var(--mx) var(--my), rgba(216,168,78,0.16), transparent 55%)",
          }}
        />

        {/* Circular arrow (top-right, lifts forward) */}
        <span
          aria-hidden
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F0C66D] to-[#D8A84E] text-[#05080B] shadow-[0_8px_24px_-8px_rgba(216,168,78,0.8)] transition-transform duration-300 group-hover:scale-108"
          style={{ transform: "translateZ(40px)" }}
        >
          <ArrowUpRight size={18} strokeWidth={2.2} />
        </span>

        {/* 3D stage */}
        <span
          className="relative block"
          style={{
            transformStyle: "preserve-3d",
            transform: reduced
              ? undefined
              : "rotateX(var(--rx)) rotateY(var(--ry))",
            transition: "transform 300ms ease-out",
            willChange: "transform",
          }}
        >
          {/* Pedestal / stage surface */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 bottom-2 h-10 rounded-[50%] bg-black/60 blur-xl"
            style={{ transform: "translateZ(0px)" }}
          />

          {/* Certificate paper (lifts forward) */}
          <span
            className="relative block overflow-hidden rounded-lg border border-[#D8A84E]/30 bg-gradient-to-br from-[#fdfaf0] to-[#efe6cf] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)]"
            style={{
              transform: reduced
                ? undefined
                : "translateZ(calc(25px + var(--lift) * 18px)) translateY(calc(var(--lift) * -6px))",
              transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {/* No white glare sweep — the certificate surface shows clean */}

            <span
              className="relative block aspect-[4/3] w-full"
              style={{ transform: "translateZ(10px)" }}
            >
              <Image
                src={cert.image}
                alt={cert.alt}
                fill
                sizes="(min-width:1024px) 22vw,(min-width:640px) 45vw,90vw"
                className="object-contain p-4"
              />
            </span>

            {/* Gold glow under certificate on hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-6 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-[50%] bg-[#D8A84E]/30 blur-2xl transition-opacity duration-400"
              style={{ opacity: active ? 0.9 : 0.3 }}
            />
          </span>
        </span>

        {/* Label row */}
        <div
          className="relative mt-5 flex items-center gap-3"
          style={{ transform: "translateZ(20px)" }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D8A84E]/30 bg-[#D8A84E]/5 text-[#D8A84E]">
            <FileText size={16} strokeWidth={1.6} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="inline-flex items-center rounded-md border border-[#D8A84E]/40 bg-[#D8A84E]/10 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#F0C66D] transition-[border-color,box-shadow] duration-300 group-hover:border-[#D8A84E]/70 group-hover:shadow-[0_0_16px_-6px_rgba(216,168,78,0.8)]">
              View Document
            </p>
            <p className="mt-1 font-display text-[15px] font-semibold leading-snug text-[#F5F7F8] sm:text-[1.05rem]">
              {cert.title}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

/* ---------------- Modal ---------------- */

interface ModalProps {
  cert: Certificate | null;
  onClose: () => void;
}

export function CertificateModal({ cert, onClose }: ModalProps) {
  // ESC to close + lock body scroll while open.
  useEffect(() => {
    if (!cert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [cert, onClose]);

  useEffect(() => {
    if (cert) document.getElementById("ql-modal")?.focus();
  }, [cert]);

  return (
    <div
      id="ql-modal"
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${
        cert ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!cert}
      role="dialog"
      aria-modal="true"
      aria-label={cert?.title ?? "Certificate"}
      tabIndex={-1}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close certificate"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-md"
        tabIndex={-1}
      />

      {cert ? (
        <div
          role="document"
          className="relative w-full max-w-3xl scale-100 overflow-hidden rounded-2xl border border-[#D8A84E]/30 bg-[#0A1015] p-5 shadow-[0_40px_120px_-30px_rgba(216,168,78,0.5)] sm:p-8"
          style={{ animation: "ql-modal 0.4s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#D8A84E]">
                Verified Certificate
              </p>
              <h2 className="mt-2 pr-8 font-display text-xl font-semibold leading-tight text-[#F5F7F8] sm:text-2xl">
                {cert.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#A9B2BA] transition-colors hover:border-[#D8A84E] hover:text-[#F0C66D]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-[#D8A84E]/20 bg-gradient-to-br from-[#fdfaf0] to-[#efe6cf] p-6">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl">
              <Image
                src={cert.image}
                alt={cert.alt}
                fill
                sizes="(min-width:768px) 50vw, 90vw"
                className="object-contain"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {cert.documentUrl ? (
              <a
                href={cert.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-[#D8A84E] to-[#F0C66D] px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-[#05080B]"
              >
                <Download size={15} /> Download
              </a>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/15 px-6 font-mono text-[12px] uppercase tracking-[0.14em] text-[#A9B2BA] transition-colors hover:border-[#D8A84E] hover:text-[#F0C66D]"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
