"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Award,
  Factory,
  FileText,
  Globe,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Package,
  PanelsTopLeft,
  Search,
  Settings,
  Tags,
  Truck,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { logoutAction } from "@/lib/auth/actions";

/**
 * Admin application shell: persistent sidebar ≥ lg, slide-over
 * drawer below. Utilitarian design language (clarity/density) —
 * deliberately distinct from the public site's editorial look,
 * while reusing the same design tokens.
 */

interface AdminShellProps {
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
}

const NAV_GROUPS: { heading: string; items: { label: string; href: string; icon: typeof Package }[] }[] = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    heading: "Catalogue",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Tags },
    ],
  },
  {
    heading: "Content",
    items: [
      { label: "Blog", href: "/admin/blogs", icon: FileText },
      { label: "Industries", href: "/admin/industries", icon: Factory },
      { label: "Certifications", href: "/admin/certifications", icon: Award },
      { label: "Infrastructure", href: "/admin/infrastructure", icon: Truck },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
      { label: "Global reach", href: "/admin/global-reach", icon: Globe },
    ],
  },
  {
    heading: "Inbox",
    items: [
      { label: "Enquiries", href: "/admin/enquiries", icon: Inbox },
      { label: "Vendor requests", href: "/admin/vendor-requests", icon: Search },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Media", href: "/admin/media", icon: ImageIcon },
      { label: "Website content", href: "/admin/content", icon: PanelsTopLeft },
      { label: "SEO", href: "/admin/seo", icon: Search },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close drawer on route change + Esc; trap focus while open.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setDrawerOpen(false);
  }

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
      if (e.key === "Tab") {
        const focusables = drawerRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        );
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <Link
        href="/admin/dashboard"
        className="text-heading-sm font-display px-2 font-semibold tracking-tight text-paper"
      >
        SRIYAAN <span className="text-mist">/ ADMIN</span>
      </Link>

      {NAV_GROUPS.map((group) => (
        <div key={group.heading}>
          <p className="text-mono-micro px-2 text-mist">{group.heading}</p>
          <ul className="mt-2 flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = pathname.startsWith(item.href);
              const ItemIcon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xs px-2 py-2 text-body-sm",
                      "transition-colors duration-(--duration-fast)",
                      active
                        ? "bg-ink-soft text-paper"
                        : "text-mist hover:bg-ink-soft/60 hover:text-paper",
                    )}
                  >
                    <ItemIcon size={16} strokeWidth={1.5} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* User + logout pinned bottom */}
      <div className="mt-auto border-t border-line-dark pt-4">
        <p className="text-body-sm px-2 font-medium text-paper">{user.name}</p>
        <p className="text-mono-micro px-2 text-mist">{user.role}</p>
        <form action={logoutAction} className="mt-3 px-2">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xs border border-line-dark px-3 py-2 text-body-sm text-mist transition-colors duration-(--duration-fast) hover:bg-ink-soft hover:text-paper"
          >
            <LogOut size={16} strokeWidth={1.5} aria-hidden />
            Log out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-dvh bg-paper-sunken text-ink">
      {/* Desktop sidebar */}
      <aside
        data-surface="dark"
        className="sticky top-0 hidden h-dvh w-64 shrink-0 bg-ink lg:block"
      >
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-ink/60"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            data-surface="dark"
            className="absolute inset-y-0 left-0 flex w-72 flex-col bg-ink shadow-modal"
          >
            <div className="flex justify-end p-2">
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close navigation"
                onClick={() => setDrawerOpen(false)}
                className="flex size-11 items-center justify-center rounded-xs text-mist hover:text-paper"
              >
                <X size={20} strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1">{sidebar}</div>
          </div>
        </div>
      ) : null}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-line bg-paper-raised px-4 lg:hidden">
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="flex size-11 items-center justify-center rounded-xs border border-line"
          >
            <Menu size={20} strokeWidth={1.5} aria-hidden />
          </button>
          <span className="text-heading-sm font-display font-semibold">
            SRIYAAN / ADMIN
          </span>
        </header>

        <main id="admin-main" className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
