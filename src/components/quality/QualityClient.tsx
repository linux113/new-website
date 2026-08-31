"use client";

import { useState } from "react";
import { CertificateCard, CertificateModal, type Certificate } from "./CertificateCard";

interface Props {
  certificates: Certificate[];
}

/**
 * Client wrapper for the certificate grid — owns the selected
 * certificate for the modal and renders the 3D cards.
 */
export function QualityClient({ certificates }: Props) {
  const [open, setOpen] = useState<Certificate | null>(null);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {certificates.map((cert, i) => (
          <CertificateCard
            key={cert.id}
            cert={cert}
            index={i}
            onOpen={setOpen}
          />
        ))}
      </div>

      <CertificateModal cert={open} onClose={() => setOpen(null)} />
    </>
  );
}
