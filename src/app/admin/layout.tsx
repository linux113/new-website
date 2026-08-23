import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — SRIYAAN Admin" },
  robots: { index: false, follow: false },
};

/**
 * Admin segment root. Deliberately minimal — authentication happens
 * per-page (requireAdminPage) because /admin/login must stay public.
 * The authenticated shell lives in (panel)/layout.tsx.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
