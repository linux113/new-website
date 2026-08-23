import "server-only";

/** General contact templates. */

interface ContactData {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export function contactNotification(data: ContactData) {
  const lines = [
    "New contact message — sriyaanmetals.com",
    "",
    `Name:     ${data.name}`,
    data.company ? `Company:  ${data.company}` : null,
    `Email:    ${data.email}`,
    data.phone ? `Phone:    ${data.phone}` : null,
    data.subject ? `Subject:  ${data.subject}` : null,
    "",
    "Message:",
    data.message,
    "",
    "— Review from the admin panel (/admin/enquiries).",
  ].filter((line): line is string => line !== null);

  return {
    subject: `Contact — ${data.subject ?? data.name}`,
    text: lines.join("\n"),
    replyTo: data.email,
  };
}

export function contactAcknowledgement(data: { name: string }) {
  return {
    subject: "Your message has been received — SRIYAAN METALS",
    text: [
      `Dear ${data.name},`,
      "",
      "Thank you for contacting SRIYAAN METALS. Your message has been",
      "received and will be reviewed during working hours",
      "(10:00 AM – 7:00 PM IST).",
      "",
      "Regards,",
      "SRIYAAN METALS",
      "Opera House, Mumbai",
    ].join("\n"),
  };
}
