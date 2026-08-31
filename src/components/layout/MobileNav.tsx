"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Download } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/components/motion";
import type { NavItem } from "@/content/types";
import { CloseIcon } from "./icons";
import { ThemeToggle } from "@/components/ThemeToggle";

interface MobileNavProps {
  id: string;
  open: boolean;
  nav: NavItem[];
  cta: { label: string; href: string };
  onClose: () => void;
}

/**
 * Mobile navigation — full-screen sheet.
 *
 * Items WITH sub-items (Products, Company) render as expandable
 * sections: tapping the row expands its links inline (the mobile
 * equivalent of the desktop dropdowns), so every page stays reachable.
 * Simple items link directly. Below the links: catalogue downloads,
 * theme toggle and the pinned CTA. Body scroll is locked while open;
 * Esc closes; Tab is trapped; focus starts on the close button.
 */
export function MobileNav({ id, open, nav, cta, onClose }: MobileNavProps) {
  const reduced = useReducedMotion();
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Reset expansion when the sheet closes (deferred — avoids a
  // synchronous setState inside the effect).
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setExpanded(null), 0);
    return () => clearTimeout(t);
  }, [open]);

  // Scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Esc close + focus trap.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const sheet = sheetRef.current;
      if (!sheet) return;
      const focusables = sheet.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      id={id}
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      data-surface="dark"
      inert={!open}
      className={cn(
        "fixed inset-0 z-50 flex h-dvh flex-col bg-ink text-paper lg:hidden",
        "transition-opacity duration-(--duration-base) ease-(--ease-inout) motion-reduce:transition-none",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {/* Sheet header */}
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-line-dark px-5 md:px-8">
        <span className="text-heading-sm font-display font-semibold tracking-tight">
          Menu
        </span>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-xs border border-line-dark"
        >
          <CloseIcon size={24} />
        </button>
      </div>

      {/* Links */}
      <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
        <ul>
          {nav.map((item, i) => {
            const hasChildren = !!item.children?.length;
            const isOpen = expanded === item.label;

            return (
              <li
                key={item.label}
                className={cn(
                  "border-b border-line-dark",
                  !reduced &&
                    "transition-[opacity,translate] duration-(--duration-base) ease-(--ease-out-quart)",
                  !reduced &&
                    (open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"),
                )}
                style={
                  !reduced && open ? { transitionDelay: `${i * 30}ms` } : undefined
                }
              >
                {hasChildren ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`mobile-section-${item.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                      className="group flex w-full items-baseline gap-5 py-4 text-left"
                    >
                      <span className="text-mono-meta text-mist tabular-nums">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-display-md">{item.label}</span>
                      <ChevronDown
                        size={20}
                        strokeWidth={1.8}
                        aria-hidden
                        className={cn(
                          "self-center text-mist transition-transform duration-(--duration-base) motion-reduce:transition-none",
                          isOpen && "rotate-180 text-accent",
                        )}
                      />
                    </button>

                    {/* Expandable sub-links */}
                    <div
                      id={`mobile-section-${item.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-(--duration-base) ease-(--ease-out-quart) motion-reduce:transition-none",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <ul className="pb-3 pl-12">
                          {item.children!.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                onClick={onClose}
                                className="group flex items-center gap-3 border-l border-line-dark py-2.5 pl-4 text-body-lg text-mist transition-colors hover:border-accent hover:text-paper"
                              >
                                <span className="text-mono-micro text-mist/70 tabular-nums transition-colors group-hover:text-accent">
                                  {child.index}
                                </span>
                                {child.label}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className="group flex items-center gap-3 border-l border-line-dark py-2.5 pl-4 text-body-lg text-mist transition-colors hover:border-accent hover:text-paper"
                            >
                              <span className="text-mono-micro text-mist/70 transition-colors group-hover:text-accent">
                                →
                              </span>
                              View all
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-baseline gap-5 py-4"
                  >
                    <span className="text-mono-meta text-mist tabular-nums">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-display-md">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Catalogue + theme — safe-area padded */}
      <div className="flex shrink-0 flex-col gap-3 border-t border-edge px-6 pt-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-surface-fg-muted">
          Download Catalogue
        </p>
        <div className="flex flex-col gap-2">
          {[
            { label: "Sriyaan Metals — Full Catalogue", href: "/catalogue/sriyaan-metals-catalog.pdf" },
            { label: "Carbon Steel Pipes", href: "/catalogue/carbon-steel-pipes.pdf" },
          ].map((c) => (
            <a
              key={c.href}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xs border border-edge px-4 py-3 text-body-sm font-medium text-surface-fg"
            >
              <Download size={15} strokeWidth={1.8} aria-hidden className="text-accent" />
              {c.label}
            </a>
          ))}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-surface-fg-muted">Theme</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Pinned CTA — safe-area padded */}
      <div className="shrink-0 border-t border-line-dark px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-8">
        <Link
          href={cta.href}
          onClick={onClose}
          className={cn(
            "flex h-13 w-full items-center justify-center rounded-xs bg-accent",
            "text-label text-paper-raised",
            "transition-colors duration-(--duration-base) hover:bg-accent-hover",
          )}
        >
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
