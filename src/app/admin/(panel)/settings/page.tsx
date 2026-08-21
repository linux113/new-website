import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { getSettingDefs } from "@/lib/admin/setting-keys";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

export const metadata = { title: "Settings" };

/**
 * Company contact information + social links. No secrets live here —
 * credentials/API keys are environment-only, never database rows.
 */
export default async function AdminSettingsPage() {
  await requireAdminPage("ADMIN");
  const [contactDefs, socialDefs] = [getSettingDefs("contact"), getSettingDefs("social")];
  const stored = await db.websiteSetting.findMany({
    where: { group: { in: ["contact", "social"] } },
  });
  const valueOf = (key: string) =>
    String(stored.find((s) => s.key === key)?.value ?? "");

  return (
    <>
      <AdminPageHeader
        title="Settings"
        crumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Settings" }]}
      />
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <AdminCard title="Contact information">
          <SettingsForm
            group="contact"
            fields={contactDefs.map((def) => ({ ...def, value: valueOf(def.key) }))}
          />
        </AdminCard>
        <AdminCard title="Social links">
          <SettingsForm
            group="social"
            fields={socialDefs.map((def) => ({ ...def, value: valueOf(def.key) }))}
          />
        </AdminCard>
      </div>
    </>
  );
}
