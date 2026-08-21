"use client";

import { useActionState } from "react";
import { saveSettingsAction } from "@/lib/admin/settings-actions";
import type { ActionState } from "@/lib/admin/actions";
import { AdminFormField, AdminInput, AdminTextarea } from "./form";

export interface SettingField {
  key: string;
  label: string;
  multiline?: boolean;
  value: string;
}

/** Grouped key-value settings editor (contact / social / content / seo). */
export function SettingsForm({ group, fields }: { group: string; fields: SettingField[] }) {
  const [state, formAction, pending] = useActionState(
    saveSettingsAction.bind(null, group),
    {} as ActionState,
  );

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {state.error ? (
        <p role="alert" className="border border-error/30 bg-error-tint px-4 py-3 text-body-sm text-error">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="border border-success/30 bg-success-tint px-4 py-3 text-body-sm text-success">
          Saved.
        </p>
      ) : null}

      {fields.map((field) => (
        <AdminFormField key={field.key} name={field.key} label={field.label}>
          {field.multiline ? (
            <AdminTextarea name={field.key} defaultValue={field.value} rows={3} />
          ) : (
            <AdminInput name={field.key} defaultValue={field.value} />
          )}
        </AdminFormField>
      ))}

      <div className="flex items-center gap-3 border-t border-line pt-5">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-xs bg-accent px-6 text-label text-paper-raised transition-colors duration-(--duration-fast) hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
