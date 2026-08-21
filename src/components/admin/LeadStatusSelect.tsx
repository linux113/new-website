"use client";

import { useState, useTransition } from "react";
import { updateLeadStatusAction } from "@/lib/admin/lead-actions";
import { cn } from "@/lib/cn";

const STATUSES = ["NEW", "IN_PROGRESS", "CONTACTED", "CLOSED", "SPAM"] as const;

/** Inline status selector for leads — optimistic, server-validated. */
export function LeadStatusSelect({
  kind,
  id,
  status,
}: {
  kind: "enquiry" | "contact" | "vendor";
  id: string;
  status: string;
}) {
  const [current, setCurrent] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onChange = (next: string) => {
    const previous = current;
    setCurrent(next);
    setError(null);
    startTransition(async () => {
      const result = await updateLeadStatusAction(kind, id, next);
      if (result.error) {
        setCurrent(previous);
        setError(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="sr-only" htmlFor={`status-${id}`}>
        Status
      </label>
      <select
        id={`status-${id}`}
        value={current}
        disabled={pending}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-9 rounded-xs border border-line bg-paper-raised px-2 text-body-sm",
          pending && "opacity-60",
        )}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
      {error ? (
        <p role="alert" className="text-mono-micro text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
