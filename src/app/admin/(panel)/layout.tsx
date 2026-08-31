import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { AdminShell, type ShellNotification } from "@/components/admin/AdminShell";

/**
 * Authenticated admin shell. requireAdminPage() enforces the session
 * server-side for EVERY route in this group — the edge proxy
 * (src/proxy.ts) is only the fast pre-filter. Also loads the live
 * "new lead" signal that powers the shell's notification bell and
 * sidebar badge.
 */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminPage("EDITOR");

  const [newEnquiries, newContacts, newVendors, latest] = await Promise.all([
    db.productEnquiry.count({ where: { status: "NEW" } }),
    db.contactMessage.count({ where: { status: "NEW" } }),
    db.vendorRequest.count({ where: { status: "NEW" } }),
    db.productEnquiry.findMany({
      where: { status: "NEW" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        company: true,
        createdAt: true,
        product: { select: { name: true } },
      },
    }),
  ]);

  const notifications: ShellNotification[] = latest.map((e) => ({
    id: e.id,
    title: `${e.name}${e.company ? ` — ${e.company}` : ""}`,
    meta: `${e.product?.name ?? "General enquiry"} · ${e.createdAt.toLocaleDateString("en-GB")}`,
    href: `/admin/enquiries/${e.id}`,
  }));

  return (
    <AdminShell
      user={{ name: user.name, email: user.email, role: user.role }}
      newLeadCount={newEnquiries + newContacts + newVendors}
      notifications={notifications}
    >
      {children}
    </AdminShell>
  );
}
