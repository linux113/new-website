"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Light/dark theme switch. Light is the default; the choice persists
 * in localStorage ("sm-theme") and is applied to <html data-theme>
 * before paint by the inline script in the root layout.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Deferred read (post-paint) — the inline layout script has already
    // applied the saved theme to <html> before hydration.
    const id = requestAnimationFrame(() =>
      setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("sm-theme", next);
    } catch {
      /* private mode — session-only theme */
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className={
        className ??
        "flex h-10 w-10 items-center justify-center rounded-xs border border-edge text-surface-fg transition-colors duration-(--duration-base) hover:bg-white/[0.06]"
      }
    >
      {theme === "light" ? (
        <Moon size={17} strokeWidth={1.8} aria-hidden />
      ) : (
        <Sun size={17} strokeWidth={1.8} aria-hidden />
      )}
    </button>
  );
}
