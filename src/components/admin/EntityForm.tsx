"use client";

import type { ActionState } from "@/lib/admin/actions";
import {
  AdminCheckbox,
  AdminForm,
  AdminFormField,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  SlugField,
} from "./form";

/**
 * Config-driven entity form. Receives serializable field defs from
 * the server page (entities.ts is server-only) and a bound server
 * action. Media fields render as an id input for now — the picker
 * upgrades when uploads land (R2 phase).
 */

export interface SerializableField {
  name: string;
  label: string;
  kind: string;
  required?: boolean;
  help?: string;
  sourceField?: string;
}

interface EntityFormProps {
  fields: SerializableField[];
  hasStatus: boolean;
  hasSortOrder: boolean;
  defaults: Record<string, string | number | boolean | null>;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
}

export function EntityForm({
  fields,
  hasStatus,
  hasSortOrder,
  defaults,
  action,
  submitLabel,
}: EntityFormProps) {
  return (
    <AdminForm action={action} submitLabel={submitLabel}>
      {({ fieldErrors }) => (
        <>
          {fields.map((field) => {
            const error = fieldErrors[field.name];
            const rawDefault = defaults[field.name];
            const defaultValue =
              rawDefault === null || rawDefault === undefined ? "" : String(rawDefault);

            if (field.kind === "checkbox") {
              return (
                <AdminCheckbox
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  defaultChecked={Boolean(rawDefault)}
                />
              );
            }

            return (
              <AdminFormField
                key={field.name}
                name={field.name}
                label={field.label}
                error={error}
                help={field.help}
              >
                {field.kind === "textarea" ? (
                  <AdminTextarea name={field.name} defaultValue={defaultValue} error={error} />
                ) : field.kind === "slug" ? (
                  <SlugField
                    name={field.name}
                    sourceName={field.sourceField ?? "name"}
                    defaultValue={defaultValue}
                    error={error}
                  />
                ) : field.kind === "date" ? (
                  <AdminInput
                    name={field.name}
                    type="date"
                    defaultValue={defaultValue ? defaultValue.slice(0, 10) : ""}
                    error={error}
                  />
                ) : field.kind === "number" ? (
                  <AdminInput name={field.name} type="number" defaultValue={defaultValue} error={error} />
                ) : field.kind === "media" ? (
                  <AdminInput name={field.name} defaultValue={defaultValue} error={error} />
                ) : (
                  <AdminInput
                    name={field.name}
                    defaultValue={defaultValue}
                    error={error}
                    required={field.required}
                  />
                )}
              </AdminFormField>
            );
          })}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {hasStatus ? (
              <AdminFormField name="status" label="Status" error={fieldErrors.status}>
                <AdminSelect
                  name="status"
                  defaultValue={String(defaults.status ?? "DRAFT")}
                  options={[
                    { value: "DRAFT", label: "Draft (hidden from website)" },
                    { value: "PUBLISHED", label: "Published (visible on website)" },
                  ]}
                />
              </AdminFormField>
            ) : null}
            {hasSortOrder ? (
              <AdminFormField name="sortOrder" label="Sort order" error={fieldErrors.sortOrder}>
                <AdminInput
                  name="sortOrder"
                  type="number"
                  defaultValue={String(defaults.sortOrder ?? 0)}
                />
              </AdminFormField>
            ) : null}
          </div>
        </>
      )}
    </AdminForm>
  );
}
