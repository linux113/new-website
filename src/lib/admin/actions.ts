"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { isUploadFile, saveUploadedFile } from "@/lib/admin/upload-file";
import { buildEntitySchema, getEntity } from "./entities";

/**
 * Generic admin CRUD server actions (config-driven entities).
 * Every action: authenticate → authorize → validate → mutate →
 * revalidate. IDs are validated as cuid before any query (no IDOR
 * via malformed ids; ownership is global admin scope by design).
 */

export interface ActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
  mediaId?: string;
  publicUrl?: string;
}

const idSchema = z.string().cuid();

/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic model access over a closed registry */
function model(name: string): any {
  return (db as any)[name];
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function formToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$")) continue; // framework internals
    obj[key] = typeof value === "string" ? value : undefined;
  }
  return obj;
}

function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

async function checkUnique(
  segment: string,
  data: Record<string, unknown>,
  excludeId?: string,
): Promise<string | null> {
  const config = getEntity(segment);
  if (!config?.uniqueFields) return null;
  for (const field of config.uniqueFields) {
    const value = data[field];
    if (!value) continue;
    const existing = await model(config.model).findFirst({
      where: { [field]: value, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    });
    if (existing) return `${field} is already in use — choose another.`;
  }
  return null;
}

async function applyMediaUploads(
  segment: string,
  formData: FormData,
  data: Record<string, unknown>,
): Promise<string | null> {
  const config = getEntity(segment);
  if (!config) return null;
  for (const field of config.fields.filter((f) => f.kind === "media")) {
    const file = formData.get(`${field.name}File`);
    if (!isUploadFile(file)) continue;
    try {
      const saved = await saveUploadedFile(file);
      data[field.name] = saved.id;
    } catch (error) {
      return error instanceof Error ? error.message : "Image upload failed.";
    }
  }
  return null;
}

function revalidateAdmin(segment: string) {
  revalidatePath(`/admin/${segment}`);
  revalidatePath("/");
  if (segment === "categories") {
    revalidatePath("/products");
    revalidatePath("/products/[slug]", "page");
    revalidatePath("/products/category/[slug]", "page");
    revalidatePath("/sitemap.xml");
  }
  if (segment === "industries") revalidatePath("/industries");
  if (segment === "certifications") revalidatePath("/quality");
  if (segment === "infrastructure") revalidatePath("/manufacturing");
  if (segment === "global-reach") revalidatePath("/global-reach");
}

export async function createEntityAction(
  segment: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminAction("EDITOR");
  const config = getEntity(segment);
  if (!config) return { error: "Unknown entity." };

  const parsed = buildEntitySchema(config).safeParse(formToObject(formData));
  if (!parsed.success) {
    return { error: "Fix the errors below.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const uploadError = await applyMediaUploads(segment, formData, parsed.data);
  if (uploadError) return { error: uploadError };

  const uniqueError = await checkUnique(segment, parsed.data);
  if (uniqueError) return { error: uniqueError };

  try {
    await model(config.model).create({ data: parsed.data });
  } catch {
    return { error: "Could not save. Check the values and try again." };
  }

  revalidateAdmin(segment);
  redirect(`/admin/${segment}`);
}

export async function updateEntityAction(
  segment: string,
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminAction("EDITOR");
  const config = getEntity(segment);
  if (!config) return { error: "Unknown entity." };
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { error: "Invalid id." };

  const parsed = buildEntitySchema(config).safeParse(formToObject(formData));
  if (!parsed.success) {
    return { error: "Fix the errors below.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const uniqueError = await checkUnique(segment, parsed.data, parsedId.data);
  if (uniqueError) return { error: uniqueError };

  try {
    await model(config.model).update({ where: { id: parsedId.data }, data: parsed.data });
  } catch {
    return { error: "Could not save. The record may no longer exist." };
  }

  revalidateAdmin(segment);
  redirect(`/admin/${segment}`);
}

export async function deleteEntityAction(
  segment: string,
  id: string,
): Promise<ActionState> {
  await requireAdminAction("ADMIN"); // destructive → higher role
  const config = getEntity(segment);
  if (!config) return { error: "Unknown entity." };
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { error: "Invalid id." };

  if (config.deleteGuard) {
    const dependents = await model(config.deleteGuard.model).count({
      where: { [config.deleteGuard.foreignKey]: parsedId.data },
    });
    if (dependents > 0) return { error: config.deleteGuard.message };
  }

  try {
    await model(config.model).delete({ where: { id: parsedId.data } });
  } catch {
    return { error: "Could not delete. The record may be referenced elsewhere." };
  }

  revalidateAdmin(segment);
  return { success: true };
}
