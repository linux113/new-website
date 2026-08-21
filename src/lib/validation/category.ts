import { z } from "zod";
import { contentStatusSchema, seoInputSchema, slugSchema } from "./shared";

/** Admin input for creating/updating a product category. */
export const categoryInputSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    slug: slugSchema,
    description: z.string().max(2000).optional(),
    imageId: z.string().cuid().optional(),
    status: contentStatusSchema.default("DRAFT"),
    sortOrder: z.number().int().min(0).default(0),
    seo: seoInputSchema.optional(),
  })
  .strict();

export type CategoryInput = z.infer<typeof categoryInputSchema>;
