"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { contentStatusSchema, slugSchema } from "@/lib/validation";
import { isUploadFile, saveUploadedFile } from "@/lib/admin/upload-file";
import type { ActionState } from "./actions";

/**
 * Product CRUD server actions (bespoke — child collections).
 * Auth → validate → unique checks → transactional write → revalidate.
 */

const idSchema = z.string().cuid();

const specRowSchema = z.object({
  name: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(500),
  unit: z.string().trim().max(30).optional(),
});

const productFormSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: slugSchema,
  productCode: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().trim().max(60).optional(),
  ),
  shortDescription: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().trim().max(300).optional(),
  ),
  description: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().trim().max(20000).optional(),
  ),
  categoryId: z.string().cuid(),
  status: contentStatusSchema.default("DRAFT"),
  featured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

function parseProductForm(formData: FormData) {
  const base = productFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    productCode: formData.get("productCode"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    status: formData.get("status") ?? "DRAFT",
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    sortOrder: formData.get("sortOrder") ?? 0,
  });
  if (!base.success) return base;

  // Specifications arrive as JSON from the dynamic rows editor.
  const specsRaw = formData.get("specifications");
  let specifications: z.infer<typeof specRowSchema>[] = [];
  if (typeof specsRaw === "string" && specsRaw.trim()) {
    const parsed = z.array(specRowSchema).max(100).safeParse(JSON.parse(specsRaw));
    if (!parsed.success) {
      return {
        success: false as const,
        error: new z.ZodError([
          { code: "custom", message: "Invalid specification rows", path: ["specifications"], input: specsRaw },
        ]),
      };
    }
    specifications = parsed.data;
  }

  // Applications arrive one-per-line.
  const applicationsRaw = String(formData.get("applications") ?? "");
  const applications = applicationsRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);

  return {
    success: true as const,
    data: { ...base.data, specifications, applications },
  };
}

async function slugOrCodeTaken(
  slug: string,
  productCode: string | undefined,
  excludeId?: string,
): Promise<string | null> {
  const clash = await db.product.findFirst({
    where: {
      OR: [{ slug }, ...(productCode ? [{ productCode }] : [])],
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { slug: true, productCode: true },
  });
  if (!clash) return null;
  return clash.slug === slug
    ? "Slug is already in use — choose another."
    : "Product code is already in use — choose another.";
}

function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

async function syncProductImages(productId: string, formData: FormData, isUpdate: boolean) {
  if (isUpdate) {
    const keep = formData
      .getAll("keepImageIds")
      .filter((v): v is string => typeof v === "string" && v.length > 0);
    await db.productImage.deleteMany({
      where: { productId, id: { notIn: keep } },
    });
  }

  const files = formData.getAll("images").filter(isUploadFile);
  const existing = await db.productImage.count({ where: { productId } });
  let order = existing;
  for (const file of files) {
    const saved = await saveUploadedFile(file);
    await db.productImage.create({
      data: { productId, mediaId: saved.id, sortOrder: order++ },
    });
  }
}

function revalidateProducts() {
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/products/[slug]/[product]", "page");
  revalidatePath("/products/category/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

export async function createProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminAction("EDITOR");

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: "Fix the errors below.", fieldErrors: zodFieldErrors(parsed.error) };
  }
  const { specifications, applications, ...data } = parsed.data;

  const taken = await slugOrCodeTaken(data.slug, data.productCode);
  if (taken) return { error: taken };

  try {
    const product = await db.product.create({
      data: {
        ...data,
        specifications: {
          create: specifications.map((spec, i) => ({ ...spec, sortOrder: i })),
        },
        applications: {
          create: applications.map((application, i) => ({ application, sortOrder: i })),
        },
      },
    });
    await syncProductImages(product.id, formData, false);
  } catch (error) {
    console.error("[product] save failed:", error instanceof Error ? error.message : error);
    return {
      error:
        error instanceof Error && error.message.includes("Unsupported")
          ? error.message
          : "Could not save the product. Check the category and try again.",
    };
  }

  revalidateProducts();
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminAction("EDITOR");
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { error: "Invalid id." };

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: "Fix the errors below.", fieldErrors: zodFieldErrors(parsed.error) };
  }
  const { specifications, applications, ...data } = parsed.data;

  const taken = await slugOrCodeTaken(data.slug, data.productCode, parsedId.data);
  if (taken) return { error: taken };

  try {
    await db.$transaction([
      db.product.update({ where: { id: parsedId.data }, data }),
      db.productSpecification.deleteMany({ where: { productId: parsedId.data } }),
      db.productSpecification.createMany({
        data: specifications.map((spec, i) => ({
          ...spec,
          productId: parsedId.data,
          sortOrder: i,
        })),
      }),
      db.productApplication.deleteMany({ where: { productId: parsedId.data } }),
      db.productApplication.createMany({
        data: applications.map((application, i) => ({
          application,
          productId: parsedId.data,
          sortOrder: i,
        })),
      }),
    ]);
    await syncProductImages(parsedId.data, formData, true);
  } catch (error) {
    console.error("[product] save failed:", error instanceof Error ? error.message : error);
    return {
      error:
        error instanceof Error && /too large|Unsupported|File contents/i.test(error.message)
          ? error.message
          : "Could not save. The product may no longer exist.",
    };
  }

  revalidateProducts();
  redirect("/admin/products");
}

export async function deleteProductAction(id: string): Promise<ActionState> {
  await requireAdminAction("ADMIN");
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { error: "Invalid id." };

  try {
    await db.product.delete({ where: { id: parsedId.data } });
  } catch {
    return { error: "Could not delete the product." };
  }

  revalidateProducts();
  return { success: true };
}
