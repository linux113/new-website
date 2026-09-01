import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { AdminShell, type ShellNotification } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Authenticated admin shell. requireAdminPage() runs on every route
 * in this group. Also loads the new-lead count for the bell and badge.
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
