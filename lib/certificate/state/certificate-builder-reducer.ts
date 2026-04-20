import { CERTIFICATE_DEFAULTS, pickRandomSampleAddress } from "@/lib/certificate/domain/constants";
import type { CertificateFormState } from "@/lib/certificate/domain/types";

export type CertificateBuilderState = {
  form: CertificateFormState;
  sampleAddress: string;
  certificateId: string;
  issuedAt: number;
  isIssued: boolean;
  isPreviewRendering: boolean;
  isPrinting: boolean;
  previewUrl: string | null;
};

export type CertificateBuilderAction =
  | { type: "field/update"; key: keyof CertificateFormState; value: CertificateFormState[keyof CertificateFormState] }
  | { type: "certificate/issue"; certificateId: string; issuedAt: number }
  | { type: "preview/render-start" }
  | { type: "preview/render-success"; url: string | null }
  | { type: "preview/render-finish" }
  | { type: "print/start" }
  | { type: "print/finish" };

export function createInitialCertificateBuilderState(
  certificateId: string,
): CertificateBuilderState {
  return {
    form: CERTIFICATE_DEFAULTS.form,
    sampleAddress: pickRandomSampleAddress(),
    certificateId,
    issuedAt: Date.now(),
    isIssued: false,
    isPreviewRendering: true,
    isPrinting: false,
    previewUrl: null,
  };
}

export function certificateBuilderReducer(
  state: CertificateBuilderState,
  action: CertificateBuilderAction,
): CertificateBuilderState {
  switch (action.type) {
    case "field/update":
      return {
        ...state,
        form: {
          ...state.form,
          [action.key]: action.value,
        },
      };
    case "certificate/issue":
      return {
        ...state,
        certificateId: action.certificateId,
        issuedAt: action.issuedAt,
        isIssued: true,
      };
    case "preview/render-start":
      return {
        ...state,
        isPreviewRendering: true,
      };
    case "preview/render-success":
      return {
        ...state,
        previewUrl: action.url,
      };
    case "preview/render-finish":
      return {
        ...state,
        isPreviewRendering: false,
      };
    case "print/start":
      return {
        ...state,
        isPrinting: true,
      };
    case "print/finish":
      return {
        ...state,
        isPrinting: false,
      };
    default:
      return state;
  }
}
