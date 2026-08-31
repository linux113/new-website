import { z } from "zod";
import { emailSchema, phoneSchema } from "./shared";

/**
 * Public-facing lead forms. These validate UNTRUSTED input at the
 * server boundary — keep them strict (`.strict()` rejects unknown
 * keys) and bounded (max lengths prevent abuse).
 */

/** Product enquiry (RFQ) — public form. */
export const productEnquiryInputSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    company: z.string().trim().max(160).optional(),
    email: emailSchema,
    phone: phoneSchema.optional(),
    whatsapp: phoneSchema.optional(),
    message: z.string().trim().min(1).max(5000),
    requirement: z.string().trim().max(2000).optional(),
    productId: z.string().cuid().optional(),
    /** Honeypot — must stay empty; bots fill it. */
    website: z.literal("").optional(),
  })
  .strict();

export type ProductEnquiryInput = z.infer<typeof productEnquiryInputSchema>;

/** General contact form — public. */
export const contactMessageInputSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    company: z.string().trim().max(160).optional(),
    email: emailSchema,
    phone: phoneSchema.optional(),
    whatsapp: phoneSchema.optional(),
    subject: z.string().trim().max(200).optional(),
    message: z.string().trim().min(1).max(5000),
    /** Optional product/requirement line from the premium contact form. */
    requirement: z.string().trim().max(2000).optional(),
    website: z.literal("").optional(), // honeypot
  })
  .strict();

export type ContactMessageInput = z.infer<typeof contactMessageInputSchema>;
