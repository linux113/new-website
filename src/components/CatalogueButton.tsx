"use client";

import { useEffect, useRef, useState } from "react";
import { Download, FileText } from "lucide-react";

/**
 * "Download Catalogue" navbar button with a small dropdown listing the
 * catalogue PDFs. Opens on click, closes on outside click / Esc.
 */
const CATALOGUES = [
  { label: "Sriyaan Metals — Full Catalogue", href: "/catalogue/sriyaan-metals-catalog.pdf" },
  { label: "Carbon Steel Pipes", href: "/catalogue/carbon-steel-pipes.pdf" },
];

export function CatalogueButton() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="hidden h-11 items-center gap-2 rounded-xs border border-edge px-4 text-label font-medium text-surface-fg transition-colors duration-(--duration-base) hover:bg-white/[0.06] md:inline-flex"
      >
        <Download size={15} strokeWidth={1.8} aria-hidden />
        Catalogue
      </button>

      <div
        inert={!open}
        className={`absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-xl border border-[#C8A45D]/30 bg-[#0A1015]/95 p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
          open
            ? "visible pointer-events-auto translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <span
          aria-hidden
          className="mb-1 block h-px bg-gradient-to-r from-transparent via-[#D8A84E] to-transparent"
        />
        <p className="px-3 pb-1 pt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F5F7F8]">
          Download Catalogue
        </p>
        {CATALOGUES.map((c) => (
          <a
            key={c.href}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-200 hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-[#D8A84E] transition-colors group-hover:border-[#D8A84E]/40">
              <FileText size={15} strokeWidth={1.6} aria-hidden />
            </span>
            <span className="min-w-0 flex-0 text-[13px] font-medium leading-tight text-[#F5F7F8] transition-colors group-hover:text-[#F0C66D]">
              {c.label}
              <span className="mt-0.5 block text-xs text-[#A9B2BA]">PDF — opens in new tab</span>
            </span>
            <Download
              size={14}
              aria-hidden
              className="shrink-0 text-[#727D86] transition-colors group-hover:text-[#D8A84E]"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
