"use client";

import { useActionState } from "react";
import { updateMediaAltAction } from "@/lib/admin/settings-actions";
import type { ActionState } from "@/lib/admin/actions";

/** Inline alt-text editor for a media asset. */
export function MediaAltForm({ id, altText }: { id: string; altText: string }) {
  const [state, formAction, pending] = useActionState(
    updateMediaAltAction,
    {} as ActionState,
  );

  return (
    <form action={formAction} className="flex items-center gap-1.5">
      <input type="hidden" name="__id" value={id} />
      <label className="sr-only" htmlFor={`alt-${id}`}>
        Alt text
      </label>
      <input
        id={`alt-${id}`}
        name="altText"
        defaultValue={altText}
        placeholder="Alt text…"
        className="h-8 w-full min-w-0 rounded-xs border border-line bg-paper-sunken px-2 text-body-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="h-8 shrink-0 rounded-xs border border-line px-2 text-mono-micro text-slate hover:text-ink disabled:opacity-50"
      >
        {pending ? "…" : state.success ? "✓" : "Save"}
      </button>
    </form>
  );
}
