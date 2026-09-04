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

export async function saveSettingsAction(
  group: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
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
  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/about");
  return { success: true };
}

/** Media: update alt text / delete. Uploads live in media-actions.ts. */
const idSchema = z.string().cuid();

export async function updateMediaAltAction(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminAction("EDITOR");
  const parsedId = idSchema.safeParse(id);
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
