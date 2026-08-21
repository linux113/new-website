import Link from "next/link";
import { db } from "@/lib/db";
import { AdminCard, AdminPageHeader, AdminStatusBadge } from "@/components/admin/ui";

export const metadata = { title: "Dashboard" };

/**
 * Dashboard — real database counts only, no fake statistics.
 */
export default async function AdminDashboardPage() {
  const [
    products,
    categories,
    blogPosts,
    enquiries,
    contactMessages,
    vendorRequests,
    customers,
    enquiryByStatus,
    recentEnquiries,
    recentPosts,
  ] = await Promise.all([
    db.product.count(),
    db.category.count(),
    db.blogPost.count(),
    db.productEnquiry.count(),
    db.contactMessage.count(),
    db.vendorRequest.count(),
    db.customer.count(),
    db.productEnquiry.groupBy({ by: ["status"], _count: { _all: true } }),
    db.productEnquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { product: { select: { name: true } } },
    }),
    db.blogPost.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, status: true, updatedAt: true },
    }),
  ]);

  const statusCount = (status: string) =>
    enquiryByStatus.find((row) => row.status === status)?._count._all ?? 0;

  const cards = [
    { label: "Products", value: products, href: "/admin/products" },
    { label: "Categories", value: categories, href: "/admin/categories" },
    { label: "Blog posts", value: blogPosts, href: "/admin/blogs" },
    { label: "Product enquiries", value: enquiries, href: "/admin/enquiries" },
    { label: "Contact messages", value: contactMessages, href: "/admin/enquiries" },
    { label: "Vendor requests", value: vendorRequests, href: "/admin/vendor-requests" },
    { label: "Customers", value: customers, href: "/admin/customers" },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" />

      {/* Counts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border border-line bg-paper-raised p-4 transition-colors duration-(--duration-fast) hover:border-steel"
          >
            <p className="text-stat text-ink tabular-nums">{card.value}</p>
            <p className="mt-1 text-mono-micro text-slate">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Enquiry pipeline */}
        <AdminCard title="Enquiry pipeline">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["NEW", "IN_PROGRESS", "CONTACTED", "CLOSED"] as const).map((status) => (
              <div key={status} className="border border-line p-3">
                <dt>
                  <AdminStatusBadge status={status} />
                </dt>
                <dd className="mt-2 text-display-md text-ink tabular-nums">
                  {statusCount(status)}
                </dd>
              </div>
            ))}
          </dl>
        </AdminCard>

        {/* Recent activity */}
        <AdminCard title="Recent enquiries">
          {recentEnquiries.length === 0 ? (
            <p className="text-body-sm text-slate">No enquiries yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-(--color-line)">
              {recentEnquiries.map((enquiry) => (
                <li key={enquiry.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link
                    href={`/admin/enquiries/${enquiry.id}`}
                    className="min-w-0 truncate text-body-sm text-ink hover:text-accent"
                  >
                    {enquiry.name}
                    {enquiry.product ? (
                      <span className="text-slate"> — {enquiry.product.name}</span>
                    ) : null}
                  </Link>
                  <AdminStatusBadge status={enquiry.status} />
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        {/* Recent posts */}
        <AdminCard title="Recently edited posts" className="xl:col-span-2">
          {recentPosts.length === 0 ? (
            <p className="text-body-sm text-slate">No posts yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-(--color-line)">
              {recentPosts.map((post) => (
                <li key={post.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link
                    href={`/admin/blogs/${post.id}/edit`}
                    className="min-w-0 truncate text-body-sm text-ink hover:text-accent"
                  >
                    {post.title}
                  </Link>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-mono-micro text-slate">
                      {post.updatedAt.toLocaleDateString("en-GB")}
                    </span>
                    <AdminStatusBadge status={post.status} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </>
  );
}
