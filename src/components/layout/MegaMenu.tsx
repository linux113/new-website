"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { NavCategory } from "@/content/types";
import { ArrowRightIcon } from "./icons";

interface MegaMenuProps {
  id: string;
  open: boolean;
  categories: NavCategory[];
  allHref: string;
  /** Close; pass refocus=true to return focus to the trigger. */
  onClose: (refocus?: boolean) => void;
  /** Panel heading (e.g. "Products", "Company"). */
  heading?: string;
  /** One-line description under the heading. */
  sub?: string;
  /** Footer CTA label. */
  ctaLabel?: string;
  /** Show the per-row line icons (product categories only). */
  showIcons?: boolean;
  /** Extra classes — width overrides live here. */
  className?: string;
}

/**
 * Compact Products dropdown (desktop).
 *
 * A small anchored panel (not a full-width mega menu) with a header,
 * six numbered category rows (number, line icon, name, description,
 * arrow) and a gold "View all products" CTA. Opens with a 200ms
 * fade/rise; click-outside and Esc close it; Tab cycles within.
 * The product names come from content/site.ts and link to real
 * category pages. Mobile uses MobileNav instead.
 */
export function MegaMenu({
  id,
  open,
  categories,
  allHref,
  onClose,
  heading = "Products",
  sub = "Explore our metal product categories",
  ctaLabel = "All Products",
  showIcons = true,
  className,
}: MegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc + focus trap while open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose(true);
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>("a[href]");
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
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      id={id}
      ref={panelRef}
      data-surface={undefined}
      inert={!open}
      role="navigation"
      aria-label={`${heading} menu`}
      className={cn(
        "absolute left-0 top-full z-50 hidden w-[22rem] max-w-[calc(100vw-2rem)] pt-3 lg:block",
        className,
        "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
        open
          ? "visible pointer-events-auto translate-y-0 opacity-100"
          : "invisible pointer-events-none -translate-y-1 opacity-0",
      )}
    >
      <div className="overflow-hidden rounded-xl border border-[#D8A84E]/35 bg-[#0A1015]/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        {/* Gold top hairline */}
        <span
          aria-hidden
          className="block h-px bg-gradient-to-r from-transparent via-[#D8A84E] to-transparent"
        />

        {/* Header */}
        <div className="px-5 pb-3 pt-4">
          <p className="font-mono text-[1rem] font-semibold uppercase tracking-[0.16em] text-[#F5F7F8]">
            {heading}
          </p>
          <p className="mt-1 text-xs text-[#727D86]">{sub}</p>
        </div>

        {/* Category rows */}
        <ul className="px-2">
          {categories.map((cat) => (
            <li key={cat.index}>
              <Link
                href={cat.href}
                onClick={() => onClose()}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none"
              >
                <span className="w-7 shrink-0 font-mono text-[12px] tabular-nums text-[#727D86] transition-colors duration-200 group-hover:text-[#D8A84E]">
                  {cat.index}
                </span>
                {showIcons ? (
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 text-[#D8A84E] transition-all duration-200 group-hover:border-[#D8A84E]/40 group-hover:shadow-[0_0_14px_-6px_rgba(216,168,78,0.9)]"
                  >
                    <CategoryIcon index={cat.index} />
                  </span>
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-medium leading-tight text-[#F5F7F8] transition-colors duration-200 group-hover:text-[#F0C66D]">
                    {cat.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs leading-tight text-[#727D86]">
                    {cat.meta}
                  </span>
                </span>
                <ArrowRightIcon size={16}
                  className="shrink-0 text-[#727D86] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#D8A84E] group-hover:opacity-100 motion-reduce:transition-none"
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer CTA */}
        <div className="mt-1 border-t border-white/8 p-3">
          <Link
            href={allHref}
            onClick={() => onClose()}
            className="group flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#D8A84E] to-[#F0C66D] px-4 py-2.5 font-mono text-[0.9375rem] font-semibold uppercase tracking-[0.14em] text-[#05080B] transition-all duration-200 hover:brightness-105 hover:shadow-[0_8px_24px_-10px_rgba(216,168,78,0.9)]"
          >
            {ctaLabel}
            <ArrowRightIcon size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* Minimal line icons per category (no image assets). */
function CategoryIcon({ index }: { index: string }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (index) {
    case "01": // pipes
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="3" /><circle cx="17" cy="7" r="3" />
          <circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" />
        </svg>
      );
    case "02": // sheets/plates
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="6" rx="1" />
          <rect x="3" y="13" width="18" height="6" rx="1" />
        </svg>
      );
    case "03": // coils
      return (
        <svg {...common}>
          <path d="M6 16a6 6 0 1 1 12 0" />
          <path d="M6 16h12" />
        </svg>
      );
    case "04": // structural (I-beam)
      return (
        <svg {...common}>
          <path d="M4 5h16M4 19h16M7 5v14M17 5v14" />
        </svg>
      );
    case "05": // stainless (layers)
      return (
        <svg {...common}>
          <path d="M12 3 3 8l9 5 9-5-9-5Z" />
          <path d="m3 13 9 5 9-5M3 18l9 5 9-5" />
        </svg>
      );
    default: // other (blocks)
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" rx="1" />
          <rect x="13" y="4" width="7" height="7" rx="1" />
          <rect x="4" y="13" width="7" height="7" rx="1" />
          <rect x="13" y="13" width="7" height="7" rx="1" />
        </svg>
      );
  }
}
