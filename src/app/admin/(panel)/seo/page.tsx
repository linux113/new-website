import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { getSettingDefs } from "@/lib/admin/setting-keys";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

export const metadata = { title: "SEO" };

/**
 * Site-wide SEO defaults. Per-product/category/blog SEO stays on
 * their own forms (normalized SeoMeta).
 */
export default async function AdminSeoPage() {
  await requireAdminPage("ADMIN");
  const defs = getSettingDefs("seo");
  const stored = await db.websiteSetting.findMany({ where: { group: "seo" } });
  const valueOf = (key: string) =>
    String(stored.find((s) => s.key === key)?.value ?? "");

  return (
    <>
      <AdminPageHeader
        title="SEO"
        crumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "SEO" }]}
      />
      <AdminCard className="max-w-2xl" title="Default & homepage metadata">
        <SettingsForm
          group="seo"
          fields={defs.map((def) => ({ ...def, value: valueOf(def.key) }))}
        />
      </AdminCard>
    </>
  );
}
