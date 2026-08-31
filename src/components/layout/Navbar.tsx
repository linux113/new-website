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
import { ThemeToggle } from "@/components/ThemeToggle";
import { CatalogueButton } from "@/components/CatalogueButton";
import { MobileNav } from "./MobileNav";
import { ChevronDownIcon, MenuIcon } from "./icons";
import { ArrowRight } from "lucide-react";

interface NavbarProps {
  siteName: string;
  nav: NavItem[];
  cta: { label: string; href: string };
}

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
  const [megaOpenId, setMegaOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const megaTriggers = useRef(new Map<string, HTMLButtonElement>());
  const lastY = useRef(0);
  const raf = useRef(0);

  const megaOpen = megaOpenId !== null;

  const anyOverlayOpen = megaOpen || mobileOpen;

  useEffect(() => {
    const update = () => {
      raf.current = 0;
      const y = window.scrollY;
      setScrolled(y > SCROLLED_AFTER);

      if (!reduced && !anyOverlayOpen) {
        // Always keep the header visible — the page is long and the
        // nav + primary CTA must stay reachable (audit: sticky header).
        setHidden(false);
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
    setMegaOpenId(null);
    setMobileOpen(false);
  }

  const closeMega = useCallback(
    (refocus = false) => {
      const id = megaOpenId;
      setMegaOpenId(null);
      if (refocus && id) megaTriggers.current.get(id)?.focus();
    },
    [megaOpenId],
  );

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Transparent overlay is only readable over a dark hero. The home
  // and contact heroes are dark/photographic, so those routes start
  // transparent; every other route gets the solid navbar from the
  // start.
  const transparentTop = pathname === "/" || pathname === "/contact";
  const solid = scrolled || !transparentTop;

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
          "nav-bar border-b transition-colors duration-(--duration-base) ease-(--ease-inout) motion-reduce:transition-none",
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
                src="/brand/logo-white-gold.png"
                alt="SRIYAAN METALS"
                width={167}
                height={44}
                priority
                className="logo-dark h-11 w-auto shrink-0"
              />
              <Image
                src="/brand/logo-original.png"
                alt="SRIYAAN METALS"
                width={167}
                height={44}
                priority
                className="logo-light h-11 w-auto shrink-0"
              />
            </Link>

            {/* Desktop links */}
            <ul className="hidden items-center gap-2 lg:flex">
              {nav.map((item) => {
                const active = isActive(item.href);
                if (item.children?.length) {
                  const menuId = `mega-${item.label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
                  const isOpen = megaOpenId === menuId;
                  const isProducts = item.label === "Products";
                  return (
                    <li key={item.label} className="relative">
                      <button
                        ref={(el) => {
                          if (el) megaTriggers.current.set(menuId, el);
                          else megaTriggers.current.delete(menuId);
                        }}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={menuId}
                        onClick={() => setMegaOpenId((cur) => (cur === menuId ? null : menuId))}
                        className={cn(
                          "flex items-center gap-1 px-3 py-2",
                          "text-body-sm font-medium text-surface-fg",
                          "relative after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-accent after:opacity-0 after:transition-opacity after:duration-(--duration-fast)",
                          (active || isOpen) && "after:opacity-100",
                        )}
                      >
                        {item.label}
                        <ChevronDownIcon
                          size={16}
                          className={cn(
                            "transition-transform duration-(--duration-fast) motion-reduce:transition-none",
                            isOpen && "rotate-180",
                          )}
                        />
                      </button>
                      {/* Panel lives inside the trigger <li> so its left
                          edge aligns with the nav item */}
                      <MegaMenu
                        id={menuId}
                        open={isOpen}
                        categories={item.children}
                        allHref={item.href}
                        onClose={closeMega}
                        heading={item.label}
                        sub={
                          isProducts
                            ? "Explore our metal product categories"
                            : "The SRIYAAN METALS desk"
                        }
                        ctaLabel={isProducts ? "All Products" : "About SRIYAAN"}
                        showIcons={isProducts}
                        className={isProducts ? "w-[22rem]" : "w-80"}
                      />
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

            {/* CTA + catalogue + theme + mobile trigger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <CatalogueButton />
              <ThemeToggle />
              <Link
                href={cta.href}
                className={cn(
                  "hidden sm:inline-flex h-11 items-center gap-2 rounded-xs bg-accent px-6",
                  "text-label text-paper-raised",
                  "transition-colors duration-(--duration-base) hover:bg-accent-hover",
                )}
              >
                {cta.label}
                <ArrowRight size={15} strokeWidth={2} aria-hidden />
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
