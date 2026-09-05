import "server-only";
import { db } from "@/lib/db";

/**
 * Company content data access (server-side only).
 * Everything filters PUBLISHED — the public site never sees drafts.
 * These feed the homepage sections once the client populates the
 * admin panel; until then the frontend keeps its typed placeholders.
 */

export function getPublishedIndustries() {
  return db.industry.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
  });
}

export function getPublishedInfrastructure() {
  return db.infrastructureItem.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
    include: { media: true },
  });
}

export function getPublishedCertifications() {
  return db.certification.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
    include: { document: true },
  });
}

export function getPublishedCustomers() {
  return db.customer.findMany({
    where: { status: "PUBLISHED", consent: true },
    orderBy: { sortOrder: "asc" },
    include: { logo: true },
  });
}

export function getPublishedTestimonials() {
  return db.testimonial.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
    include: { customer: true, avatar: true },
  });
}

export function getPublishedGlobalCountries() {
  return db.globalCountry.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
  });
}

