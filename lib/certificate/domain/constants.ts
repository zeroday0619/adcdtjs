import type {
  CertificateDefaults,
  CertificateLevel,
  GenderIdentity,
  RedactableField,
} from "@/lib/certificate/domain/types";

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
    redactedFields: [],
    level: "severe",
    score: 86,
    note: "Immediate attempts to book flights to Japan were observed when spring fare promotions appeared.",
  },
};

export const SAMPLE_ADDRESSES = [
  "301, CiRCLE Plaza, 12 Marina-ro, Live-gu, Seoul, Republic of Korea",
  "908, RiNG Tower, 69 Rinko-daero, Beat-gu, Seoul, Republic of Korea",
  "101, SPACE Annex, 3 Shifune-ro, Oldtown-gu, Seoul, Republic of Korea",
  "503, Hanasakigawa Heights, 27 Kasumi-ro, Byeolbit-gu, Seoul, Republic of Korea",
  "1305, Ave Mujica Hall, 66 Oblivionis-daero, Gekkou-gu, Seoul, Republic of Korea",
  "1204, Roselia Manor, 13 Yukina-daero, Arian-gu, Seoul, Republic of Korea",
  "302, MyGO!!!!! House, 5 Tomori-ro, Mayoi-gu, Seoul, Republic of Korea",
  "702, Haneoka Terrace, 18 Ran-ro, Noeul-gu, Seoul, Republic of Korea",
] as const;

export function pickRandomSampleAddress(): string {
  const randomIndex = Math.floor(Math.random() * SAMPLE_ADDRESSES.length);
  return SAMPLE_ADDRESSES[randomIndex] ?? CERTIFICATE_DEFAULTS.address;
}

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

export const REDACTION_FIELD_LABELS: Record<RedactableField, string> = {
  birthDate: "Date of Birth",
  sex: "Gender Identity",
  address: "Address",
};
