"use client";

import type { ActionState } from "@/lib/admin/actions";
import {
  AdminForm,
  AdminFormField,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  SlugField,
} from "./form";

/**
 * Blog post form. Content is edited as Markdown in a structured
 * textarea for this phase — an intentional, honest editor (the rich
 * text upgrade slots into this same field later without data
 * migration, since content is stored as text).
 */

interface BlogFormProps {
  categories: { id: string; name: string }[];
  defaults: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    categoryId?: string;
    status?: string;
    publishedAt?: string;
  };
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
}

export function BlogForm({ categories, defaults, action, submitLabel }: BlogFormProps) {
  return (
    <AdminForm action={action} submitLabel={submitLabel}>
      {({ fieldErrors }) => (
        <>
          <AdminFormField name="title" label="Title" error={fieldErrors.title}>
            <AdminInput name="title" defaultValue={defaults.title} error={fieldErrors.title} required />
          </AdminFormField>

          <AdminFormField
            name="slug"
            label="Slug"
            error={fieldErrors.slug}
            help="URL identifier — auto-derived from the title, editable."
          >
            <SlugField name="slug" sourceName="title" defaultValue={defaults.slug} error={fieldErrors.slug} />
          </AdminFormField>

          <AdminFormField
            name="excerpt"
            label="Excerpt"
            error={fieldErrors.excerpt}
            help="Short summary for cards and meta descriptions."
          >
            <AdminTextarea name="excerpt" defaultValue={defaults.excerpt} rows={3} error={fieldErrors.excerpt} />
          </AdminFormField>

          <AdminFormField
            name="content"
            label="Content (Markdown)"
            error={fieldErrors.content}
          >
            <AdminTextarea name="content" defaultValue={defaults.content} rows={16} error={fieldErrors.content} />
          </AdminFormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <AdminFormField name="categoryId" label="Category" error={fieldErrors.categoryId}>
              <AdminSelect
                name="categoryId"
                defaultValue={defaults.categoryId ?? ""}
                options={[
                  { value: "", label: "— None —" },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </AdminFormField>
            <AdminFormField name="status" label="Status" error={fieldErrors.status}>
              <AdminSelect
                name="status"
                defaultValue={defaults.status ?? "DRAFT"}
                options={[
                  { value: "DRAFT", label: "Draft" },
                  { value: "PUBLISHED", label: "Published" },
                  { value: "ARCHIVED", label: "Archived" },
                ]}
              />
            </AdminFormField>
            <AdminFormField
              name="publishedAt"
              label="Publish date"
              error={fieldErrors.publishedAt}
              help="Defaults to now when publishing."
            >
              <AdminInput
                name="publishedAt"
                type="date"
                defaultValue={defaults.publishedAt?.slice(0, 10) ?? ""}
                error={fieldErrors.publishedAt}
              />
            </AdminFormField>
          </div>
        </>
      )}
    </AdminForm>
  );
}
