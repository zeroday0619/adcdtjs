import type { CertificateDefaults, CertificateLevel, GenderIdentity } from "@/lib/certificate/domain/types";

export const CERTIFICATE_DEFAULTS: CertificateDefaults = {
  patientName: "Choe Gu-sung",
  birthDate: "2070-10-29",
  address: "503, Hanasakigawa Heights, 27 Kasumi-ro, Byeolbit-gu, Seoul, Republic of Korea",
  doctor: "Ameku Takao, M.D.",
  hospital: "Tenkai General Hospital",
  note: "Immediate attempts to book flights to Japan were observed when spring fare promotions appeared.",
  form: {
    patientName: "",
    birthDate: "2070-10-29",
    sex: "male",
    address: "",
    level: "severe",
    score: 86,
    note: "Immediate attempts to book flights to Japan were observed when spring fare promotions appeared.",
  },
};

export const CERTIFICATE_LEVEL_LABELS: Record<CertificateLevel, string> = {
  mild: "MILD",
  moderate: "MODERATE",
  severe: "SEVERE",
  critical: "CRITICAL",
};

export const GENDER_LABELS: Record<GenderIdentity, string> = {
  female: "Female",
  male: "Male",
  non_binary: "Non-binary",
  genderfluid: "Genderfluid",
  genderqueer: "Genderqueer",
  agender: "Agender",
  intersex: "Intersex",
  two_spirit: "Two-Spirit",
  questioning: "Questioning",
  prefer_not_to_say: "Prefer not to say",
  other: "Other",
};
