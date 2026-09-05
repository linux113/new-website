"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { isSettingKey, SETTING_KEYS } from "./setting-keys";
import type { ActionState } from "./actions";

/**
 * Website settings / content / SEO mutations.
 * All values live in WebsiteSetting (key → JSON value, grouped).
 * Only whitelisted keys (setting-keys.ts) are writable.
 */

const valueSchema = z.string().max(5000);

/**
 * Public pages that render admin-managed settings (contact details, hero and
 * CTA copy, footer text, SEO metadata) and therefore need refreshing on save.
 */
const PUBLIC_SETTING_PATHS = [
  "/",
  "/contact",
  "/about",
  "/products",
  "/quality",
  "/industries",
  "/manufacturing",
  "/global-reach",
  "/enquiry",
  "/vendor",
  "/blog",
] as const;

/**
 * The settings group is carried in a hidden `__group` field rather than
 * bound with `.bind()`. Binding an argument to a server action referenced
 * from a client component makes the action response never finish streaming,
 * so the admin "Save" button spins forever even though the write commits.
 */
export async function saveSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const group = String(formData.get("__group") ?? "");
  if (!group) return { error: "Missing settings group." };
  await requireAdminAction(group === "content" ? "EDITOR" : "ADMIN");

  const entries: { key: string; value: string }[] = [];
  for (const [key, raw] of formData.entries()) {
    if (!isSettingKey(key)) continue; // whitelist only
    if (SETTING_KEYS[key].group !== group) continue;
    const parsed = valueSchema.safeParse(raw);
    if (!parsed.success) return { error: `Value for ${key} is too long.` };
    entries.push({ key, value: parsed.data });
  }
  if (entries.length === 0) return { error: "Nothing to save." };

  try {
    await db.$transaction(
      entries.map(({ key, value }) =>
        db.websiteSetting.upsert({
          where: { key },
          create: { key, value, group: SETTING_KEYS[key].group },
          update: { value },
        }),
      ),
    );
  } catch {
    return { error: "Could not save settings." };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/admin/content");
  revalidatePath("/admin/seo");
  // Settings feed the header/footer, so every public page that surfaces them
  // is refreshed explicitly.
  for (const path of PUBLIC_SETTING_PATHS) revalidatePath(path);
  return { success: true };
}

/** Media: update alt text / delete. Uploads live in media-actions.ts. */
const idSchema = z.string().cuid();

export async function updateMediaAltAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminAction("EDITOR");
  const parsedId = idSchema.safeParse(String(formData.get("__id") ?? ""));
  if (!parsedId.success) return { error: "Invalid id." };
  const alt = z.string().max(300).safeParse(formData.get("altText") ?? "");
  if (!alt.success) return { error: "Alt text too long." };

  try {
    await db.mediaAsset.update({
      where: { id: parsedId.data },
      data: { altText: alt.data },
    });
  } catch {
    return { error: "Could not update." };
  }
  revalidatePath("/admin/media");
  return { success: true };
}

export async function deleteMediaAction(id: string): Promise<ActionState> {
  await requireAdminAction("ADMIN");
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { error: "Invalid id." };

  const asset = await db.mediaAsset.findUnique({ where: { id: parsedId.data } });
  if (!asset) return { error: "Asset not found." };

  try {
    await db.mediaAsset.delete({ where: { id: parsedId.data } });
  } catch {
    return {
      error:
        "Could not delete — this asset is still referenced by products, posts or content.",
    };
  }

  // Remove the stored object after the DB row (references now gone).
  try {
    const { getStorage } = await import("@/lib/storage/storage");
    await getStorage().delete(asset.storageKey);
  } catch (error) {
    console.error("[media] object delete failed:", error instanceof Error ? error.message : error);
    // DB row is gone; orphaned object is logged for manual cleanup.
  }

  revalidatePath("/admin/media");
  return { success: true };
}
