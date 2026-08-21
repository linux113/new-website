import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

export const metadata = { title: "Vendor request" };

export default async function AdminVendorRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { id } = await params;

  const request = await db.vendorRequest.findUnique({ where: { id } });
  if (!request) notFound();

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Company", value: request.company },
    { label: "Contact", value: request.name },
    {
      label: "Email",
      value: (
        <a href={`mailto:${request.email}`} className="text-accent hover:underline">
          {request.email}
        </a>
      ),
    },
    { label: "Phone", value: request.phone ?? "—" },
    { label: "WhatsApp", value: request.whatsapp ?? "—" },
    { label: "Source", value: request.source },
    {
      label: "Received",
      value: request.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title={`Vendor — ${request.company}`}
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Vendor requests", href: "/admin/vendor-requests" },
          { label: request.company },
        ]}
        actions={<LeadStatusSelect kind="vendor" id={request.id} status={request.status} />}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminCard title="Company details">
          <dl className="flex flex-col divide-y divide-(--color-line)">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-mono-micro pt-0.5 text-slate">{row.label}</dt>
                <dd className="text-body-sm break-words text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </AdminCard>

        <div className="flex flex-col gap-6">
          <AdminCard title="Offering">
            <p className="text-body whitespace-pre-wrap text-ink">{request.offering}</p>
          </AdminCard>
          {request.message ? (
            <AdminCard title="Message">
              <p className="text-body whitespace-pre-wrap text-ink">{request.message}</p>
            </AdminCard>
          ) : null}
        </div>
      </div>
    </>
  );
}
