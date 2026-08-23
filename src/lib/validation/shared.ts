import { z } from "zod";

/**
 * Shared validation fragments (Zod).
 * Kept deliberately small — no over-engineering.
 */

export const slugSchema = z
  .string()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only");

export const emailSchema = z.string().trim().toLowerCase().email().max(254);

/** Loose international phone shape; strict formatting is a UI concern. */
export const phoneSchema = z
  .string()
  .trim()
  .min(7)
  .max(20)
  .regex(/^[+0-9][0-9\s\-()]*$/, "Enter a valid phone number");

export const contentStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const enquiryStatusSchema = z.enum([
  "NEW",
  "IN_PROGRESS",
  "CONTACTED",
  "CLOSED",
  "SPAM",
]);

/** Reusable SEO input (maps to SeoMeta). All optional. */
export const seoInputSchema = z
  .object({
    metaTitle: z.string().max(70).optional(),
    metaDescription: z.string().max(170).optional(),
    canonicalUrl: z.string().url().optional(),
    ogTitle: z.string().max(95).optional(),
    ogDescription: z.string().max(200).optional(),
    ogImageId: z.string().cuid().optional(),
    robots: z.string().max(60).optional(),
  })
  .strict();
