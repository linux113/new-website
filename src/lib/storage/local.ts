import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import type { PutObjectInput, PutObjectResult, StorageProvider } from "./types";

/**
 * Local filesystem provider — used when R2 credentials are absent so the
 * media workflow can be exercised end-to-end (development AND self-hosted
 * production such as a Hostinger VPS). Files land in public/uploads
 * (gitignored).
 *
 * IMPORTANT: Next.js does NOT serve files that are added to public/ after
 * `next build` — `next start` only serves the public assets that existed
 * at build time. So runtime uploads are served by the /uploads/[...path]
 * route handler (src/app/uploads/[...path]/route.ts), which reads from
 * this exact directory. Never rely on public/ static serving for files
 * written at runtime.
 */

export const UPLOAD_ROOT = join(process.cwd(), "public", "uploads");

/** Resolve a storage key to an absolute path that must stay inside UPLOAD_ROOT. */
export function resolveUploadPath(key: string): string {
  const filePath = resolve(UPLOAD_ROOT, key);
  const rootWithSep = UPLOAD_ROOT.endsWith(sep) ? UPLOAD_ROOT : UPLOAD_ROOT + sep;
  if (filePath !== UPLOAD_ROOT && !filePath.startsWith(rootWithSep)) {
    throw new Error("Invalid storage key");
  }
  return filePath;
}

export class LocalStorageProvider implements StorageProvider {
  readonly name = "local";

  async put(input: PutObjectInput): Promise<PutObjectResult> {
    const filePath = resolveUploadPath(input.key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, input.body);
    return {
      provider: this.name,
      key: input.key,
      publicUrl: `/uploads/${input.key}`,
    };
  }

  async delete(key: string): Promise<void> {
    try {
      await unlink(resolveUploadPath(key)).catch(() => undefined);
    } catch {
      /* invalid key — nothing to delete */
    }
  }
}
