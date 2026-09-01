import { requireAdminPage } from "@/lib/auth/guard";
import { getAnalyticsSnapshot } from "@/lib/analytics/stats";
import { LiveTraffic } from "@/components/admin/dashboard/LiveTraffic";
import { AdminPageHeader } from "@/components/admin/ui";

export const metadata = { title: "Traffic" };
export const dynamic = "force-dynamic";

/** Live visitors, visits and pageviews by period. */
export default async function AdminAnalyticsPage() {
  await requireAdminPage("EDITOR");
  const snapshot = await getAnalyticsSnapshot();

  return (
    <div className="mx-auto flex max-w-[100rem] flex-col gap-6">
      <AdminPageHeader
        title="Traffic"
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Traffic" },
        ]}
      />
      <LiveTraffic initial={snapshot} variant="full" />
    </div>
  );
}
