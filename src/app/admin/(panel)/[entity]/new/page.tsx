import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth/guard";
import { createEntityAction } from "@/lib/admin/actions";
import { getEntity } from "@/lib/admin/entities";
import { EntityForm } from "@/components/admin/EntityForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

export default async function EntityNewPage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { entity } = await params;
  const config = getEntity(entity);
  if (!config) notFound();

  return (
    <>
      <AdminPageHeader
        title={`New ${config.titleSingular.toLowerCase()}`}
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: config.titlePlural, href: `/admin/${config.segment}` },
          { label: "New" },
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
          defaults={{}}
          action={createEntityAction.bind(null, config.segment)}
          submitLabel={`Create ${config.titleSingular.toLowerCase()}`}
        />
      </AdminCard>
    </>
  );
}
