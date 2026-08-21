"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui";
import type { NavCategory } from "@/content/types";
import { ArrowRightIcon } from "./icons";

interface MegaMenuProps {
  id: string;
  open: boolean;
  categories: NavCategory[];
  allHref: string;
  /** Close; pass refocus=true to return focus to the trigger. */
  onClose: (refocus?: boolean) => void;
}

/**
 * Products mega menu (DS §12).
 * Full-width raised panel under the navbar; categories rendered as
 * ruled Card/Row items with mono indices (DS §11). Opens with a
 * 150ms fade + 4px rise; Esc closes and refocuses the trigger;
 * Tab is trapped inside while open.
 *
 * Content: placeholder category slots from content/site.ts — no
 * invented product data (DS §31.4).
 */
export function MegaMenu({ id, open, categories, allHref, onClose }: MegaMenuProps) {
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
    // Move focus into the panel.
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      id={id}
      ref={panelRef}
      data-surface={undefined}
      inert={!open}
      className={cn(
        "absolute inset-x-0 top-full hidden lg:block",
        "bg-paper-raised text-ink shadow-float border-b border-line",
        "transition-[opacity,translate] duration-(--duration-fast) ease-(--ease-out-quart) motion-reduce:transition-none",
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0",
      )}
    >
      <Container className="py-10">
        <p className="text-mono-meta text-slate">
          Products / <span className="text-accent">placeholder categories</span>
        </p>

        <ul className="mt-6 border-t border-line">
          {categories.map((cat) => (
            <li key={cat.index}>
              <Link
                href={cat.href}
                onClick={() => onClose()}
                className={cn(
                  "group flex items-baseline gap-6 border-b border-line py-4",
                  "transition-colors duration-(--duration-base) hover:bg-paper-sunken",
                )}
              >
                <span className="text-mono-meta text-slate tabular-nums transition-colors duration-(--duration-base) group-hover:text-accent">
                  {cat.index}
                </span>
                <span className="text-heading-sm text-ink">{cat.label}</span>
                <span className="text-mono-micro text-mist">{cat.meta}</span>
                <ArrowRightIcon
                  size={16}
                  className="ml-auto self-center text-slate opacity-0 transition-[opacity,translate] duration-(--duration-base) group-hover:translate-x-1 group-hover:opacity-100 motion-reduce:transition-none"
                />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={allHref}
          onClick={() => onClose()}
          className="group mt-6 inline-flex items-center gap-2 text-label text-ink transition-colors duration-(--duration-base) hover:text-accent"
        >
          View all products
          <ArrowRightIcon
            size={16}
            className="transition-transform duration-(--duration-base) group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Link>
      </Container>
    </div>
  );
}
