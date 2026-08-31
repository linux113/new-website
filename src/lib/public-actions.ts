"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  getNotificationRecipient,
  sendEmail,
} from "@/lib/email/email";
import {
  contactAcknowledgement,
  contactNotification,
} from "@/lib/email/templates/contact";
import {
  enquiryAcknowledgement,
  enquiryNotification,
} from "@/lib/email/templates/enquiry";
import { vendorNotification } from "@/lib/email/templates/vendor";
import {
  contactMessageInputSchema,
  productEnquiryInputSchema,
  vendorRequestInputSchema,
} from "@/lib/validation";

/**
 * PUBLIC form server actions.
 * Pipeline: rate limit → honeypot → Zod (strict, bounded) → persist
 * → notify (never blocks persistence) → safe generic response.
 * Internal errors are logged server-side, never surfaced.
 */

export interface PublicFormState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/* ---- Submission throttling (per-IP, in-memory) ---- */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const submissions = new Map<string, { count: number; first: number }>();

function throttled(ip: string): boolean {
  const now = Date.now();
  if (submissions.size > 2000) {
    for (const [key, bucket] of submissions) {
      if (now - bucket.first > WINDOW_MS) submissions.delete(key);
    }
  }
  const bucket = submissions.get(ip);
  if (!bucket || now - bucket.first > WINDOW_MS) {
    submissions.set(ip, { count: 1, first: now });
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_PER_WINDOW;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

const RATE_LIMIT_MESSAGE =
  "Too many submissions from your connection. Please try again later or contact us directly.";
const GENERIC_ERROR =
  "Your request wasn't sent. Please try again, or reach us by phone or WhatsApp.";

function clean(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/* ------------------------------------------------------------------ */
/* Product enquiry                                                     */
/* ------------------------------------------------------------------ */

export async function submitEnquiryAction(
  _prev: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  const ip = await clientIp();
  if (throttled(ip)) return { error: RATE_LIMIT_MESSAGE };

  // Honeypot: bots fill the invisible "website" field — accept
  // silently (no signal to the bot) without persisting.
  if (clean(formData.get("website"))) return { ok: true };

  const parsed = productEnquiryInputSchema.safeParse({
    name: clean(formData.get("name")),
    company: clean(formData.get("company")),
    email: clean(formData.get("email")),
    phone: clean(formData.get("phone")),
    whatsapp: clean(formData.get("whatsapp")),
    message: clean(formData.get("message")),
    requirement: clean(formData.get("quantity")),
    productId: clean(formData.get("productId")),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  let productName: string | undefined;
  try {
    if (parsed.data.productId) {
      const product = await db.product.findUnique({
        where: { id: parsed.data.productId, status: "PUBLISHED" },
        select: { name: true },
      });
      if (!product) delete parsed.data.productId; // never link drafts
      productName = product?.name;
    }
    const data = { ...parsed.data };
    delete data.website;
    await db.productEnquiry.create({ data });
  } catch (error) {
    console.error("[enquiry] persist failed:", error instanceof Error ? error.message : error);
    return { error: GENERIC_ERROR };
  }

  // Notifications must never fail the submission.
  try {
    const recipient = await getNotificationRecipient("enquiry");
    const notification = enquiryNotification({
      ...parsed.data,
      productName,
      quantity: parsed.data.requirement,
    });
    await sendEmail({ to: recipient, ...notification });
    await sendEmail({
      to: parsed.data.email,
      ...enquiryAcknowledgement({ name: parsed.data.name, productName }),
    });
  } catch (error) {
    console.error("[enquiry] notify failed:", error instanceof Error ? error.message : error);
  }

  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export async function submitContactAction(
  _prev: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  const ip = await clientIp();
  if (throttled(ip)) return { error: RATE_LIMIT_MESSAGE };
  if (clean(formData.get("website"))) return { ok: true };

  const parsed = contactMessageInputSchema.safeParse({
    name: clean(formData.get("name")),
    company: clean(formData.get("company")),
    email: clean(formData.get("email")),
    phone: clean(formData.get("phone")),
    subject: clean(formData.get("subject")),
    message: clean(formData.get("message")),
    requirement: clean(formData.get("requirement")),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  try {
    const { requirement, website: _honeypot, ...rest } = parsed.data;
    void _honeypot; // honeypot is never persisted
    // The ContactMessage table has no requirement column; fold the
    // optional product/requirement line into the stored message so it
    // is preserved without a schema migration.
    const message = requirement
      ? `${rest.message}\n\n---\nProduct / Requirement: ${requirement}`
      : rest.message;
    await db.contactMessage.create({ data: { ...rest, message } });
  } catch (error) {
    console.error("[contact] persist failed:", error instanceof Error ? error.message : error);
    return { error: GENERIC_ERROR };
  }

  try {
    const recipient = await getNotificationRecipient("contact");
    await sendEmail({ to: recipient, ...contactNotification(parsed.data) });
    await sendEmail({
      to: parsed.data.email,
      ...contactAcknowledgement({ name: parsed.data.name }),
    });
  } catch (error) {
    console.error("[contact] notify failed:", error instanceof Error ? error.message : error);
  }

  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Vendor                                                              */
/* ------------------------------------------------------------------ */

export async function submitVendorAction(
  _prev: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  const ip = await clientIp();
  if (throttled(ip)) return { error: RATE_LIMIT_MESSAGE };
  if (clean(formData.get("website_hp"))) return { ok: true };

  // Vendor's own website (real field) — validated separately and
  // folded into the message (the approved schema has no column;
  // we do not expand the database for it).
  const vendorWebsiteRaw = clean(formData.get("vendorWebsite"));
  let vendorWebsite: string | undefined;
  if (vendorWebsiteRaw) {
    const websiteParsed = z
      .string()
      .url()
      .max(500)
      .refine((u) => u.startsWith("http://") || u.startsWith("https://"), {
        message: "Enter a valid http(s) URL",
      })
      .safeParse(vendorWebsiteRaw);
    if (!websiteParsed.success) {
      return {
        error: "Please fix the errors below.",
        fieldErrors: { vendorWebsite: "Enter a valid website URL (https://…)" },
      };
    }
    vendorWebsite = websiteParsed.data;
  }

  const parsed = vendorRequestInputSchema.safeParse({
    name: clean(formData.get("name")),
    company: clean(formData.get("company")),
    email: clean(formData.get("email")),
    phone: clean(formData.get("phone")),
    whatsapp: clean(formData.get("whatsapp")),
    offering: clean(formData.get("offering")),
    message: clean(formData.get("message")),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  try {
    const { ...data } = parsed.data;
    delete data.website;
    await db.vendorRequest.create({
      data: {
        ...data,
        message: [data.message, vendorWebsite ? `Website: ${vendorWebsite}` : null]
          .filter(Boolean)
          .join("\n\n"),
      },
    });
  } catch (error) {
    console.error("[vendor] persist failed:", error instanceof Error ? error.message : error);
    return { error: GENERIC_ERROR };
  }

  try {
    const recipient = await getNotificationRecipient("vendor");
    await sendEmail({
      to: recipient,
      ...vendorNotification({ ...parsed.data, website: vendorWebsite }),
    });
  } catch (error) {
    console.error("[vendor] notify failed:", error instanceof Error ? error.message : error);
  }

  return { ok: true };
}

/* ---- Newsletter subscription ---- */
const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
});

export async function subscribeNewsletterAction(
  _prev: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  const ip = await clientIp();
  if (throttled(ip)) return { error: RATE_LIMIT_MESSAGE };
  if (clean(formData.get("website"))) return { ok: true }; // honeypot

  const parsed = newsletterSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  try {
    // Idempotent-ish: skip if this email already subscribed.
    const existing = await db.contactMessage.findFirst({
      where: { email: parsed.data.email, source: "newsletter" },
      select: { id: true },
    });
    if (!existing) {
      await db.contactMessage.create({
        data: {
          name: parsed.data.email.split("@")[0].slice(0, 80),
          email: parsed.data.email,
          subject: "Newsletter subscription",
          message: "Subscribed from the Insights newsletter form.",
          source: "newsletter",
        },
      });
    }
    return { ok: true };
  } catch (error) {
    console.error("[newsletter] persist failed:", error);
    return { error: "Could not subscribe right now. Please try again." };
  }
}
