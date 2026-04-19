import { CERTIFICATE_DEFAULTS } from "@/lib/certificate/domain/constants";
import { formatIssuedAt } from "@/lib/certificate/domain/formatters";
import type { CertificateFormState, CertificatePrintData } from "@/lib/certificate/domain/types";

export function buildCertificatePrintData(
  form: CertificateFormState,
  certificateId: string,
  issuedAt: number,
): CertificatePrintData {
  return {
    patient: form.patientName || CERTIFICATE_DEFAULTS.patientName,
    birth: form.birthDate || CERTIFICATE_DEFAULTS.birthDate,
    sex: form.sex,
    address: form.address || CERTIFICATE_DEFAULTS.address,
    doctor: CERTIFICATE_DEFAULTS.doctor,
    hospital: CERTIFICATE_DEFAULTS.hospital,
    level: form.level,
    score: form.score,
    note: form.note,
    issued: formatIssuedAt(issuedAt),
    serial: certificateId,
  };
}
