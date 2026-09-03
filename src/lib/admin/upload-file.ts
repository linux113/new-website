import "server-only";
import { db } from "@/lib/db";
import { getStorage, makeObjectKey } from "@/lib/storage/storage";

const MAX_BYTES = 10 * 1024 * 1024;

type AssetType = "IMAGE" | "DOCUMENT";

const ALLOWED: Record<
  string,
  { ext: string; type: AssetType; check: (b: Buffer) => boolean }
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
      b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  "image/webp": {
    ext: "webp",
    type: "IMAGE",
    check: (b) =>
      b.length > 12 &&
      b.toString("ascii", 0, 4) === "RIFF" &&
      b.toString("ascii", 8, 12) === "WEBP",
  },
  "image/gif": {
    ext: "gif",
    type: "IMAGE",
    check: (b) => b.length > 6 && b.toString("ascii", 0, 3) === "GIF",
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

const ALIAS: Record<string, string> = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/x-png": "image/png",
};

export function isUploadFile(value: unknown): value is File {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as File).arrayBuffer === "function" &&
    typeof (value as File).size === "number" &&
    (value as File).size > 0
  );
}

function sniffMime(body: Buffer, declared: string): string | null {
  const normalized = ALIAS[declared] ?? declared;
  for (const [mime, rule] of Object.entries(ALLOWED)) {
    if (rule.check(body)) return mime;
  }
  if (normalized && ALLOWED[normalized]) return normalized;
  return null;
}

function sniffDimensions(mime: string, b: Buffer): { width: number | null; height: number | null } {
  try {
    if (mime === "image/png" && b.length > 24) {
      return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    }
    if (mime === "image/gif" && b.length > 10) {
      return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
    }
    if (mime === "image/jpeg") {
      let offset = 2;
      while (offset + 9 < b.length) {
        if (b[offset] !== 0xff) break;
        const marker = b[offset + 1];
        const size = b.readUInt16BE(offset + 2);
        if (
          marker >= 0xc0 &&
          marker <= 0xcf &&
          marker !== 0xc4 &&
          marker !== 0xc8 &&
          marker !== 0xcc
        ) {
          return { height: b.readUInt16BE(offset + 5), width: b.readUInt16BE(offset + 7) };
        }
        offset += 2 + size;
      }
    }
  } catch {
    /* optional */
  }
  return { width: null, height: null };
}

export async function saveUploadedFile(
  file: File,
  altText = "",
): Promise<{ id: string; publicUrl: string | null }> {
  if (file.size > MAX_BYTES) {
    throw new Error("File is too large (max 10 MB).");
  }

  const body = Buffer.from(await file.arrayBuffer());
  const mime = sniffMime(body, file.type || "");
  if (!mime) {
    throw new Error("Unsupported file type. Use JPEG, PNG, WebP, GIF, AVIF or PDF.");
  }
  const rule = ALLOWED[mime];
  if (!rule.check(body)) {
    throw new Error("File contents do not match a supported image or PDF.");
  }

  const key = makeObjectKey(rule.ext);
  const stored = await getStorage().put({ key, body, contentType: mime });
  const { width, height } = sniffDimensions(mime, body);

  try {
    const row = await db.mediaAsset.create({
      data: {
        storageProvider: stored.provider,
        storageKey: stored.key,
        publicUrl: stored.publicUrl,
        filename: (file.name || `upload.${rule.ext}`).slice(0, 200),
        mimeType: mime,
        type: rule.type,
        width,
        height,
        size: file.size,
        altText: altText.trim().slice(0, 300) || null,
      },
    });
    return { id: row.id, publicUrl: row.publicUrl };
  } catch (error) {
    await getStorage().delete(stored.key).catch(() => undefined);
    throw error;
  }
}
