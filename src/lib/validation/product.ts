import { z } from "zod";
import { contentStatusSchema, seoInputSchema, slugSchema } from "./shared";

export const productSpecificationInputSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    value: z.string().trim().min(1).max(500),
    unit: z.string().max(30).optional(),
    sortOrder: z.number().int().min(0).default(0),
  })
  .strict();

export const productImageInputSchema = z
  .object({
    mediaId: z.string().cuid(),
    altText: z.string().max(300).optional(),
    sortOrder: z.number().int().min(0).default(0),
  })
  .strict();

/** Admin input for creating/updating a product. */
export const productInputSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    slug: slugSchema,
    shortDescription: z.string().max(300).optional(),
    description: z.string().max(20000).optional(),
    productCode: z.string().trim().max(60).optional(),
    status: contentStatusSchema.default("DRAFT"),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().min(0).default(0),
    categoryId: z.string().cuid(),
    specifications: z.array(productSpecificationInputSchema).max(100).default([]),
    applications: z.array(z.string().trim().min(1).max(300)).max(50).default([]),
    images: z.array(productImageInputSchema).max(30).default([]),
    seo: seoInputSchema.optional(),
  })
  .strict();

export type ProductInput = z.infer<typeof productInputSchema>;
