"use client";

import type { FormEvent } from "react";
import { useDeferredValue, useEffect, useMemo, useReducer, useRef } from "react";

import type { CertificateFormState } from "@/lib/certificate/domain/types";
import { createCertificateBuilderWorkflow } from "@/lib/certificate/app/create-certificate-builder-workflow";
import {
  certificateBuilderReducer,
} from "@/lib/certificate/state/certificate-builder-reducer";

export function useCertificateBuilder() {
  const previewRenderDelayMs = 250;
  const workflowRef = useRef(createCertificateBuilderWorkflow());
  const workflow = workflowRef.current;
  const [state, dispatch] = useReducer(
    certificateBuilderReducer,
    undefined,
    () => workflow.createInitialState(),
  );
  const previewUrlRef = useRef<string | null>(null);

  const deferredPreviewState = useDeferredValue({
    form: state.form,
    sampleAddress: state.sampleAddress,
    certificateId: state.certificateId,
    issuedAt: state.issuedAt,
  });

  const previewPrintData = useMemo(
    () =>
      workflow.buildPreviewPrintDataFromInput(
        deferredPreviewState.form,
        deferredPreviewState.certificateId,
        deferredPreviewState.issuedAt,
        deferredPreviewState.sampleAddress,
      ),
    [
      deferredPreviewState.certificateId,
      deferredPreviewState.form,
      deferredPreviewState.issuedAt,
      deferredPreviewState.sampleAddress,
      workflow,
    ],
  );

  useEffect(() => {
    let isActive = true;
    dispatch({ type: "preview/render-start" });

    const timerId = window.setTimeout(() => {
      void (async () => {
        try {
          const nextUrl = await workflow.createPreviewUrl(previewPrintData);

          if (!isActive) {
            workflow.revokePreviewUrl(nextUrl);
            return;
          }

          if (previewUrlRef.current) {
            workflow.revokePreviewUrl(previewUrlRef.current);
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
    }, previewRenderDelayMs);

    return () => {
      isActive = false;
      window.clearTimeout(timerId);
    };
  }, [previewPrintData, previewRenderDelayMs, workflow]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        workflow.revokePreviewUrl(previewUrlRef.current);
      }
    };
  }, [workflow]);

  function handleFieldChange<K extends keyof CertificateFormState>(
    key: K,
    value: CertificateFormState[K],
  ) {
    dispatch({ type: "field/update", key, value });
  }

  function handleIssue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issuePayload = workflow.createIssuePayload();

    dispatch({
      type: "certificate/issue",
      certificateId: issuePayload.certificateId,
      issuedAt: issuePayload.issuedAt,
    });
  }

  async function handlePrint() {
    if (!state.isIssued || state.isPrinting) {
      return;
    }

    dispatch({ type: "print/start" });

    try {
      await workflow.print(previewPrintData);
    } catch {
      window.alert("Unable to render print document. Please try again.");
    } finally {
      dispatch({ type: "print/finish" });
    }
  }

  return {
    state,
    handleFieldChange,
    handleIssue,
    handlePrint,
  };
}
