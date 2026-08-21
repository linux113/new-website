import "server-only";

/** Vendor request templates. */

interface VendorData {
  name: string;
  company: string;
  email: string;
  phone?: string;
  website?: string;
  offering: string;
  message?: string;
}

export function vendorNotification(data: VendorData) {
  const lines = [
    "New vendor request — sriyaanmetals.com",
    "",
    `Company:  ${data.company}`,
    `Contact:  ${data.name}`,
    `Email:    ${data.email}`,
    data.phone ? `Phone:    ${data.phone}` : null,
    data.website ? `Website:  ${data.website}` : null,
    "",
    "Offering:",
    data.offering,
    ...(data.message ? ["", "Message:", data.message] : []),
    "",
    "— Review from the admin panel (/admin/vendor-requests).",
  ].filter((line): line is string => line !== null);

  return {
    subject: `Vendor request — ${data.company}`,
    text: lines.join("\n"),
    replyTo: data.email,
  };
}
