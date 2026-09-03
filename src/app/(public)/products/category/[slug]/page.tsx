import { redirect } from "next/navigation";
import { getSeoCategory } from "@/content/seo-catalog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Legacy /products/category/:slug → /products/:slug */
export default async function LegacyCategoryRedirect({ params }: PageProps) {
  const { slug } = await params;
  const cat = getSeoCategory(slug);
  redirect(`/products/${cat?.slug ?? slug}`);
}
