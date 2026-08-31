import "server-only";

/**
 * Email provider abstraction.
 *
 * - Resend-compatible HTTP provider when EMAIL_PROVIDER_API_KEY is
 *   set (single POST endpoint — no SDK dependency).
 * - Development fallback: logs the message server-side and reports
 *   `delivered: false`. We never pretend an email was sent.
 *
 * Recipient routing lives in WebsiteSetting (admin-configurable
 * later) with verified company defaults per department.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export interface EmailResult {
  delivered: boolean;
  detail?: string;
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function isConfigured(): boolean {
  return Boolean(process.env.EMAIL_PROVIDER_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  if (!isConfigured()) {
    // DEVELOPMENT-SAFE LOGGING — not a fake success.
    console.info(
      `[email:not-configured] would send → ${message.to} | ${message.subject}`,
    );
    return { delivered: false, detail: "Email provider not configured" };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EMAIL_PROVIDER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        ...(message.html ? { html: message.html } : {}),
        ...(message.replyTo || process.env.EMAIL_REPLY_TO
          ? { reply_to: message.replyTo ?? process.env.EMAIL_REPLY_TO }
          : {}),
      }),
    });

    if (!response.ok) {
      console.error(`[email] provider error ${response.status}`);
      return { delivered: false, detail: `Provider error ${response.status}` };
    }
    return { delivered: true };
  } catch (error) {
    console.error(
      "[email] send failed:",
      error instanceof Error ? error.message : error,
    );
    return { delivered: false, detail: "Send failed" };
  }
}

/* ------------------------------------------------------------------ */
/* Recipient routing (verified company addresses as defaults;         */
/* overridable via WebsiteSetting keys notify.<kind>)                 */
/* ------------------------------------------------------------------ */

export type NotificationKind = "enquiry" | "contact" | "vendor";

const DEFAULT_RECIPIENTS: Record<NotificationKind, string> = {
  enquiry: "sales@sriyaanmetals.com",
  contact: "info@sriyaanmetals.com",
  vendor: "purchase@sriyaanmetals.com",
};

export async function getNotificationRecipient(
  kind: NotificationKind,
): Promise<string> {
  try {
    const { db } = await import("@/lib/db");
    const setting = await db.websiteSetting.findUnique({
      where: { key: `notify.${kind}` },
    });
    const value = setting ? String(setting.value) : "";
    if (value && value.includes("@")) return value;
  } catch {
    /* fall through to default */
  }
  return DEFAULT_RECIPIENTS[kind];
}
