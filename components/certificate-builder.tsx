"use client";

import { FormEvent, useEffect, useMemo, useReducer, useRef } from "react";

import { CertificateForm } from "@/components/certificate-form";
import { CertificatePreviewPane } from "@/components/certificate-preview-pane";
import { buildCertificatePrintData } from "@/lib/certificate/domain/factories";
import { detectCertificatePlatform } from "@/lib/certificate/platform/detect-platform";
import { ReactPdfCertificateRenderer } from "@/lib/certificate/services/react-pdf-certificate-renderer";
import { CertificateOutputService } from "@/lib/certificate/services/certificate-output-service";
import {
  certificateBuilderReducer,
  createInitialCertificateBuilderState,
} from "@/lib/certificate/state/certificate-builder-reducer";

export default function CertificateBuilder() {
  const serviceRef = useRef<CertificateOutputService | null>(null);

  if (!serviceRef.current) {
    serviceRef.current = new CertificateOutputService(
      new ReactPdfCertificateRenderer(),
      detectCertificatePlatform(),
    );
  }

  const certificateService = serviceRef.current;
  const [state, dispatch] = useReducer(
    certificateBuilderReducer,
    createInitialCertificateBuilderState(certificateService.generateCertificateId()),
  );
  const previewUrlRef = useRef<string | null>(null);

  const previewPrintData = useMemo(
    () => buildCertificatePrintData(state.form, state.certificateId, state.issuedAt, state.sampleAddress),
    [state.form, state.certificateId, state.issuedAt, state.sampleAddress],
  );

  useEffect(() => {
    let isActive = true;
    dispatch({ type: "preview/render-start" });

    void (async () => {
      try {
        const nextUrl = await certificateService.createPreviewUrl(previewPrintData);

        if (!isActive) {
          certificateService.revokePreviewUrl(nextUrl);
          return;
        }

        if (previewUrlRef.current) {
          certificateService.revokePreviewUrl(previewUrlRef.current);
        }

        previewUrlRef.current = nextUrl;
        dispatch({ type: "preview/render-success", url: nextUrl });
      } catch {
        if (isActive) {
          dispatch({ type: "preview/render-success", url: null });
        }
      } finally {
        if (isActive) {
          dispatch({ type: "preview/render-finish" });
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [certificateService, previewPrintData]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        certificateService.revokePreviewUrl(previewUrlRef.current);
      }
    };
  }, [certificateService]);

  function handleFieldChange<K extends keyof typeof state.form>(key: K, value: (typeof state.form)[K]) {
    dispatch({ type: "field/update", key, value });
  }

  function handleIssue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch({
      type: "certificate/issue",
      certificateId: certificateService.generateCertificateId(),
      issuedAt: Date.now(),
    });
  }

  async function handlePrint() {
    if (!state.isIssued || state.isPrinting) {
      return;
    }

    dispatch({ type: "print/start" });

    try {
      await certificateService.print(previewPrintData);
    } catch {
      window.alert("Unable to render print document. Please try again.");
    } finally {
      dispatch({ type: "print/finish" });
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 print-frame md:px-8 md:py-8">
      <header className="no-print rounded-box border border-base-300/70 bg-base-100/75 px-6 py-5 shadow-lg">
        <p className="text-4xl tracking-wider text-secondary">AEJIS Rapid Response Team, Tenkai General Hospital</p>
        <h1 className="mt-2 text-balance text-2xl font-semibold leading-tight text-neutral md:text-3xl">
          Acute Episode of Japan Ikitai Syndrome Certificate Issuer
        </h1>
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
          onSubmit={handleIssue}
          onPrint={handlePrint}
          onFieldChange={handleFieldChange}
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
