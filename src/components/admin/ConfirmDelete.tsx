"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import type { ActionState } from "@/lib/admin/actions";

/**
 * Confirmation dialog for destructive deletion (native <dialog> —
 * built-in focus trap + Esc). Executes the passed server action
 * and surfaces server errors (e.g. delete guards) inline.
 */
export function ConfirmDelete({
  label,
  description,
  action,
}: {
  label: string;
  description: string;
  action: () => Promise<ActionState>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const open = () => {
    setError(null);
    dialogRef.current?.showModal();
  };

  const confirm = () => {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setError(result.error);
      } else {
        dialogRef.current?.close();
        router.refresh();
      }
    });
  };

  // Prevent background scroll while open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setError(null);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label={`Delete ${label}`}
        className="inline-flex size-9 items-center justify-center rounded-xs border border-line text-slate transition-colors duration-(--duration-fast) hover:border-error hover:text-error"
      >
        <Trash2 size={16} strokeWidth={1.5} aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="confirm-delete-title"
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-sm border border-line bg-paper-raised p-6 shadow-modal backdrop:bg-black/70"
      >
        <h2 id="confirm-delete-title" className="text-heading-sm text-ink">
          Delete {label}?
        </h2>
        <p className="mt-2 text-body-sm text-slate">{description}</p>

        {error ? (
          <p role="alert" className="mt-3 border border-error/30 bg-error-tint px-3 py-2 text-body-sm text-error">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="h-10 rounded-xs border border-line px-4 text-label text-ink hover:bg-paper-sunken"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={pending}
            className={cn(
              "h-10 rounded-xs bg-error px-4 text-label text-paper-raised",
              "hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </dialog>
    </>
  );
}
