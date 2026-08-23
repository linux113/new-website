import "server-only";
import { z } from "zod";
import { contentStatusSchema, slugSchema } from "@/lib/validation";

/**
 * Admin entity registry — one config per simple CRUD entity.
 * Field definitions drive BOTH the form UI and the Zod validation,
 * so screens and rules can never drift apart.
 *
 * Products, blog posts and enquiries have bespoke modules; everything
 * else (categories, industries, certifications, infrastructure,
 * customers, testimonials, global reach) is config-driven.
 */

export type FieldKind =
  | "text"
  | "slug"
  | "textarea"
  | "number"
  | "checkbox"
  | "media"
  | "url"
  | "date";

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  help?: string;
  max?: number;
  /** For slug fields: which field to derive from. */
  sourceField?: string;
}

export interface EntityConfig {
  /** Prisma model accessor name, e.g. "category". */
  model: string;
  /** URL segment, e.g. "categories". */
  segment: string;
  titleSingular: string;
  titlePlural: string;
  fields: FieldDef[];
  /** Column names shown in the list table (subset of fields + status). */
  listColumns: string[];
  hasStatus: boolean;
  hasSortOrder: boolean;
  /** Unique fields checked before create/update (e.g. slug, code). */
  uniqueFields?: string[];
  /** Deletion protection: model+fk that must have 0 rows. */
  deleteGuard?: { model: string; foreignKey: string; message: string };
}

function fieldToZod(field: FieldDef): z.ZodTypeAny {
  let schema: z.ZodTypeAny;
  switch (field.kind) {
    case "slug":
      schema = slugSchema;
      break;
    case "number":
      schema = z.coerce.number().int().min(0);
      break;
    case "checkbox":
      schema = z.coerce.boolean();
      break;
    case "url":
      schema = z.string().trim().url().max(500);
      break;
    case "date":
      schema = z.coerce.date();
      break;
    case "media":
      schema = z.string().cuid();
      break;
    default:
      schema = z.string().trim().min(field.required ? 1 : 0).max(field.max ?? 500);
  }
  if (!field.required && field.kind !== "checkbox" && field.kind !== "number") {
    schema = z
      .preprocess((v) => (v === "" || v === null ? undefined : v), schema.optional());
  }
  return schema;
}

export function buildEntitySchema(config: EntityConfig) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of config.fields) shape[field.name] = fieldToZod(field);
  if (config.hasStatus) shape.status = contentStatusSchema.default("DRAFT");
  if (config.hasSortOrder) shape.sortOrder = z.coerce.number().int().min(0).default(0);
  return z.object(shape);
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

export const ENTITIES: Record<string, EntityConfig> = {
  categories: {
    model: "category",
    segment: "categories",
    titleSingular: "Category",
    titlePlural: "Categories",
    hasStatus: true,
    hasSortOrder: true,
    uniqueFields: ["slug"],
    deleteGuard: {
      model: "product",
      foreignKey: "categoryId",
      message:
        "This category still has products. Reassign or delete them first — products are never deleted silently.",
    },
    fields: [
      { name: "name", label: "Name", kind: "text", required: true, max: 120 },
      { name: "slug", label: "Slug", kind: "slug", required: true, sourceField: "name" },
      { name: "description", label: "Description", kind: "textarea", max: 2000 },
      { name: "imageId", label: "Image", kind: "media" },
    ],
    listColumns: ["name", "slug"],
  },

  industries: {
    model: "industry",
    segment: "industries",
    titleSingular: "Industry",
    titlePlural: "Industries",
    hasStatus: true,
    hasSortOrder: true,
    uniqueFields: ["slug"],
    fields: [
      { name: "name", label: "Name", kind: "text", required: true, max: 120 },
      { name: "slug", label: "Slug", kind: "slug", required: true, sourceField: "name" },
      { name: "description", label: "Description", kind: "textarea", max: 2000 },
    ],
    listColumns: ["name", "slug"],
  },

  certifications: {
    model: "certification",
    segment: "certifications",
    titleSingular: "Certification",
    titlePlural: "Certifications",
    hasStatus: true,
    hasSortOrder: true,
    fields: [
      {
        name: "name",
        label: "Name",
        kind: "text",
        required: true,
        max: 200,
        help: "Verified certifications only — publish nothing that lacks documents.",
      },
      { name: "issuer", label: "Issuing body", kind: "text", max: 200 },
      { name: "documentId", label: "Document / scan", kind: "media" },
      { name: "validFrom", label: "Valid from", kind: "date" },
      { name: "validUntil", label: "Valid until", kind: "date" },
    ],
    listColumns: ["name", "issuer"],
  },

  infrastructure: {
    model: "infrastructureItem",
    segment: "infrastructure",
    titleSingular: "Infrastructure item",
    titlePlural: "Infrastructure",
    hasStatus: true,
    hasSortOrder: true,
    fields: [
      { name: "title", label: "Title", kind: "text", required: true, max: 200 },
      { name: "caption", label: "Caption", kind: "textarea", max: 500 },
      {
        name: "mediaId",
        label: "Image",
        kind: "media",
        help: "Real facility photography only (factory, machinery, warehouse, packaging).",
      },
    ],
    listColumns: ["title"],
  },

  customers: {
    model: "customer",
    segment: "customers",
    titleSingular: "Customer",
    titlePlural: "Customers",
    hasStatus: true,
    hasSortOrder: true,
    fields: [
      { name: "name", label: "Name", kind: "text", required: true, max: 160 },
      { name: "logoId", label: "Logo", kind: "media" },
      { name: "website", label: "Website", kind: "url" },
      {
        name: "consent",
        label: "Publication consent obtained",
        kind: "checkbox",
        help: "Logos appear publicly only when consent is recorded.",
      },
    ],
    listColumns: ["name", "website"],
  },

  testimonials: {
    model: "testimonial",
    segment: "testimonials",
    titleSingular: "Testimonial",
    titlePlural: "Testimonials",
    hasStatus: true,
    hasSortOrder: true,
    fields: [
      { name: "quote", label: "Quote", kind: "textarea", required: true, max: 2000 },
      { name: "personName", label: "Person", kind: "text", required: true, max: 120 },
      { name: "personRole", label: "Role / company", kind: "text", max: 160 },
      { name: "avatarId", label: "Avatar", kind: "media" },
    ],
    listColumns: ["personName", "personRole"],
  },

  "global-reach": {
    model: "globalCountry",
    segment: "global-reach",
    titleSingular: "Country",
    titlePlural: "Global reach",
    hasStatus: true,
    hasSortOrder: true,
    uniqueFields: ["code"],
    fields: [
      { name: "label", label: "Country name", kind: "text", required: true, max: 100 },
      {
        name: "code",
        label: "ISO code",
        kind: "text",
        required: true,
        max: 2,
        help: "ISO 3166-1 alpha-2, lowercase (e.g. ae, de). Publishing a country asserts it as a verified market.",
      },
      { name: "direction", label: "Direction (import / export / both)", kind: "text", max: 10 },
    ],
    listColumns: ["label", "code", "direction"],
  },
};

export function getEntity(segment: string): EntityConfig | null {
  return ENTITIES[segment] ?? null;
}
