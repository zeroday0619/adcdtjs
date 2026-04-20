import { buildCertificatePrintData } from "@/lib/certificate/domain/factories";
import type { CertificateFormState, CertificatePrintData } from "@/lib/certificate/domain/types";
import { CertificateOutputService } from "@/lib/certificate/services/certificate-output-service";
import {
  createInitialCertificateBuilderState,
  type CertificateBuilderState,
} from "@/lib/certificate/state/certificate-builder-reducer";

export class CertificateBuilderWorkflow {
  constructor(
    private readonly outputService: CertificateOutputService,
    private readonly now: () => number = () => Date.now(),
  ) {}

  createInitialState(): CertificateBuilderState {
    return createInitialCertificateBuilderState(this.outputService.generateCertificateId());
  }

  buildPreviewPrintData(state: CertificateBuilderState): CertificatePrintData {
    return this.buildPreviewPrintDataFromInput(
      state.form,
      state.certificateId,
      state.issuedAt,
      state.sampleAddress,
    );
  }

  buildPreviewPrintDataFromInput(
    form: CertificateFormState,
    certificateId: string,
    issuedAt: number,
    sampleAddress: string,
  ): CertificatePrintData {
    return buildCertificatePrintData(
      form,
      certificateId,
      issuedAt,
      sampleAddress,
    );
  }

  createIssuePayload() {
    return {
      certificateId: this.outputService.generateCertificateId(),
      issuedAt: this.now(),
    };
  }

  async createPreviewUrl(data: CertificatePrintData) {
    return this.outputService.createPreviewUrl(data);
  }

  revokePreviewUrl(url: string) {
    this.outputService.revokePreviewUrl(url);
  }

  async print(data: CertificatePrintData) {
    await this.outputService.print(data);
  }
}
