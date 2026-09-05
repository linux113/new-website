"use client";

import { useActionState, useState } from "react";
import { cn } from "@/lib/cn";
import type { ActionState } from "@/lib/admin/actions";

/**
 * Admin form kit (client).
 * - AdminForm: wraps a server action via useActionState; disables
 *   submit while pending (no duplicate submission); preserves
 *   entered values on validation failure (uncontrolled inputs +
 *   server-side re-render only on success).
 * - AdminFormField: label + control + error wiring.
 * - SlugField: auto-derives from a source input until manually edited.
 */

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 160);
}

interface AdminFormProps {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  children: (helpers: { fieldErrors: Record<string, string> }) => React.ReactNode;
}

export function AdminForm({ action, submitLabel, children }: AdminFormProps) {
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

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
      {state.success ? (
        <p role="status" className="border border-success/30 bg-success-tint px-4 py-3 text-body-sm text-success">
          Saved.
        </p>
      ) : null}

      {children({ fieldErrors: state.fieldErrors ?? {} })}

      <div className="flex items-center gap-3 border-t border-line pt-5">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-xs bg-accent px-6 text-label text-paper-raised transition-colors duration-(--duration-fast) hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

interface FieldShellProps {
  name: string;
  label: string;
  error?: string;
  help?: string;
  children: React.ReactNode;
}

export function AdminFormField({ name, label, error, help, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`f-${name}`} className="text-[0.9375rem] font-medium text-ink">
        {label}
      </label>
      {children}
      {help ? <p className="text-body-sm text-slate">{help}</p> : null}
      {error ? (
        <p id={`f-${name}-error`} role="alert" className="text-body-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClass = (invalid: boolean) =>
  cn(
    "h-11 w-full rounded-xs border bg-paper-sunken px-3 text-[16px] text-ink",
    "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
    invalid ? "border-error" : "border-line",
  );

export function AdminInput({
  name,
  defaultValue,
  error,
  type = "text",
  required,
}: {
  name: string;
  defaultValue?: string;
  error?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      id={`f-${name}`}
      name={name}
      type={type}
      defaultValue={defaultValue}
      required={required}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `f-${name}-error` : undefined}
      className={inputClass(Boolean(error))}
    />
  );
}

export function AdminTextarea({
  name,
  defaultValue,
  error,
  rows = 5,
}: {
  name: string;
  defaultValue?: string;
  error?: string;
  rows?: number;
}) {
  return (
    <textarea
      id={`f-${name}`}
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `f-${name}-error` : undefined}
      className={cn(inputClass(Boolean(error)), "h-auto py-2.5")}
    />
  );
}

export function AdminSelect({
  name,
  defaultValue,
  options,
  error,
}: {
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  error?: string;
}) {
  return (
    <select
      id={`f-${name}`}
      name={name}
      defaultValue={defaultValue}
      aria-invalid={error ? true : undefined}
      className={inputClass(Boolean(error))}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function AdminCheckbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-[0.9375rem] text-ink">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked}
        className="size-4 accent-(--color-accent)"
      />
      {label}
    </label>
  );
}

/** Slug input that mirrors a source field until manually edited. */
export function SlugField({
  name,
  sourceName,
  defaultValue,
  error,
}: {
  name: string;
  sourceName: string;
  defaultValue?: string;
  error?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [touched, setTouched] = useState(Boolean(defaultValue));

  return (
    <input
      id={`f-${name}`}
      name={name}
      type="text"
      value={value}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `f-${name}-error` : undefined}
      onChange={(e) => {
        setTouched(true);
        setValue(slugify(e.target.value) || e.target.value.toLowerCase());
      }}
      onFocus={(e) => {
        // Late-bind: derive from source if untouched and empty.
        if (!touched && !value) {
          const source = (e.target.form?.elements.namedItem(sourceName) as HTMLInputElement | null)?.value;
          if (source) setValue(slugify(source));
        }
      }}
      placeholder="auto-generated-from-name"
      className={inputClass(Boolean(error))}
    />
  );
}
