"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { getStorage, makeObjectKey } from "@/lib/storage/storage";
import type { ActionState } from "./actions";

/**
 * Media upload server action.
 * Validation: size cap, MIME whitelist, extension derived from MIME,
 * and magic-byte sniffing — the filename is never trusted.
 */

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

/** MIME → { extension, magic-byte checker } */
const ALLOWED: Record<
  string,
  { ext: string; type: "IMAGE" | "DOCUMENT"; check: (b: Buffer) => boolean }
> = {
  "image/jpeg": {
    ext: "jpg",
    type: "IMAGE",
    check: (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  "image/png": {
    ext: "png",
    type: "IMAGE",
    check: (b) =>
      b.length > 8 &&
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  "image/webp": {
    ext: "webp",
    type: "IMAGE",
    check: (b) =>
      b.length > 12 &&
      b.toString("ascii", 0, 4) === "RIFF" &&
      b.toString("ascii", 8, 12) === "WEBP",
  },
  "image/avif": {
    ext: "avif",
    type: "IMAGE",
    check: (b) => b.length > 12 && b.toString("ascii", 4, 8) === "ftyp",
  },
  "application/pdf": {
    ext: "pdf",
    type: "DOCUMENT",
    check: (b) => b.length > 4 && b.toString("ascii", 0, 4) === "%PDF",
  },
};

/** Minimal dimension sniffing for PNG/JPEG (no image library). */
function sniffDimensions(mime: string, b: Buffer): { width: number | null; height: number | null } {
  try {
    if (mime === "image/png" && b.length > 24) {
      return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    }
    if (mime === "image/jpeg") {
      let offset = 2;
      while (offset + 9 < b.length) {
        if (b[offset] !== 0xff) break;
        const marker = b[offset + 1];
        const size = b.readUInt16BE(offset + 2);
        // SOF0–SOF15 (except DHT/DAC/RST)
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return { height: b.readUInt16BE(offset + 5), width: b.readUInt16BE(offset + 7) };
        }
        offset += 2 + size;
      }
    }
  } catch {
    /* dimensions are optional */
  }
  return { width: null, height: null };
}

export async function uploadMediaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminAction("EDITOR");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "File is too large (max 10 MB)." };
  }

  const rule = ALLOWED[file.type];
  if (!rule) {
    return { error: "Unsupported file type. Allowed: JPEG, PNG, WebP, AVIF, PDF." };
  }

  const body = Buffer.from(await file.arrayBuffer());
  if (!rule.check(body)) {
    return { error: "File contents do not match the declared type." };
  }

  const altText = String(formData.get("altText") ?? "").slice(0, 300);
  const key = makeObjectKey(rule.ext);

  let stored;
  try {
    stored = await getStorage().put({ key, body, contentType: file.type });
  } catch (error) {
    console.error("[media] upload failed:", error instanceof Error ? error.message : error);
    return { error: "Upload failed. Check storage configuration and try again." };
  }

  const { width, height } = sniffDimensions(file.type, body);

  try {
    await db.mediaAsset.create({
      data: {
        storageProvider: stored.provider,
        storageKey: stored.key,
        publicUrl: stored.publicUrl,
        filename: file.name.slice(0, 200) || `upload.${rule.ext}`,
        mimeType: file.type,
        type: rule.type,
        width,
        height,
        size: file.size,
        altText: altText || null,
      },
    });
  } catch (error) {
    // DB failed after storage write — clean up the orphan object.
    await getStorage().delete(stored.key).catch(() => undefined);
    console.error("[media] record failed:", error instanceof Error ? error.message : error);
    return { error: "Could not save the media record." };
  }

  revalidatePath("/admin/media");
  return { success: true };
}
