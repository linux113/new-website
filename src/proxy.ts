import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge proxy for /admin.
 * Cookie-shape check only — real auth is requireAdminPage /
 * requireAdminAction. /admin/login stays public.
 */

const COOKIE = "sm_admin_session";
const TOKEN_RE = /^[A-Za-z0-9_-]{32,128}$/;

function isLoginPath(pathname: string): boolean {
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

function noStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}

function isSandbox(): boolean {
  return process.env.PREVIEW_CROSS_SITE_COOKIES === "1" || process.env.E2B_SANDBOX === "true";
}

function clearSessionCookie(res: NextResponse): void {
  const crossSite = isSandbox();
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set(COOKIE, "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: crossSite ? "none" : "lax",
    secure: crossSite || isProd,
    partitioned: crossSite,
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (isLoginPath(pathname)) {
    return noStore(NextResponse.next());
  }

  const token = request.cookies.get(COOKIE)?.value ?? "";
  if (!TOKEN_RE.test(token)) {
    const login = new URL("/admin/login", request.url);
    const res = NextResponse.redirect(login);
    clearSessionCookie(res);
    return noStore(res);
  }

  return noStore(NextResponse.next());
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
