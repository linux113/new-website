import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge proxy — defense-in-depth for /admin.
 *
 * (Next.js 16: the former `middleware.ts` convention is deprecated in
 * favour of `proxy.ts` — this file is the migrated version.)
 *
 * Fast cookie-presence check only (no DB at the edge): requests to
 * /admin/* without a session cookie are redirected to login before
 * any page code runs. REAL authorization happens server-side in
 * every page (requireAdminPage) and every mutation
 * (requireAdminAction) — the proxy is an optimization, never the
 * only gate.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const hasCookie = request.cookies.has("sm_admin_session");
    if (!hasCookie) {
      const login = new URL("/admin/login", request.url);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
