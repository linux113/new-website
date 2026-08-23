import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { PutObjectInput, PutObjectResult, StorageProvider } from "./types";

/**
 * Local filesystem provider — DEVELOPMENT FALLBACK ONLY.
 * Used when R2 credentials are absent so the media workflow can be
 * exercised end-to-end. Files land in public/uploads (gitignored).
 * Never intended for production (documented in docs/API.md).
 */

const UPLOAD_ROOT = join(process.cwd(), "public", "uploads");

export class LocalStorageProvider implements StorageProvider {
  readonly name = "local";

  async put(input: PutObjectInput): Promise<PutObjectResult> {
    const filePath = join(UPLOAD_ROOT, input.key);
    // Defense-in-depth: resolved path must stay inside the upload root.
    if (!filePath.startsWith(UPLOAD_ROOT)) {
      throw new Error("Invalid storage key");
    }
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, input.body);
    return {
      provider: this.name,
      key: input.key,
      publicUrl: `/uploads/${input.key}`,
    };
  }

  async delete(key: string): Promise<void> {
    const filePath = join(UPLOAD_ROOT, key);
    if (!filePath.startsWith(UPLOAD_ROOT)) return;
    await unlink(filePath).catch(() => undefined);
  }
}
