import { detectCertificatePlatform } from "@/lib/certificate/platform/detect-platform";
import { ReactPdfCertificateRenderer } from "@/lib/certificate/services/react-pdf-certificate-renderer";
import { CertificateOutputService } from "@/lib/certificate/services/certificate-output-service";

import { CertificateBuilderWorkflow } from "@/lib/certificate/app/certificate-builder-workflow";

let certificateBuilderWorkflow: CertificateBuilderWorkflow | null = null;

export function createCertificateBuilderWorkflow() {
  if (!certificateBuilderWorkflow) {
    certificateBuilderWorkflow = new CertificateBuilderWorkflow(
      new CertificateOutputService(
        new ReactPdfCertificateRenderer(),
        detectCertificatePlatform(),
      ),
    );
  }

  return certificateBuilderWorkflow;
}
