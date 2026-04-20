import {
  CERTIFICATE_LEVEL_LABELS,
  GENDER_LABELS,
  REDACTION_FIELD_LABELS,
} from "@/lib/certificate/domain/constants";
import type {
  CertificateFormState,
  RedactableField,
} from "@/lib/certificate/domain/types";

type TextFieldDefinition<K extends keyof CertificateFormState> = {
  key: K;
  label: string;
  placeholder?: string;
  required?: boolean;
};

type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type SelectFieldDefinition<K extends keyof CertificateFormState> = {
  key: K;
  label: string;
  options: SelectOption<Extract<CertificateFormState[K], string>>[];
};

type SliderFieldDefinition<K extends keyof CertificateFormState> = {
  key: K;
  label: string;
  min: number;
  max: number;
};

type RedactionFieldDefinition = {
  key: RedactableField;
  label: string;
};

export class CertificateFormCatalog {
  getNameField(): TextFieldDefinition<"patientName"> {
    return {
      key: "patientName",
      label: "Patient Name",
      placeholder: "e.g., Choe Gu-sung",
      required: true,
    };
  }

  getBirthDateField(): TextFieldDefinition<"birthDate"> {
    return {
      key: "birthDate",
      label: "Date of Birth",
    };
  }

  getAddressField(addressPlaceholder: string): TextFieldDefinition<"address"> {
    return {
      key: "address",
      label: "Address",
      placeholder: `e.g., ${addressPlaceholder}`,
    };
  }

  getNoteField(): TextFieldDefinition<"note"> {
    return {
      key: "note",
      label: "Clinical Notes",
    };
  }

  getScoreField(): SliderFieldDefinition<"score"> {
    return {
      key: "score",
      label: "Japan Ikitai Score",
      min: 0,
      max: 100,
    };
  }

  getGenderField(): SelectFieldDefinition<"sex"> {
    return {
      key: "sex",
      label: "Gender Identity",
      options: Object.entries(GENDER_LABELS).map(([value, label]) => ({
        value: value as CertificateFormState["sex"],
        label,
      })),
    };
  }

  getSeverityField(): SelectFieldDefinition<"level"> {
    const severityDescriptions: Record<CertificateFormState["level"], string> = {
      mild: "occasional urge",
      moderate: "manageable but persistent",
      severe: "instant flight-search behavior",
      critical: "already heading to the airport",
    };

    return {
      key: "level",
      label: "Severity",
      options: Object.entries(CERTIFICATE_LEVEL_LABELS).map(([value, label]) => ({
        value: value as CertificateFormState["level"],
        label: `${label.charAt(0)}${label.slice(1).toLowerCase()} - ${severityDescriptions[value as CertificateFormState["level"]]}`,
      })),
    };
  }

  getRedactionFields(): RedactionFieldDefinition[] {
    return Object.entries(REDACTION_FIELD_LABELS).map(([key, label]) => ({
      key: key as RedactableField,
      label,
    }));
  }

  getRedactionHelpText() {
    return {
      prefix: "Select one or more fields to render as ",
      marker: "[REDACTED]",
      suffix: " in the PDF.",
    };
  }
}

let certificateFormCatalog: CertificateFormCatalog | null = null;

export function getCertificateFormCatalog() {
  if (!certificateFormCatalog) {
    certificateFormCatalog = new CertificateFormCatalog();
  }

  return certificateFormCatalog;
}
