"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui";
import { useReducedMotion } from "@/components/motion";
import type { NavItem } from "@/content/types";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { ChevronDownIcon, MenuIcon } from "./icons";

interface NavbarProps {
  siteName: string;
  nav: NavItem[];
  cta: { label: string; href: string };
}

const HIDE_AFTER = 400; // px — DS §12 hide/reveal threshold
const SCROLLED_AFTER = 8;

/**
 * Premium navbar (DS §12).
 * Top-of-page: transparent overlay (dark-hero aware), 80px tall.
 * Scrolled: 64px, Paper 85% + backdrop blur (the single sanctioned
 * glass use), full hairline. Hides on scroll-down after 400px,
 * reveals on scroll-up — disabled under reduced motion.
 *
 * A scroll listener is required here (direction detection is not
 * achievable with IntersectionObserver); the handler only schedules
 * an rAF and all reads happen inside the frame.
 */
export function Navbar({ siteName, nav, cta }: NavbarProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const megaTriggerRef = useRef<HTMLButtonElement>(null);
  const lastY = useRef(0);
  const raf = useRef(0);

  const anyOverlayOpen = megaOpen || mobileOpen;

  useEffect(() => {
    const update = () => {
      raf.current = 0;
      const y = window.scrollY;
      setScrolled(y > SCROLLED_AFTER);

      if (!reduced && !anyOverlayOpen) {
        const goingDown = y > lastY.current + 4;
        const goingUp = y < lastY.current - 4;
        if (goingDown && y > HIDE_AFTER) setHidden(true);
        else if (goingUp || y <= HIDE_AFTER) setHidden(false);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };

    const onScroll = () => {
      if (raf.current === 0) raf.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [reduced, anyOverlayOpen]);

  // Close overlays on route change (render-time adjustment — avoids a
  // cascading-render effect; see react.dev "adjusting state during render").
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMegaOpen(false);
    setMobileOpen(false);
  }

  const closeMega = useCallback((refocus = false) => {
    setMegaOpen(false);
    if (refocus) megaTriggerRef.current?.focus();
  }, []);

  // Click outside / focus outside closes the mega menu.
  useEffect(() => {
    if (!megaOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) closeMega();
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) closeMega();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [megaOpen, closeMega]);

  const productsItem = nav.find((item) => item.children?.length);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Transparent overlay is only readable over the homepage's dark
  // hero; every other route gets the solid navbar from the start.
  const solid = scrolled || pathname !== "/";

  return (
    <header
      ref={headerRef}
      data-surface="dark"
      className={cn(
        "fixed inset-x-0 top-0 z-40",
        "transition-transform duration-(--duration-base) ease-(--ease-inout) motion-reduce:transition-none",
        hidden && !anyOverlayOpen ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div
        className={cn(
          "border-b transition-colors duration-(--duration-base) ease-(--ease-inout) motion-reduce:transition-none",
          solid
            ? "border-line-dark bg-ink/85 backdrop-blur-md"
            : "border-paper/10 bg-transparent",
        )}
      >
        <Container>
          <nav
            aria-label="Main"
            className={cn(
              "flex items-center justify-between gap-6 transition-[height] duration-(--duration-base) ease-(--ease-inout) motion-reduce:transition-none",
              solid && scrolled ? "h-[4.5rem]" : "h-[5.5rem]",
            )}
          >
            {/* Wordmark */}
            <Link
              href="/"
              className="flex items-center gap-2.5 whitespace-nowrap"
              aria-label={`${siteName} — home`}
            >
              <Image
                src="/brand/logo-mark.png"
                alt=""
                width={36}
                height={36}
                priority
                className="size-9 shrink-0"
              />
              <span className="text-heading-sm font-display font-semibold tracking-tight text-surface-fg">
                {siteName}
              </span>
            </Link>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => {
                const active = isActive(item.href);
                if (item.children?.length) {
                  return (
                    <li key={item.label}>
                      <button
                        ref={megaTriggerRef}
                        type="button"
                        aria-expanded={megaOpen}
                        aria-controls="mega-menu-products"
                        onClick={() => setMegaOpen((v) => !v)}
                        className={cn(
                          "flex items-center gap-1 px-3 py-2",
                          "text-body-sm font-medium text-surface-fg",
                          "relative after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-accent after:opacity-0 after:transition-opacity after:duration-(--duration-fast)",
                          (active || megaOpen) && "after:opacity-100",
                        )}
                      >
                        {item.label}
                        <ChevronDownIcon
                          size={16}
                          className={cn(
                            "transition-transform duration-(--duration-fast) motion-reduce:transition-none",
                            megaOpen && "rotate-180",
                          )}
                        />
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block px-3 py-2 text-body-sm font-medium text-surface-fg",
                        "relative after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-accent after:opacity-0 after:transition-opacity after:duration-(--duration-fast)",
                        active && "after:opacity-100",
                        "hover:after:opacity-60",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* CTA + mobile trigger */}
            <div className="flex items-center gap-3">
              <Link
                href={cta.href}
                className={cn(
                  "hidden sm:inline-flex h-11 items-center rounded-xs bg-accent px-6",
                  "text-label text-paper-raised",
                  "transition-colors duration-(--duration-base) hover:bg-accent-hover",
                )}
              >
                {cta.label} <span aria-hidden>↗</span>
              </Link>
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                onClick={() => setMobileOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-xs border border-edge text-surface-fg lg:hidden"
              >
                <MenuIcon size={24} />
              </button>
            </div>
          </nav>
        </Container>
      </div>

      {/* Mega menu panel — rendered inside the header for focus flow */}
      {productsItem?.children ? (
        <MegaMenu
          id="mega-menu-products"
          open={megaOpen}
          categories={productsItem.children}
          allHref={productsItem.href}
          onClose={closeMega}
        />
      ) : null}

      {/* Mobile sheet */}
      <MobileNav
        id="mobile-nav"
        open={mobileOpen}
        nav={nav}
        cta={cta}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
