import { CERTIFICATE_DEFAULTS } from "@/lib/certificate/domain/constants";
import { formatIssuedAt } from "@/lib/certificate/domain/formatters";
import type { CertificateFormState, CertificatePrintData } from "@/lib/certificate/domain/types";

export function buildCertificatePrintData(
  form: CertificateFormState,
  certificateId: string,
  issuedAt: number,
  fallbackAddress: string = CERTIFICATE_DEFAULTS.address,
): CertificatePrintData {
  return {
    patient: form.patientName || CERTIFICATE_DEFAULTS.patientName,
    birth: form.birthDate || CERTIFICATE_DEFAULTS.birthDate,
    sex: form.sex,
    address: form.address || fallbackAddress,
    redactedFields: form.redactedFields,
    doctor: CERTIFICATE_DEFAULTS.doctor,
    hospital: CERTIFICATE_DEFAULTS.hospital,
    level: form.level,
    score: form.score,
    note: form.note,
    issued: formatIssuedAt(issuedAt),
    issuedUnix: Math.floor(issuedAt / 1000),
    serial: certificateId,
  };
}
