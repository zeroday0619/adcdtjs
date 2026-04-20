"use client";

import { CertificateBuilderShell } from "@/components/certificate-builder-shell";
import { useCertificateBuilder } from "@/lib/certificate/app/use-certificate-builder";

export default function CertificateBuilder() {
  const { state, handleFieldChange, handleIssue, handlePrint } = useCertificateBuilder();

  return <CertificateBuilderShell state={state} onFieldChange={handleFieldChange} onIssue={handleIssue} onPrint={handlePrint} />;
}
