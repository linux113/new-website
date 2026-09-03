"use client";

import { useActionState, useRef } from "react";
import { Upload } from "lucide-react";
import { uploadMediaAction } from "@/lib/admin/media-actions";
import type { ActionState } from "@/lib/admin/actions";

/**
 * Media upload form. Accept list mirrors the server whitelist —
 * the server re-validates MIME + magic bytes regardless.
 */
export function MediaUploadForm() {
  const [state, formAction, pending] = useActionState(
    uploadMediaAction,
    {} as ActionState,
  );
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 border border-line bg-paper-raised p-4"
    >
      <p className="text-mono-meta text-slate">Upload</p>

      {state.error ? (
        <p role="alert" className="border border-error/30 bg-error-tint px-3 py-2 text-body-sm text-error">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="border border-success/30 bg-success-tint px-3 py-2 text-body-sm text-success">
          Uploaded.
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="media-file" className="text-mono-micro text-slate">
            File (JPEG, PNG, WebP, GIF, AVIF, PDF — max 10 MB)
          </label>
          <input
            ref={fileRef}
            id="media-file"
            name="file"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
            className="text-body-sm file:mr-3 file:h-10 file:cursor-pointer file:rounded-xs file:border file:border-line file:bg-paper-sunken file:px-3 file:text-label file:text-ink"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="media-alt" className="text-mono-micro text-slate">
            Alt text (recommended)
          </label>
          <input
            id="media-alt"
            name="altText"
            type="text"
            maxLength={300}
            className="h-10 rounded-xs border border-line bg-paper-sunken px-3 text-body-sm"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xs bg-accent px-4 text-label text-paper-raised transition-colors duration-(--duration-fast) hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload size={16} strokeWidth={1.5} aria-hidden />
          {pending ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}
