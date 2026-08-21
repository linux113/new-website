"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Search } from "lucide-react";

/**
 * URL-driven search box for admin list pages (?q=…). Submits on
 * Enter; clearing navigates back to the unfiltered list.
 */
export function AdminSearch({ basePath, placeholder = "Search…" }: { basePath: string; placeholder?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? "";
    router.push(q ? `${basePath}?q=${encodeURIComponent(q)}` : basePath);
  };

  return (
    <form role="search" onSubmit={submit} className="relative">
      <Search
        size={16}
        strokeWidth={1.5}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate"
      />
      <input
        ref={inputRef}
        type="search"
        name="q"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-xs border border-line bg-paper-raised pr-3 pl-9 text-body-sm text-ink placeholder:text-mist focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent sm:w-72"
      />
    </form>
  );
}
