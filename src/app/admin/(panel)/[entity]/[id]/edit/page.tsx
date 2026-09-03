import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { updateEntityAction } from "@/lib/admin/actions";
import { getEntity } from "@/lib/admin/entities";
import { EntityForm } from "@/components/admin/EntityForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic model access over a closed registry */

export default async function EntityEditPage({
  params,
}: {
  params: Promise<{ entity: string; id: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { entity, id } = await params;
  const config = getEntity(entity);
  if (!config) notFound();

  const record = await (db as any)[config.model].findUnique({ where: { id } });
  if (!record) notFound();

  const defaults: Record<string, string | number | boolean | null> = {};
  const mediaUrls: Record<string, string | null> = {};
  for (const field of config.fields) {
    const value = record[field.name];
    defaults[field.name] =
      value instanceof Date ? value.toISOString() : (value ?? null);
    if (field.kind === "media" && typeof value === "string" && value) {
      const asset = await db.mediaAsset.findUnique({
        where: { id: value },
        select: { publicUrl: true },
      });
      mediaUrls[field.name] = asset?.publicUrl ?? null;
    }
  }
  if (config.hasStatus) defaults.status = record.status;
  if (config.hasSortOrder) defaults.sortOrder = record.sortOrder;

  return (
    <>
      <AdminPageHeader
        title={`Edit ${config.titleSingular.toLowerCase()}`}
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: config.titlePlural, href: `/admin/${config.segment}` },
          { label: "Edit" },
        ]}
      />
      <AdminCard className="max-w-2xl">
        <EntityForm
          fields={config.fields.map(({ name, label, kind, required, help, sourceField }) => ({
            name,
            label,
            kind,
            required,
            help,
            sourceField,
          }))}
          hasStatus={config.hasStatus}
          hasSortOrder={config.hasSortOrder}
          defaults={defaults}
          mediaUrls={mediaUrls}
          action={updateEntityAction.bind(null, config.segment, id)}
          submitLabel="Save changes"
        />
      </AdminCard>
    </>
  );
}
