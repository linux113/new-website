"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContactAction } from "@/lib/public-actions";
import type { PublicFormState } from "@/lib/public-actions";
import { cn } from "@/lib/cn";
import { whatsappGeneralUrl } from "@/lib/whatsapp";

/**
 * Premium enquiry form (dark, sharp, technical).
 *
 * Wires to the existing secure server action `submitContactAction`
 * (rate-limit → honeypot → strict Zod validation → DB persist →
 * email notification). Handles its own loading / success / error
 * states with restrained champagne-accent micro-interactions:
 *  - inputs: 1px dark border → #B89A62 + 1px glow on focus
 *  - submit: arrow translates +8px on hover
 *  - loading: elegant line loader in place of the arrow
 *  - success: cinematic "ENQUIRY RECEIVED" panel (no cartoon check)
 *  - errors: inline, accessible (aria-invalid / aria-describedby)
 */

const initialState: PublicFormState = {};

export function ContactEnquiryForm() {
  const [state, formAction, pending] = useActionState(
    submitContactAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [focused, setFocused] = useState<string | null>(null);

  // Move focus to the first invalid field after a failed submit.
  useEffect(() => {
    if (state.fieldErrors && formRef.current) {
      const first = formRef.current.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
    }
  }, [state.fieldErrors]);

  if (state.ok) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="relative overflow-hidden border border-[#B89A62]/30 bg-[#101314] p-8 lg:p-12"
      >
        <div
          aria-hidden="true"
          className="absolute -top-24 right-0 h-64 w-64 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(184,154,98,0.18), transparent 70%)" }}
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#B89A62]">
          03 / Received
        </p>
        <h3 className="mt-4 font-display text-3xl font-medium uppercase tracking-tight text-[#F5F7F8] md:text-4xl">
          Enquiry
          <br />
          Received.
        </h3>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-[#A9B2BA]">
          Thank you. Our team will contact you shortly. For urgent
          requirements, call or message us directly on WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={whatsappGeneralUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-12 items-center gap-2 border border-[#B89A62]/40 px-6 font-mono text-[12px] uppercase tracking-[0.2em] text-[#F5F7F8] transition-colors duration-200 hover:border-[#B89A62] hover:bg-[#B89A62]/10"
          >
            Chat on WhatsApp
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              ↗
            </span>
          </a>
        </div>
      </div>
    );
  }

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="relative"
      onFocus={(e) => {
        const t = e.target as HTMLElement;
        if (t.dataset && "field" in t.dataset) setFocused(t.dataset.field ?? null);
      }}
      onBlur={() => setFocused(null)}
    >
      {state.error ? (
        <div
          role="alert"
          className="mb-6 border border-red-500/40 bg-red-500/5 px-4 py-3 font-mono text-[12px] uppercase tracking-[0.15em] text-red-300"
        >
          {state.error}
        </div>
      ) : null}

      {/* Honeypot — visually hidden, tab-skipped; bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <Field
          id="name"
          label="Full Name"
          error={fieldErrors.name}
          focused={focused === "name"}
          required
        >
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            data-field="name"
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={inputClass(Boolean(fieldErrors.name))}
          />
        </Field>

        <Field
          id="company"
          label="Company Name"
          error={fieldErrors.company}
          focused={focused === "company"}
          optional
        >
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            data-field="company"
            aria-invalid={fieldErrors.company ? true : undefined}
            aria-describedby={fieldErrors.company ? "company-error" : undefined}
            className={inputClass(Boolean(fieldErrors.company))}
          />
        </Field>

        <Field
          id="email"
          label="Email Address"
          error={fieldErrors.email}
          focused={focused === "email"}
          required
        >
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            data-field="email"
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={inputClass(Boolean(fieldErrors.email))}
          />
        </Field>

        <Field
          id="phone"
          label="Phone Number"
          error={fieldErrors.phone}
          focused={focused === "phone"}
          optional
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            data-field="phone"
            aria-invalid={fieldErrors.phone ? true : undefined}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            className={inputClass(Boolean(fieldErrors.phone))}
          />
        </Field>

        <Field
          id="subject"
          label="Subject"
          error={fieldErrors.subject}
          focused={focused === "subject"}
          optional
          className="md:col-span-2"
        >
          <input
            id="subject"
            name="subject"
            type="text"
            data-field="subject"
            aria-invalid={fieldErrors.subject ? true : undefined}
            aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
            className={inputClass(Boolean(fieldErrors.subject))}
          />
        </Field>

        <Field
          id="message"
          label="Message"
          error={fieldErrors.message}
          focused={focused === "message"}
          required
          className="md:col-span-2"
        >
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            data-field="message"
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={fieldErrors.message ? "message-error" : undefined}
            className={cn(inputClass(Boolean(fieldErrors.message)), "min-h-[10rem] resize-y py-4")}
          />
        </Field>

        <Field
          id="requirement"
          label="Product / Requirement"
          error={undefined}
          focused={focused === "requirement"}
          optional
          className="md:col-span-2"
        >
          <input
            id="requirement"
            name="requirement"
            type="text"
            data-field="requirement"
            placeholder="Grade, size, quantity, delivery point (optional)"
            className={inputClass(false)}
          />
        </Field>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex h-13 items-center justify-center gap-3 overflow-hidden border border-[#B89A62] bg-[#B89A62] px-9 font-mono text-[12px] uppercase tracking-[0.22em] text-[#080A0B] transition-colors duration-300 hover:bg-[#c9ac72] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? (
            <span className="flex items-center gap-3">
              <span className="contact-loader h-3 w-3" aria-hidden="true" />
              Sending
            </span>
          ) : (
            <>
              Send Enquiry
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
              >
                ↗
              </span>
            </>
          )}
        </button>

        <a
          href={whatsappGeneralUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-13 items-center justify-center gap-3 border border-white/15 px-9 font-mono text-[12px] uppercase tracking-[0.22em] text-[#F5F7F8] transition-all duration-300 hover:border-[#B89A62]/60 hover:bg-white/[0.03]"
        >
          WhatsApp Us
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
          >
            ↗
          </span>
        </a>
      </div>

      <p className="mt-5 font-mono text-xs tracking-[0.1em] text-[#727D86]">
        By submitting, you agree to be contacted regarding your enquiry.
      </p>
    </form>
  );
}

/* ---------------- Building blocks ---------------- */

function Field({
  id,
  label,
  error,
  required,
  optional,
  focused,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  focused?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <label
        htmlFor={id}
        className={cn(
          "font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-200",
          focused ? "text-[#F5F7F8]" : "text-[#727D86]",
          error && "text-red-300",
        )}
      >
        {label}
        {required ? <span className="text-[#B89A62]"> *</span> : null}
        {optional ? <span className="text-[#727D86]"> (Optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="font-mono text-[11px] uppercase tracking-[0.15em] text-red-300"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "h-13 w-full border bg-[#101314] px-4 text-[16px] text-[#F5F7F8]",
    "placeholder:text-[#727D86] transition-[border-color,box-shadow,background-color] duration-200",
    "focus:outline-none",
    invalid
      ? "border-red-500/60 focus:border-red-400 focus:shadow-[0_0_0_1px_rgba(220,80,80,0.2)]"
      : "border-white/10 hover:border-white/20 focus:border-[#B89A62] focus:shadow-[0_0_0_1px_rgba(184,154,98,0.18)]",
  );
}
