import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { getSettingDefs } from "@/lib/admin/setting-keys";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

export const metadata = { title: "Website content" };

/**
 * Editable website copy (hero, CTA, footer). Empty values fall back
 * to the code-level placeholders on the public site.
 */
export default async function AdminContentPage() {
  await requireAdminPage("EDITOR");
  const defs = getSettingDefs("content");
  const stored = await db.websiteSetting.findMany({ where: { group: "content" } });
  const valueOf = (key: string) =>
    String(stored.find((s) => s.key === key)?.value ?? "");

  return (
    <>
      <AdminPageHeader
        title="Website content"
        crumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Content" }]}
      />
      <AdminCard className="max-w-2xl" title="Homepage & footer copy">
        <SettingsForm
          group="content"
          fields={defs.map((def) => ({ ...def, value: valueOf(def.key) }))}
        />
      </AdminCard>
    </>
  );
}
