"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Award,
  Bell,
  ChevronRight,
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
  Plus,
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
 * Admin command center shell — 2026 dark enterprise redesign.
 * Fixed sidebar with animated active indicator (shared layoutId),
 * top navigation with breadcrumbs / global search / notifications /
 * quick actions, and a slide-over drawer below lg. Fully scoped to
 * `.admin-dark` token remap in globals.css — the public site keeps
 * its own palette.
 */

export interface ShellNotification {
  id: string;
  title: string;
  meta: string;
  href: string;
}

interface AdminShellProps {
  user: { name: string; email: string; role: string };
  newLeadCount?: number;
  notifications?: ShellNotification[];
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
    heading: "Inbox",
    items: [
      { label: "Enquiries", href: "/admin/enquiries", icon: Inbox },
      { label: "Vendor requests", href: "/admin/vendor-requests", icon: Truck },
    ],
  },
  {
    heading: "Content",
    items: [
      { label: "Blog", href: "/admin/blogs", icon: FileText },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
      { label: "Certifications", href: "/admin/certifications", icon: Award },
      { label: "Industries", href: "/admin/industries", icon: Factory },
      { label: "Infrastructure", href: "/admin/infrastructure", icon: Truck },
      { label: "Global reach", href: "/admin/global-reach", icon: Globe },
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

const QUICK_ACTIONS = [
  { label: "Add product", href: "/admin/products/new" },
  { label: "Add category", href: "/admin/categories/new" },
  { label: "Create blog post", href: "/admin/blogs/new" },
  { label: "Upload media", href: "/admin/media" },
  { label: "View enquiries", href: "/admin/enquiries" },
];

/** Routes whose list pages accept ?q= — global search targets these. */
const SEARCHABLE = ["/admin/products", "/admin/blogs", "/admin/enquiries", "/admin/vendor-requests"];

const CRUMB_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Overview",
  products: "Products",
  categories: "Categories",
  blogs: "Blog",
  enquiries: "Enquiries",
  "vendor-requests": "Vendor requests",
  customers: "Customers",
  testimonials: "Testimonials",
  certifications: "Certifications",
  industries: "Industries",
  infrastructure: "Infrastructure",
  "global-reach": "Global reach",
  media: "Media",
  content: "Website content",
  seo: "SEO",
  settings: "Settings",
  new: "New",
  edit: "Edit",
};

function useDismiss(open: boolean, onClose: () => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, ref]);
}

const springMenu = { type: "spring" as const, stiffness: 520, damping: 34, mass: 0.7 };

