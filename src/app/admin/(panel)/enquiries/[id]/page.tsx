import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

export const metadata = { title: "Enquiry" };

export default async function AdminEnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { id } = await params;

  const enquiry = await db.productEnquiry.findUnique({
    where: { id },
    include: { product: { select: { id: true, name: true, slug: true } } },
  });
  if (!enquiry) notFound();

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Name", value: enquiry.name },
    { label: "Company", value: enquiry.company ?? "—" },
    {
      label: "Email",
      value: (
        <a href={`mailto:${enquiry.email}`} className="text-accent hover:underline">
          {enquiry.email}
        </a>
      ),
    },
    {
      label: "Phone",
      value: enquiry.phone ? (
        <a href={`tel:${enquiry.phone}`} className="text-accent hover:underline">
          {enquiry.phone}
        </a>
      ) : (
        "—"
      ),
    },
    { label: "WhatsApp", value: enquiry.whatsapp ?? "—" },
    {
      label: "Product",
      value: enquiry.product ? (
        <Link href={`/admin/products/${enquiry.product.id}/edit`} className="text-accent hover:underline">
          {enquiry.product.name}
        </Link>
      ) : (
        "General enquiry"
      ),
    },
    { label: "Requirement", value: enquiry.requirement ?? "—" },
    { label: "Source", value: enquiry.source },
    {
      label: "Received",
      value: enquiry.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title={`Enquiry — ${enquiry.name}`}
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Enquiries", href: "/admin/enquiries" },
          { label: enquiry.name },
        ]}
        actions={<LeadStatusSelect kind="enquiry" id={enquiry.id} status={enquiry.status} />}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminCard title="Contact details">
          <dl className="flex flex-col divide-y divide-(--color-line)">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-mono-micro pt-0.5 text-slate">{row.label}</dt>
                <dd className="text-body-sm break-words text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </AdminCard>

        <AdminCard title="Message">
          <p className="text-body whitespace-pre-wrap text-ink">{enquiry.message}</p>
        </AdminCard>
      </div>
    </>
  );
}
