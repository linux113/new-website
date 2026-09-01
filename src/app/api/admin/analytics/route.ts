import { NextResponse } from "next/server";
import { requireAdminAction } from "@/lib/auth/guard";
import { getAnalyticsSnapshot } from "@/lib/analytics/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Authenticated live snapshot for the admin traffic widgets. */
export async function GET() {
  try {
    await requireAdminAction("EDITOR");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await getAnalyticsSnapshot();
  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "no-store, private" },
  });
}