export function AdminShell({ user, newLeadCount = 0, notifications = [], children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Admin is always dark — override any public theme choice.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const [notifOpen, setNotifOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close overlays on route change.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setDrawerOpen(false);
    setNotifOpen(false);
    setActionsOpen(false);
  }

  useDismiss(notifOpen, () => setNotifOpen(false), notifRef);
  useDismiss(actionsOpen, () => setActionsOpen(false), actionsRef);

  // Drawer focus trap + Esc (below lg).
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
      if (e.key === "Tab") {
        const focusables = drawerRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input",
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

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
    const base = SEARCHABLE.find((p) => pathname.startsWith(p)) ?? "/admin/products";
    router.push(q ? `${base}?q=${encodeURIComponent(q)}` : base);
  };

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments
    .filter((seg) => !seg.match(/^c[a-z0-9]{20,}$/)) // hide cuid ids
    .map((seg, i, arr) => ({
      label: CRUMB_LABELS[seg] ?? seg.replace(/-/g, " "),
      href: "/" + segments.slice(0, segments.indexOf(seg) + 1).join("/"),
      last: i === arr.length - 1,
    }));

  const initials = user.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col overflow-y-auto px-3 py-5">
      <Link href="/admin/dashboard" className="mb-6 flex items-center gap-3 px-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xs border border-line bg-ink-soft">
          <Image src="/brand/logo-emblem-white-gold.png" alt="" width={22} height={22} className="size-[22px] object-contain" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-display text-[0.9375rem] font-semibold tracking-tight text-ink">
            SRIYAAN METALS
          </span>
          <span className="block text-mono-micro text-mist">Command center</span>
        </span>
      </Link>

      <div className="flex flex-col gap-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.heading}>
            <p className="text-mono-micro px-2.5 text-mist">{group.heading}</p>
            <ul className="mt-1.5 flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname.startsWith(item.href);
                const ItemIcon = item.icon;
                return (
                  <li key={item.href} className="relative">
                    {active ? (
                      <motion.span
                        layoutId="admin-nav-active"
                        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 40 }}
                        aria-hidden
                        className="absolute inset-0 rounded-xs border border-accent/20 bg-accent-tint"
                      >
                        <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                      </motion.span>
                    ) : null}
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative z-10 flex items-center gap-3 rounded-xs px-2.5 py-2 text-body-sm",
                        "transition-colors duration-(--duration-fast)",
                        active ? "text-accent" : "text-slate hover:bg-ink-soft hover:text-ink",
                      )}
                    >
                      <ItemIcon size={16} strokeWidth={1.5} aria-hidden />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.href === "/admin/enquiries" && newLeadCount > 0 ? (
                        <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-mono-micro text-accent tabular-nums">
                          {newLeadCount}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* User + logout pinned bottom */}
      <div className="mt-auto border-t border-line pt-4">
        <div className="flex items-center gap-3 px-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#38bdf8] to-[#2563eb] text-[0.75rem] font-semibold text-[#04101f]">
            {initials}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-body-sm font-medium text-ink">{user.name}</span>
            <span className="block truncate text-mono-micro text-mist">{user.role.replace("_", " ")}</span>
          </span>
        </div>
        <form action={logoutAction} className="mt-3 px-2">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xs border border-line px-3 py-2 text-body-sm text-slate transition-colors duration-(--duration-fast) hover:border-error/40 hover:bg-error-tint hover:text-error"
          >
            <LogOut size={16} strokeWidth={1.5} aria-hidden />
            Log out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <div className="admin-dark adm-atmosphere flex min-h-dvh bg-paper-sunken text-ink">
      {/* Ambient technical grid (decoration only) */}
      <div aria-hidden className="adm-grid pointer-events-none fixed inset-0 z-0" />

      {/* Desktop sidebar */}
      <motion.aside
        initial={reduced ? false : { x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-20 hidden h-dvh w-64 shrink-0 border-r border-line bg-paper/85 backdrop-blur-md lg:block"
      >
        {sidebar}
      </motion.aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div aria-hidden className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="admin-dark absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-paper shadow-modal"
          >
            <div className="flex justify-end p-2">
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close navigation"
                onClick={() => setDrawerOpen(false)}
                className="flex size-11 items-center justify-center rounded-xs text-slate hover:text-ink"
              >
                <X size={20} strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1">{sidebar}</div>
          </div>
        </div>
      ) : null}

      {/* Main column */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Top navigation */}
        <header className="sticky top-0 z-30 border-b border-line bg-paper/80 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="flex size-10 shrink-0 items-center justify-center rounded-xs border border-line text-slate hover:text-ink lg:hidden"
            >
              <Menu size={18} strokeWidth={1.5} aria-hidden />
            </button>

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="hidden min-w-0 md:block">
              <ol className="flex items-center gap-1 text-body-sm">
                {crumbs.map((crumb, i) => (
                  <li key={crumb.href + i} className="flex min-w-0 items-center gap-1">
                    {i > 0 ? <ChevronRight size={13} strokeWidth={1.5} aria-hidden className="shrink-0 text-mist" /> : null}
                    {crumb.last ? (
                      <span aria-current="page" className="truncate font-medium text-ink capitalize">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link href={crumb.href === "/admin" ? "/admin/dashboard" : crumb.href} className="truncate text-slate capitalize hover:text-ink">
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {/* Global search */}
            <form role="search" onSubmit={onSearch} className="relative ml-auto w-full max-w-[11rem] sm:max-w-xs">
              <Search size={15} strokeWidth={1.5} aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-mist" />
              <input
                type="search"
                name="q"
                placeholder="Search…"
                aria-label="Search admin"
                className="h-10 w-full rounded-xs border border-line bg-paper-sunken/70 pr-3 pl-9 text-body-sm text-ink placeholder:text-mist focus-visible:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent/40"
              />
            </form>

            {/* Quick actions */}
            <div ref={actionsRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={actionsOpen}
                onClick={() => setActionsOpen((v) => !v)}
                className="flex h-10 items-center gap-2 rounded-xs bg-accent px-3 text-[0.8125rem] font-semibold text-[#04101f] transition-colors duration-(--duration-fast) hover:bg-accent-hover sm:px-4"
              >
                <Plus size={16} strokeWidth={2} aria-hidden />
                <span className="hidden sm:inline">New</span>
              </button>
              <AnimatePresence>
                {actionsOpen ? (
                  <motion.div
                    role="menu"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }}
                    transition={springMenu}
                    className="adm-card absolute right-0 z-40 mt-2 w-52 origin-top-right p-1.5 shadow-float"
                  >
                    {QUICK_ACTIONS.map((action) => (
                      <Link
                        key={action.href + action.label}
                        role="menuitem"
                        href={action.href}
                        className="block rounded-xs px-3 py-2 text-body-sm text-slate hover:bg-ink-soft hover:text-ink"
                      >
                        {action.label}
                      </Link>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={notifOpen}
                aria-label={`Notifications${newLeadCount ? ` (${newLeadCount} new)` : ""}`}
                onClick={() => setNotifOpen((v) => !v)}
                className="relative flex size-10 items-center justify-center rounded-xs border border-line text-slate transition-colors duration-(--duration-fast) hover:border-line-dark hover:text-ink"
              >
                <Bell size={17} strokeWidth={1.5} aria-hidden />
                {newLeadCount > 0 ? (
                  <span className="adm-pulse-cyan absolute top-2 right-2 size-2 rounded-full bg-accent" aria-hidden />
                ) : null}
              </button>
              <AnimatePresence>
                {notifOpen ? (
                  <motion.div
                    role="menu"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }}
                    transition={springMenu}
                    className="adm-card absolute right-0 z-40 mt-2 w-80 origin-top-right shadow-float"
                  >
                    <p className="border-b border-line px-4 py-3 text-mono-meta text-slate">
                      New leads {newLeadCount ? `(${newLeadCount})` : ""}
                    </p>
                    {notifications.length === 0 ? (
                      <p className="px-4 py-6 text-center text-body-sm text-mist">You&rsquo;re all caught up.</p>
                    ) : (
                      <ul className="max-h-80 overflow-y-auto p-1.5">
                        {notifications.map((n) => (
                          <li key={n.id}>
                            <Link href={n.href} className="block rounded-xs px-3 py-2.5 hover:bg-ink-soft">
                              <span className="block truncate text-body-sm text-ink">{n.title}</span>
                              <span className="block truncate text-mono-micro text-mist">{n.meta}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      href="/admin/enquiries"
                      className="block border-t border-line px-4 py-2.5 text-center text-body-sm text-accent hover:text-accent-hover"
                    >
                      View all enquiries
                    </Link>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Settings + status + avatar */}
            <Link
              href="/admin/settings"
              aria-label="Settings"
              className="hidden size-10 items-center justify-center rounded-xs border border-line text-slate transition-colors duration-(--duration-fast) hover:border-line-dark hover:text-ink sm:flex"
            >
              <Settings size={17} strokeWidth={1.5} aria-hidden />
            </Link>

            <div className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 xl:flex">
              <span className="adm-pulse size-1.5 rounded-full bg-success" aria-hidden />
              <span className="text-mono-micro text-slate">System live</span>
            </div>

            <span
              title={`${user.name} — ${user.email}`}
              className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#38bdf8] to-[#2563eb] text-[0.7rem] font-semibold text-[#04101f] sm:flex"
            >
              {initials}
            </span>
          </div>
        </header>

        <main id="admin-main" className="min-w-0 flex-1 p-4 md:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
