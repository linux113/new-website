import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { resolveUploadPath } from "@/lib/storage/local";

/**
 * Serves files written by the local storage provider.
 *
 * Next.js does NOT serve files that are added to public/ after
 * `next build`, so runtime uploads would 404 in production even though
 * they were written to disk. This route handler reads from the same
 * directory the LocalStorageProvider writes to, so uploads work
 * identically in dev and `next start`.
 */

/** Content types for the whitelisted upload extensions. */
const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await ctx.params;
  const key = path.join("/");
  const contentType = CONTENT_TYPES[extname(key).toLowerCase()];
  if (!contentType) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const filePath = resolveUploadPath(key);
    const body = await readFile(filePath);
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(body.length),
        // Keys are random and immutable, so cache hard.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
