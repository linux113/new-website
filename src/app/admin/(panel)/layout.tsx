import { requireAdminPage } from "@/lib/auth/guard";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Authenticated admin shell. requireAdminPage() enforces the session
 * server-side for EVERY route in this group — middleware is only the
 * fast pre-filter.
 */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminPage("EDITOR");

  return (
    <AdminShell user={{ name: user.name, email: user.email, role: user.role }}>
      {children}
    </AdminShell>
  );
}
