import { z } from "zod";
import { emailSchema, phoneSchema } from "./shared";

/** Vendor/supplier proposal — public form. */
export const vendorRequestInputSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    company: z.string().trim().min(1).max(160),
    email: emailSchema,
    phone: phoneSchema.optional(),
    whatsapp: phoneSchema.optional(),
    offering: z.string().trim().min(1).max(1000),
    message: z.string().trim().max(5000).optional(),
    website: z.literal("").optional(), // honeypot
  })
  .strict();

export type VendorRequestInput = z.infer<typeof vendorRequestInputSchema>;
