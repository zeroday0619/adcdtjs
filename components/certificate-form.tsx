"use client";

import type { FormEvent } from "react";

import { getCertificateFormCatalog } from "@/lib/certificate/app/certificate-form-catalog";
import type { CertificateFormState } from "@/lib/certificate/domain/types";

export function CertificateForm({
  form,
  addressPlaceholder,
  isIssued,
  isPrinting,
  onSubmit,
  onPrint,
  onFieldChange,
}: {
  form: CertificateFormState;
  addressPlaceholder: string;
  isIssued: boolean;
  isPrinting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPrint: () => void;
  onFieldChange: <K extends keyof CertificateFormState>(
    key: K,
    value: CertificateFormState[K],
  ) => void;
}) {
  function handleRedactionToggle(
    key: (typeof form.redactedFields)[number],
    checked: boolean,
  ) {
    const nextRedactedFields = checked
      ? [...new Set([...form.redactedFields, key])]
      : form.redactedFields.filter((field) => field !== key);

    onFieldChange("redactedFields", nextRedactedFields);
  }

  const formCatalog = getCertificateFormCatalog();
  const nameField = formCatalog.getNameField();
  const birthDateField = formCatalog.getBirthDateField();
  const genderField = formCatalog.getGenderField();
  const addressField = formCatalog.getAddressField(addressPlaceholder);
  const severityField = formCatalog.getSeverityField();
  const scoreField = formCatalog.getScoreField();
  const noteField = formCatalog.getNoteField();
  const redactionFields = formCatalog.getRedactionFields();
  const redactionHelpText = formCatalog.getRedactionHelpText();

  return (
    <form
      onSubmit={onSubmit}
      className="no-print form-glass rounded-box flex flex-col gap-4 border p-5 shadow-lg"
    >
      <label className="form-control gap-2">
        <span className="label-text font-medium">{nameField.label}</span>
        <input
          className="input input-bordered bg-base-100"
          placeholder={nameField.placeholder}
          value={form.patientName}
          onChange={(event) => onFieldChange("patientName", event.target.value)}
          required={nameField.required}
        />
      </label>

      <label className="form-control gap-2">
        <span className="label-text font-medium">{birthDateField.label}</span>
        <input
          type="date"
          className="input input-bordered bg-base-100"
          value={form.birthDate}
          onChange={(event) => onFieldChange("birthDate", event.target.value)}
        />
      </label>

      <label className="form-control gap-2">
        <span className="label-text font-medium">{genderField.label}</span>
        <select
          className="select select-bordered bg-base-100"
          value={form.sex}
          onChange={(event) => onFieldChange("sex", event.target.value as CertificateFormState["sex"])}
        >
          {genderField.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="form-control gap-2">
        <span className="label-text font-medium">{addressField.label}</span>
        <textarea
          className="textarea textarea-bordered h-20 bg-base-100 overflow-x-hidden [text-wrap:wrap] break-words"
          placeholder={addressField.placeholder}
          value={form.address}
          onChange={(event) => onFieldChange("address", event.target.value)}
        />
      </label>

      <fieldset className="form-control gap-2">
        <legend className="label-text font-medium">Redacted PDF Options</legend>
        <p className="text-sm text-base-content/70">
          {redactionHelpText.prefix}
          <span className="font-mono">{redactionHelpText.marker}</span>
          {redactionHelpText.suffix}
        </p>
        {redactionFields.map((field) => (
          <label key={field.key} className="label flex w-full cursor-pointer justify-start gap-3 py-1">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={form.redactedFields.includes(field.key)}
              onChange={(event) => handleRedactionToggle(field.key, event.target.checked)}
            />
            <span className="label-text">{field.label}</span>
          </label>
        ))}
      </fieldset>

      <label className="form-control gap-2">
        <span className="label-text font-medium">{severityField.label}</span>
        <select
          className="select select-bordered bg-base-100"
          value={form.level}
          onChange={(event) => onFieldChange("level", event.target.value as CertificateFormState["level"])}
        >
          {severityField.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="form-control gap-2">
        <span className="label-text font-medium">{scoreField.label}: {form.score}</span>
        <input
          type="range"
          min={scoreField.min}
          max={scoreField.max}
          className="range range-primary"
          value={form.score}
          onChange={(event) => onFieldChange("score", Number(event.target.value))}
        />
      </label>

      <label className="form-control gap-2">
        <span className="label-text font-medium">{noteField.label}</span>
        <textarea
          className="textarea textarea-bordered h-28 bg-base-100 overflow-x-hidden [text-wrap:wrap] break-words"
          value={form.note}
          onChange={(event) => onFieldChange("note", event.target.value)}
        />
      </label>

      <div className="mt-2 flex gap-2">
        <button type="submit" className="btn btn-primary flex-1">
          Issue Certificate
        </button>
        <button
          type="button"
          className="btn btn-secondary flex-1"
          onClick={onPrint}
          disabled={!isIssued || isPrinting}
        >
          {isPrinting ? "Rendering PDF..." : "Print"}
        </button>
      </div>
    </form>
  );
}
