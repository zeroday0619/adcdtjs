"use client";

import type { FormEvent } from "react";

import type { CertificateFormState } from "@/lib/certificate/domain/types";

export function CertificateForm({
  form,
  isIssued,
  isPrinting,
  onSubmit,
  onPrint,
  onFieldChange,
}: {
  form: CertificateFormState;
  isIssued: boolean;
  isPrinting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPrint: () => void;
  onFieldChange: <K extends keyof CertificateFormState>(
    key: K,
    value: CertificateFormState[K],
  ) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="no-print form-glass rounded-box flex flex-col gap-4 border p-5 shadow-lg"
    >
      <label className="form-control gap-2">
        <span className="label-text font-medium">Patient Name</span>
        <input
          className="input input-bordered bg-base-100"
          placeholder="e.g., Choe Gu-sung"
          value={form.patientName}
          onChange={(event) => onFieldChange("patientName", event.target.value)}
          required
        />
      </label>

      <label className="form-control gap-2">
        <span className="label-text font-medium">Date of Birth</span>
        <input
          type="date"
          className="input input-bordered bg-base-100"
          value={form.birthDate}
          onChange={(event) => onFieldChange("birthDate", event.target.value)}
        />
      </label>

      <label className="form-control gap-2">
        <span className="label-text font-medium">Gender Identity</span>
        <select
          className="select select-bordered bg-base-100"
          value={form.sex}
          onChange={(event) => onFieldChange("sex", event.target.value as CertificateFormState["sex"])}
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="non_binary">Non-binary</option>
          <option value="genderfluid">Genderfluid</option>
          <option value="genderqueer">Genderqueer</option>
          <option value="agender">Agender</option>
          <option value="intersex">Intersex</option>
          <option value="two_spirit">Two-Spirit</option>
          <option value="questioning">Questioning</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="form-control gap-2">
        <span className="label-text font-medium">Address</span>
        <textarea
          className="textarea textarea-bordered h-20 bg-base-100 overflow-x-hidden [text-wrap:wrap] break-words"
          placeholder="e.g., 503, Hanasakigawa Heights, 27 Kasumi-ro, Byeolbit-gu, Seoul, Republic of Korea"
          value={form.address}
          onChange={(event) => onFieldChange("address", event.target.value)}
        />
      </label>

      <label className="form-control gap-2">
        <span className="label-text font-medium">Severity</span>
        <select
          className="select select-bordered bg-base-100"
          value={form.level}
          onChange={(event) => onFieldChange("level", event.target.value as CertificateFormState["level"])}
        >
          <option value="mild">Mild - occasional urge</option>
          <option value="moderate">Moderate - manageable but persistent</option>
          <option value="severe">Severe - instant flight-search behavior</option>
          <option value="critical">Critical - already heading to the airport</option>
        </select>
      </label>

      <label className="form-control gap-2">
        <span className="label-text font-medium">Japan Ikitai Score: {form.score}</span>
        <input
          type="range"
          min={0}
          max={100}
          className="range range-primary"
          value={form.score}
          onChange={(event) => onFieldChange("score", Number(event.target.value))}
        />
      </label>

      <label className="form-control gap-2">
        <span className="label-text font-medium">Clinical Notes</span>
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
