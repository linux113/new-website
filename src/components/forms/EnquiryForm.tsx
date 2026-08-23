"use client";

import { submitEnquiryAction } from "@/lib/public-actions";
import { Field, PublicForm, TextArea, TextInput } from "./PublicForm";

/**
 * Product enquiry (RFQ) form — reused on /enquiry and product pages.
 * Two-column ≥ md per DS §13.
 */
export function EnquiryForm({
  productId,
  productName,
}: {
  productId?: string;
  productName?: string;
}) {
  return (
    <PublicForm
      action={submitEnquiryAction}
      submitLabel="Send enquiry"
      successTitle="Your enquiry has been received."
      successBody="Our sales team will review it during working hours. For urgent requirements, call or WhatsApp us directly."
    >
      {({ fieldErrors }) => (
        <>
          {productId ? <input type="hidden" name="productId" value={productId} /> : null}

          {productName ? (
            <p className="text-mono-meta text-surface-muted">
              Product: <span className="text-surface-fg">{productName}</span>
            </p>
          ) : null}

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
            <Field name="whatsapp" label="WhatsApp" optional error={fieldErrors.whatsapp}>
              <TextInput name="whatsapp" type="tel" inputMode="tel" error={fieldErrors.whatsapp} />
            </Field>
            <Field name="quantity" label="Quantity / requirement" optional error={fieldErrors.requirement}>
              <TextInput name="quantity" error={fieldErrors.requirement} />
            </Field>
          </div>

          <Field name="message" label="Message" error={fieldErrors.message}>
            <TextArea name="message" required error={fieldErrors.message} />
          </Field>
        </>
      )}
    </PublicForm>
  );
}
