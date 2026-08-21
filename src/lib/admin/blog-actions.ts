"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { slugSchema } from "@/lib/validation";
import type { ActionState } from "./actions";

const idSchema = z.string().cuid();

const blogFormSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: slugSchema,
  excerpt: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().trim().max(500).optional(),
  ),
  content: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().max(200000).optional(),
  ),
  categoryId: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().cuid().optional(),
  ),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce.date().optional(),
  ),
});

function parseForm(formData: FormData) {
  return blogFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    categoryId: formData.get("categoryId"),
    status: formData.get("status") ?? "DRAFT",
    publishedAt: formData.get("publishedAt"),
  });
}

function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Publication invariant: PUBLISHED requires publishedAt (defaults to now). */
function normalizePublication<T extends { status: string; publishedAt?: Date }>(data: T): T {
  if (data.status === "PUBLISHED" && !data.publishedAt) {
    return { ...data, publishedAt: new Date() };
  }
  return data;
}

function revalidateBlog() {
  revalidatePath("/admin/blogs");
  revalidatePath("/");
}

export async function createBlogPostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdminAction("EDITOR");

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Fix the errors below.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const clash = await db.blogPost.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });
  if (clash) return { error: "Slug is already in use — choose another." };

  try {
    await db.blogPost.create({
      data: { ...normalizePublication(parsed.data), authorId: user.id },
    });
  } catch {
    return { error: "Could not save the post." };
  }

  revalidateBlog();
  redirect("/admin/blogs");
}

export async function updateBlogPostAction(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminAction("EDITOR");
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { error: "Invalid id." };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Fix the errors below.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const clash = await db.blogPost.findFirst({
    where: { slug: parsed.data.slug, id: { not: parsedId.data } },
    select: { id: true },
  });
  if (clash) return { error: "Slug is already in use — choose another." };

  try {
    await db.blogPost.update({
      where: { id: parsedId.data },
      data: normalizePublication(parsed.data),
    });
  } catch {
    return { error: "Could not save. The post may no longer exist." };
  }

  revalidateBlog();
  redirect("/admin/blogs");
}

export async function deleteBlogPostAction(id: string): Promise<ActionState> {
  await requireAdminAction("ADMIN");
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { error: "Invalid id." };

  try {
    await db.blogPost.delete({ where: { id: parsedId.data } });
  } catch {
    return { error: "Could not delete the post." };
  }

  revalidateBlog();
  return { success: true };
}
