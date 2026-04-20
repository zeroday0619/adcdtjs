import type { FormEvent } from "react";

import { CertificateForm } from "@/components/certificate-form";
import { CertificatePreviewPane } from "@/components/certificate-preview-pane";
import type { CertificateBuilderState } from "@/lib/certificate/state/certificate-builder-reducer";
import type { CertificateFormState } from "@/lib/certificate/domain/types";

export function CertificateBuilderShell({
  state,
  onFieldChange,
  onIssue,
  onPrint,
}: {
  state: CertificateBuilderState;
  onFieldChange: <K extends keyof CertificateFormState>(
    key: K,
    value: CertificateFormState[K],
  ) => void;
  onIssue: (event: FormEvent<HTMLFormElement>) => void;
  onPrint: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 print-frame md:px-8 md:py-8">
      <header className="no-print rounded-box border border-base-300/70 bg-base-100/75 px-6 py-5 shadow-lg">
        <p className="text-4xl tracking-wider text-secondary">AEJIS Rapid Response Team, Tenkai General Hospital</p>
        <h2 className="mt-2 text-balance text-2xl font-semibold leading-tight text-neutral md:text-3xl">
          Acute Episode of Japan Ikitai Syndrome Certificate Issuer
        </h2>
        <p className="mt-2 text-sm text-neutral/80">
          This is a parody page for fun. Do not use it as a real medical document.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <CertificateForm
          form={state.form}
          addressPlaceholder={state.sampleAddress}
          isIssued={state.isIssued}
          isPrinting={state.isPrinting}
          onSubmit={onIssue}
          onPrint={onPrint}
          onFieldChange={onFieldChange}
        />

        <CertificatePreviewPane
          pdfUrl={state.previewUrl}
          certificateId={state.certificateId}
          isLoading={state.isPreviewRendering}
        />
      </div>

      <footer className="no-print rounded-box border border-base-300/70 bg-base-100/70 px-6 py-4 text-sm leading-relaxed text-neutral/80 shadow-lg">
        <p>
          위 사이트는 오픈소스로 공개되어 있습니다. 구현이 궁금하거나 직접 수정해서 써보고 싶다면{" "}
          <a
            href="https://github.com/zeroday0619/AEJIS"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-secondary underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            GitHub 저장소
          </a>
          에서 소스 코드를 확인하실 수 있습니다.
        </p>
        <p className="mt-2">
          개발자에게 후원은 엄청 큰 도움이 됩니다. 프로젝트가 즐거우셨다면{" "}
          <a
            href="https://github.com/sponsors/zeroday0619"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-secondary underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            GitHub Sponsors
          </a>
          또는{" "}
          <a
            href="https://patreon.com/zeroday0619"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-secondary underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            Patreon
          </a>
          을 통해 응원해 주세요.
        </p>
      </footer>
    </div>
  );
}
