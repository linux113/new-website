"use client";

import { useActionState } from "react";
import { cn } from "@/lib/cn";
import type { PublicFormState } from "@/lib/public-actions";

/**
 * Public form kit (DS §13). Inputs are surface-sunken, 48px, 16px
 * font (no iOS zoom); labels above; honeypot included; success is
 * an inline confirmation panel (no redirect); entered values are
 * preserved on validation failure (uncontrolled inputs).
 */

interface PublicFormProps {
  action: (prev: PublicFormState, formData: FormData) => Promise<PublicFormState>;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  /** Honeypot field name (default "website"). */
  honeypotName?: string;
  children: (helpers: { fieldErrors: Record<string, string> }) => React.ReactNode;
}

export function PublicForm({
  action,
  submitLabel,
  successTitle,
  successBody,
  honeypotName = "website",
  children,
}: PublicFormProps) {
  const [state, formAction, pending] = useActionState(action, {} as PublicFormState);

  if (state.ok) {
    return (
      <div
        role="status"
        className="border border-success/30 bg-success-tint p-6 lg:p-8"
      >
        <p className="text-heading-sm text-success">{successTitle}</p>
        <p className="mt-2 text-body-sm text-paper">{successBody}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {state.error ? (
        <p
          role="alert"
          className="border border-error/30 bg-error-tint px-4 py-3 text-body-sm text-error"
        >
          {state.error}
        </p>
      ) : null}

      {/* Honeypot — visually hidden, tab-skipped; bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`hp-${honeypotName}`}>Leave this field empty</label>
        <input
          id={`hp-${honeypotName}`}
          type="text"
          name={honeypotName}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {children({ fieldErrors: state.fieldErrors ?? {} })}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="h-13 rounded-xs bg-accent px-8 text-label text-ink transition-colors duration-(--duration-base) hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Sending…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

/* ---------------- Fields ---------------- */

interface FieldProps {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}

export function Field({ name, label, error, optional, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`pf-${name}`} className="text-mono-meta text-surface-muted">
        {label}
        {optional ? <span className="text-mist"> (OPTIONAL)</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`pf-${name}-error`} role="alert" className="text-body-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClass = (invalid: boolean) =>
  cn(
    "w-full rounded-xs border bg-ink-soft px-4 text-[16px] text-paper",
    "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
    invalid ? "border-error" : "border-line",
  );

export function TextInput({
  name,
  error,
  type = "text",
  autoComplete,
  inputMode,
  required,
}: {
  name: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url";
  required?: boolean;
}) {
  return (
    <input
      id={`pf-${name}`}
      name={name}
      type={type}
      autoComplete={autoComplete}
      inputMode={inputMode}
      required={required}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `pf-${name}-error` : undefined}
      className={cn(controlClass(Boolean(error)), "h-12")}
    />
  );
}

export function TextArea({
  name,
  error,
  rows = 5,
  required,
}: {
  name: string;
  error?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <textarea
      id={`pf-${name}`}
      name={name}
      rows={rows}
      required={required}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `pf-${name}-error` : undefined}
      className={cn(controlClass(Boolean(error)), "min-h-30 py-3")}
    />
  );
}
