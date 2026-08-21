"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/components/motion";
import type { NavItem } from "@/content/types";
import { CloseIcon } from "./icons";

interface MobileNavProps {
  id: string;
  open: boolean;
  nav: NavItem[];
  cta: { label: string; href: string };
  onClose: () => void;
}

/**
 * Mobile navigation (DS §12 Mobile).
 * Full-screen Carbon sheet: links as oversized display rows with mono
 * indices, staggered entrance (~30ms/item, skipped under reduced
 * motion), CTA pinned at the bottom with safe-area padding. Body
 * scroll locked while open; Esc closes; Tab trapped; focus returns
 * to the hamburger on close (handled by the trigger's aria wiring).
 */
export function MobileNav({ id, open, nav, cta, onClose }: MobileNavProps) {
  const reduced = useReducedMotion();
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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
        "fixed inset-0 z-50 flex flex-col bg-ink text-paper lg:hidden",
        "transition-opacity duration-(--duration-base) ease-(--ease-inout) motion-reduce:transition-none",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {/* Sheet header */}
      <div className="flex h-20 items-center justify-between border-b border-line-dark px-5 md:px-8">
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

      {/* Links — oversized display rows with mono indices */}
      <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-8 md:px-8">
        <ul>
          {nav.map((item, i) => (
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
            </li>
          ))}
        </ul>
      </nav>

      {/* Pinned CTA — safe-area padded (DS §24.9) */}
      <div className="border-t border-line-dark px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-8">
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
