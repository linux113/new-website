import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { updateProductAction } from "@/lib/admin/product-actions";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

export const metadata = { title: "Edit product" };

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        specifications: { orderBy: { sortOrder: "asc" } },
        applications: { orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" }, include: { media: true } },
      },
    }),
    db.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
  ]);
  if (!product) notFound();

  return (
    <>
      <AdminPageHeader
        title={product.name}
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Products", href: "/admin/products" },
          { label: "Edit" },
        ]}
      />
      <AdminCard className="max-w-3xl">
        <ProductForm
          categories={categories}
          defaults={{
            name: product.name,
            slug: product.slug,
            productCode: product.productCode ?? undefined,
            shortDescription: product.shortDescription ?? undefined,
            description: product.description ?? undefined,
            categoryId: product.categoryId,
            status: product.status,
            featured: product.featured,
            sortOrder: product.sortOrder,
            specifications: product.specifications.map((s) => ({
              name: s.name,
              value: s.value,
              unit: s.unit ?? undefined,
            })),
            applications: product.applications.map((a) => a.application).join("\n"),
            images: product.images.map((img) => ({
              id: img.id,
              url: img.media.publicUrl,
              filename: img.media.filename,
            })),
          }}
          action={updateProductAction.bind(null, product.id)}
          submitLabel="Save changes"
        />
      </AdminCard>
    </>
  );
}
