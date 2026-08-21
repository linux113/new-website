import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { createProductAction } from "@/lib/admin/product-actions";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminCard, AdminEmptyState, AdminPageHeader } from "@/components/admin/ui";

export const metadata = { title: "New product" };

export default async function AdminProductNewPage() {
  await requireAdminPage("EDITOR");
  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });

  return (
    <>
      <AdminPageHeader
        title="New product"
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Products", href: "/admin/products" },
          { label: "New" },
        ]}
      />
      {categories.length === 0 ? (
        <AdminEmptyState
          title="Create a category first"
          description="Every product belongs to a category."
          action={
            <Link href="/admin/categories/new" className="text-body-sm text-accent underline-offset-2 hover:underline">
              New category →
            </Link>
          }
        />
      ) : (
        <AdminCard className="max-w-3xl">
          <ProductForm
            categories={categories}
            defaults={{}}
            action={createProductAction}
            submitLabel="Create product"
          />
        </AdminCard>
      )}
    </>
  );
}
