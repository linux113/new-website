"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Pageview on route change; heartbeat every 20s while the tab is visible. */

const HEARTBEAT_MS = 20_000;

function post(type: "pageview" | "heartbeat", path: string) {
  const body = JSON.stringify({
    type,
    path,
    referrer: typeof document !== "undefined" ? document.referrer : "",
  });
  const url = "/api/analytics/collect";
  try {
    if (type === "heartbeat" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) return;
    }
    void fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    });
  } catch {
    /* ignore */
  }
}

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    post("pageview", pathname);

    const beat = () => {
      if (document.visibilityState === "visible") post("heartbeat", pathname);
    };
    const timer = window.setInterval(beat, HEARTBEAT_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") beat();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [pathname]);

  return null;
}
