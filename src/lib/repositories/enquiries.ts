import "server-only";
import { db } from "@/lib/db";
import type {
  ContactMessageInput,
  ProductEnquiryInput,
  VendorRequestInput,
} from "@/lib/validation";

/**
 * Lead/enquiry data access (server-side only).
 * WRITES accept only validated input types from the Zod layer —
 * callers must parse untrusted data first. The honeypot field
 * (`website`) is stripped before persistence.
 */

function stripHoneypot<T extends { website?: "" }>(input: T): Omit<T, "website"> {
  const data = { ...input };
  delete data.website;
  return data;
}

export function createProductEnquiry(input: ProductEnquiryInput) {
  return db.productEnquiry.create({ data: stripHoneypot(input) });
}

export function createContactMessage(input: ContactMessageInput) {
  return db.contactMessage.create({ data: stripHoneypot(input) });
}

export function createVendorRequest(input: VendorRequestInput) {
  return db.vendorRequest.create({ data: stripHoneypot(input) });
}
