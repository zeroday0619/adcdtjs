export type GenderIdentity =
  | "female"
  | "male"
  | "non_binary"
  | "genderfluid"
  | "genderqueer"
  | "agender"
  | "intersex"
  | "two_spirit"
  | "questioning"
  | "prefer_not_to_say"
  | "other";

export type CertificateLevel = "mild" | "moderate" | "severe" | "critical";

export type CertificateFormState = {
  patientName: string;
  birthDate: string;
  sex: GenderIdentity;
  address: string;
  level: CertificateLevel;
  score: number;
  note: string;
};

export type CertificatePrintData = {
  patient: string;
  birth: string;
  sex: GenderIdentity;
  address: string;
  doctor: string;
  hospital: string;
  level: CertificateLevel;
  score: number;
  note: string;
  issued: string;
  serial: string;
};

export type CertificateDefaults = {
  patientName: string;
  birthDate: string;
  address: string;
  doctor: string;
  hospital: string;
  note: string;
  form: CertificateFormState;
};
