import "server-only";

/**
 * Product enquiry templates — internal notification + customer
 * acknowledgement. Plain-text-first (B2B deliverability), values
 * interpolated as text only (no HTML injection surface).
 */

interface EnquiryData {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  productName?: string;
  quantity?: string;
  message: string;
}

export function enquiryNotification(data: EnquiryData) {
  const lines = [
    "New product enquiry — sriyaanmetals.com",
    "",
    `Name:      ${data.name}`,
    data.company ? `Company:   ${data.company}` : null,
    `Email:     ${data.email}`,
    data.phone ? `Phone:     ${data.phone}` : null,
    data.whatsapp ? `WhatsApp:  ${data.whatsapp}` : null,
    data.productName ? `Product:   ${data.productName}` : null,
    data.quantity ? `Quantity:  ${data.quantity}` : null,
    "",
    "Message:",
    data.message,
    "",
    "— Review and respond from the admin panel (/admin/enquiries).",
  ].filter((line): line is string => line !== null);

  return {
    subject: `Enquiry${data.productName ? ` — ${data.productName}` : ""} — ${data.name}`,
    text: lines.join("\n"),
    replyTo: data.email,
  };
}

export function enquiryAcknowledgement(data: { name: string; productName?: string }) {
  return {
    subject: "Your enquiry has been received — SRIYAAN METALS",
    text: [
      `Dear ${data.name},`,
      "",
      `Thank you for your enquiry${data.productName ? ` regarding ${data.productName}` : ""}.`,
      "It has been received and our sales team will review it during",
      "working hours (10:00 AM – 7:00 PM IST).",
      "",
      "If your requirement is urgent, you can reach us directly:",
      "Phone / WhatsApp: +91 96195 61657",
      "Email: sales@sriyaanmetals.com",
      "",
      "Regards,",
      "SRIYAAN METALS",
      "Opera House, Mumbai",
    ].join("\n"),
  };
}
