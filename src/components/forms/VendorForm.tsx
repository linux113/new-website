"use client";

import { submitVendorAction } from "@/lib/public-actions";
import { Field, PublicForm, TextArea, TextInput } from "./PublicForm";

export function VendorForm() {
  return (
    <PublicForm
      action={submitVendorAction}
      submitLabel="Submit request"
      successTitle="Your request has been received."
      successBody="Our purchase team will review your offering and respond if there is a fit."
      honeypotName="website_hp"
    >
      {({ fieldErrors }) => (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field name="name" label="Contact name" error={fieldErrors.name}>
              <TextInput name="name" autoComplete="name" required error={fieldErrors.name} />
            </Field>
            <Field name="company" label="Company" error={fieldErrors.company}>
              <TextInput name="company" autoComplete="organization" required error={fieldErrors.company} />
            </Field>
            <Field name="email" label="Email" error={fieldErrors.email}>
              <TextInput name="email" type="email" inputMode="email" autoComplete="email" required error={fieldErrors.email} />
            </Field>
            <Field name="phone" label="Phone" optional error={fieldErrors.phone}>
              <TextInput name="phone" type="tel" inputMode="tel" autoComplete="tel" error={fieldErrors.phone} />
            </Field>
            <Field name="whatsapp" label="WhatsApp" optional error={fieldErrors.whatsapp}>
              <TextInput name="whatsapp" type="tel" inputMode="tel" error={fieldErrors.whatsapp} />
            </Field>
            <Field name="vendorWebsite" label="Website" optional error={fieldErrors.vendorWebsite}>
              <TextInput name="vendorWebsite" type="url" inputMode="url" error={fieldErrors.vendorWebsite} />
            </Field>
          </div>
          <Field name="offering" label="What do you supply?" error={fieldErrors.offering}>
            <TextInput name="offering" required error={fieldErrors.offering} />
          </Field>
          <Field name="message" label="Additional information" optional error={fieldErrors.message}>
            <TextArea name="message" error={fieldErrors.message} />
          </Field>
        </>
      )}
    </PublicForm>
  );
}
