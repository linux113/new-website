/** Validate tracker payloads — reject admin/API paths and open URLs. */

export function sanitizePath(input: unknown): string | null {
  if (typeof input !== "string") return null;
  let path = input.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) return null;
  path = path.split("?")[0]?.split("#")[0] ?? "";
  if (path.length > 200) path = path.slice(0, 200);
  if (!path.startsWith("/")) return null;
  if (path.startsWith("/admin") || path.startsWith("/api")) return null;
  return path || "/";
}

export function sanitizeReferrer(input: unknown): string | null {
  if (typeof input !== "string" || !input.trim()) return null;
  try {
    const url = new URL(input);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return `${url.origin}${url.pathname}`.slice(0, 300);
  } catch {
    return null;
  }
}
