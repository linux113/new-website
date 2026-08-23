import { z } from "zod";
import { seoInputSchema, slugSchema } from "./shared";

export const blogStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

/** Admin input for creating/updating a blog post. */
export const blogPostInputSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    slug: slugSchema,
    excerpt: z.string().max(500).optional(),
    content: z.string().max(200000).optional(),
    featuredImageId: z.string().cuid().optional(),
    authorId: z.string().cuid().optional(),
    categoryId: z.string().cuid().optional(),
    status: blogStatusSchema.default("DRAFT"),
    publishedAt: z.coerce.date().optional(),
    tagIds: z.array(z.string().cuid()).max(20).default([]),
    seo: seoInputSchema.optional(),
  })
  .strict();

export type BlogPostInput = z.infer<typeof blogPostInputSchema>;
