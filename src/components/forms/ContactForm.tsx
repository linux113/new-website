"use client";

import { submitContactAction } from "@/lib/public-actions";
import { Field, PublicForm, TextArea, TextInput } from "./PublicForm";

export function ContactForm() {
  return (
    <PublicForm
      action={submitContactAction}
      submitLabel="Send message"
      successTitle="Your message has been received."
      successBody="It will be reviewed during working hours. For urgent matters, call or WhatsApp us directly."
    >
      {({ fieldErrors }) => (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field name="name" label="Name" error={fieldErrors.name}>
              <TextInput name="name" autoComplete="name" required error={fieldErrors.name} />
            </Field>
            <Field name="company" label="Company" optional error={fieldErrors.company}>
              <TextInput name="company" autoComplete="organization" error={fieldErrors.company} />
            </Field>
            <Field name="email" label="Email" error={fieldErrors.email}>
              <TextInput name="email" type="email" inputMode="email" autoComplete="email" required error={fieldErrors.email} />
            </Field>
            <Field name="phone" label="Phone" optional error={fieldErrors.phone}>
              <TextInput name="phone" type="tel" inputMode="tel" autoComplete="tel" error={fieldErrors.phone} />
            </Field>
          </div>
          <Field name="subject" label="Subject" optional error={fieldErrors.subject}>
            <TextInput name="subject" error={fieldErrors.subject} />
          </Field>
          <Field name="message" label="Message" error={fieldErrors.message}>
            <TextArea name="message" required error={fieldErrors.message} />
          </Field>
        </>
      )}
    </PublicForm>
  );
}
