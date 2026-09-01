import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isBotUserAgent } from "@/lib/analytics/bots";
import { resolveAnalyticsIdentity } from "@/lib/analytics/identity";
import { allowCollect } from "@/lib/analytics/rate-limit";
import { sanitizePath, sanitizeReferrer } from "@/lib/analytics/sanitize";
import { dayKeyInIST } from "@/lib/analytics/windows";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public collector: pageview or heartbeat. No IP or user-agent stored. */

const STALE_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent");
  if (isBotUserAgent(ua)) {
    return new NextResponse(null, { status: 204 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  if (!allowCollect(ip)) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      body = JSON.parse(await request.text());
    }
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const rec = body as { type?: unknown; path?: unknown; referrer?: unknown };
  const type = rec.type === "heartbeat" ? "heartbeat" : rec.type === "pageview" ? "pageview" : null;
  if (!type) return NextResponse.json({ error: "invalid type" }, { status: 400 });

  const path = sanitizePath(rec.path);
  if (!path) return new NextResponse(null, { status: 204 });

  const { visitorId, sessionId } = await resolveAnalyticsIdentity();
  const now = new Date();

  try {
    await db.visitorPresence.upsert({
      where: { sessionId },
      create: {
        sessionId,
        visitorId,
        path,
        lastSeenAt: now,
        startedAt: now,
      },
      update: { visitorId, path, lastSeenAt: now },
    });

    if (type === "pageview") {
      await db.pageView.create({
        data: {
          visitorId,
          sessionId,
          path,
          referrer: sanitizeReferrer(rec.referrer),
          dayKey: dayKeyInIST(now),
        },
      });
    }

    if (Math.random() < 0.03) {
      await db.visitorPresence.deleteMany({
        where: { lastSeenAt: { lt: new Date(now.getTime() - STALE_MS) } },
      });
    }
  } catch {
    // analytics must not take the public site down
  }

  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  return new NextResponse(null, { status: 405 });
}
