import "server-only";
import { randomBytes } from "node:crypto";
import { LocalStorageProvider } from "./local";
import { r2FromEnv } from "./r2";
import type { StorageProvider } from "./types";

/**
 * Storage facade. R2 when configured, local filesystem fallback in
 * development. Consumers call getStorage()/makeObjectKey() and never
 * touch provider internals.
 */

let cached: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (cached) return cached;
  const r2 = r2FromEnv();
  if (r2) {
    cached = r2;
  } else {
    if (process.env.NODE_ENV === "production") {
      // Explicit: never silently write to local disk in production.
      throw new Error(
        "Storage is not configured. Set R2_* environment variables.",
      );
    }
    cached = new LocalStorageProvider();
  }
  return cached;
}

export function isStorageConfigured(): boolean {
  return r2FromEnv() !== null || process.env.NODE_ENV !== "production";
}

/**
 * Safe, unique object key: media/<yyyy>/<mm>/<random>.<ext>
 * The extension comes from the validated MIME type (never from the
 * user-supplied filename), so keys are always inert.
 */
export function makeObjectKey(extension: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = randomBytes(12).toString("hex");
  return `media/${year}/${month}/${random}.${extension}`;
}
