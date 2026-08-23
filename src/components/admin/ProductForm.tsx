"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
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
 * Product form (bespoke): base fields + dynamic specification rows +
 * one-per-line applications. Specifications serialize to a hidden
 * JSON input consumed by the server action.
 */

export interface SpecRow {
  name: string;
  value: string;
  unit?: string;
}

interface ProductFormProps {
  categories: { id: string; name: string }[];
  defaults: {
    name?: string;
    slug?: string;
    productCode?: string;
    shortDescription?: string;
    description?: string;
    categoryId?: string;
    status?: string;
    featured?: boolean;
    sortOrder?: number;
    specifications?: SpecRow[];
    applications?: string;
  };
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
}

export function ProductForm({ categories, defaults, action, submitLabel }: ProductFormProps) {
  const [specs, setSpecs] = useState<SpecRow[]>(defaults.specifications ?? []);

  const updateSpec = (index: number, patch: Partial<SpecRow>) => {
    setSpecs((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  return (
    <AdminForm action={action} submitLabel={submitLabel}>
      {({ fieldErrors }) => (
        <>
          {/* Serialized child collections */}
          <input
            type="hidden"
            name="specifications"
            value={JSON.stringify(specs.filter((s) => s.name.trim() && s.value.trim()))}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <AdminFormField name="name" label="Name" error={fieldErrors.name}>
              <AdminInput name="name" defaultValue={defaults.name} error={fieldErrors.name} required />
            </AdminFormField>
            <AdminFormField
              name="slug"
              label="Slug"
              error={fieldErrors.slug}
              help="URL identifier — auto-derived from the name, editable."
            >
              <SlugField name="slug" sourceName="name" defaultValue={defaults.slug} error={fieldErrors.slug} />
            </AdminFormField>
            <AdminFormField name="productCode" label="Product code" error={fieldErrors.productCode}>
              <AdminInput name="productCode" defaultValue={defaults.productCode} error={fieldErrors.productCode} />
            </AdminFormField>
            <AdminFormField name="categoryId" label="Category" error={fieldErrors.categoryId}>
              <AdminSelect
                name="categoryId"
                defaultValue={defaults.categoryId}
                error={fieldErrors.categoryId}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
            </AdminFormField>
          </div>

          <AdminFormField
            name="shortDescription"
            label="Short description"
            error={fieldErrors.shortDescription}
            help="One line shown on product cards (max 300 characters)."
          >
            <AdminInput name="shortDescription" defaultValue={defaults.shortDescription} error={fieldErrors.shortDescription} />
          </AdminFormField>

          <AdminFormField name="description" label="Description" error={fieldErrors.description}>
            <AdminTextarea name="description" defaultValue={defaults.description} rows={8} error={fieldErrors.description} />
          </AdminFormField>

          {/* Specifications editor */}
          <fieldset className="border border-line p-4">
            <legend className="px-1 text-mono-meta text-slate">Specifications</legend>
            {specs.length === 0 ? (
              <p className="text-body-sm text-slate">No specifications yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {specs.map((spec, i) => (
                  <li key={i} className="grid grid-cols-[1fr_1fr_5rem_2.5rem] items-center gap-2">
                    <input
                      aria-label={`Specification ${i + 1} name`}
                      value={spec.name}
                      onChange={(e) => updateSpec(i, { name: e.target.value })}
                      placeholder="Name"
                      className="h-10 rounded-xs border border-line bg-paper-sunken px-2.5 text-body-sm"
                    />
                    <input
                      aria-label={`Specification ${i + 1} value`}
                      value={spec.value}
                      onChange={(e) => updateSpec(i, { value: e.target.value })}
                      placeholder="Value"
                      className="h-10 rounded-xs border border-line bg-paper-sunken px-2.5 text-body-sm"
                    />
                    <input
                      aria-label={`Specification ${i + 1} unit`}
                      value={spec.unit ?? ""}
                      onChange={(e) => updateSpec(i, { unit: e.target.value })}
                      placeholder="Unit"
                      className="h-10 rounded-xs border border-line bg-paper-sunken px-2.5 text-body-sm"
                    />
                    <button
                      type="button"
                      aria-label={`Remove specification ${i + 1}`}
                      onClick={() => setSpecs((prev) => prev.filter((_, j) => j !== i))}
                      className="flex size-10 items-center justify-center rounded-xs border border-line text-slate hover:border-error hover:text-error"
                    >
                      <X size={16} strokeWidth={1.5} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => setSpecs((prev) => [...prev, { name: "", value: "", unit: "" }])}
              className="mt-3 inline-flex h-10 items-center gap-2 rounded-xs border border-line px-3 text-body-sm text-ink hover:bg-paper-sunken"
            >
              <Plus size={16} strokeWidth={1.5} aria-hidden />
              Add specification
            </button>
          </fieldset>

          <AdminFormField
            name="applications"
            label="Applications"
            error={fieldErrors.applications}
            help="One application per line."
          >
            <AdminTextarea name="applications" defaultValue={defaults.applications} rows={4} />
          </AdminFormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <AdminFormField name="status" label="Status" error={fieldErrors.status}>
              <AdminSelect
                name="status"
                defaultValue={defaults.status ?? "DRAFT"}
                options={[
                  { value: "DRAFT", label: "Draft (hidden)" },
                  { value: "PUBLISHED", label: "Published (visible)" },
                ]}
              />
            </AdminFormField>
            <AdminFormField name="sortOrder" label="Sort order" error={fieldErrors.sortOrder}>
              <AdminInput name="sortOrder" type="number" defaultValue={String(defaults.sortOrder ?? 0)} />
            </AdminFormField>
            <div className="flex items-end pb-3">
              <AdminCheckbox name="featured" label="Featured on homepage" defaultChecked={defaults.featured} />
            </div>
          </div>

          <p className="text-body-sm text-slate">
            Images and documents attach from the media library once uploads are
            enabled (next phase). Related products manage from this form at the
            same time.
          </p>
        </>
      )}
    </AdminForm>
  );
}
