"use client";

import { FormData } from "../types";

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
}

function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-3 mt-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`toggle-pill flex-1 justify-center ${value === true ? "selected" : ""}`}
      >
        <span className="text-base">{value === true ? "✓" : "○"}</span>
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`toggle-pill flex-1 justify-center ${value === false ? "selected" : ""}`}
      >
        <span className="text-base">{value === false ? "✓" : "○"}</span>
        No
      </button>
    </div>
  );
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-white/80 uppercase tracking-wider">
        {label}
      </label>
      {hint && <p className="text-xs text-white/40">{hint}</p>}
      {children}
    </div>
  );
}

export default function Step1Intake({ data, onChange, onNext }: Props) {
  const isValid =
    data.civicAddress.trim() &&
    data.pid.trim() &&
    data.zone.trim() &&
    data.proposedUse.trim() &&
    data.hasDevelopmentAgreement !== null &&
    data.hasRestrictiveCovenant !== null;

  return (
    <div className="animate-slide-up space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-2">
          Step 1 of 3
        </div>
        <h2 className="text-2xl font-bold text-white">Property Intake Form</h2>
        <p className="text-white/50 text-sm max-w-lg mx-auto">
          Provide details about the subject property and the instruments found on
          title. All processing happens locally — your data never leaves this
          page.
        </p>
      </div>

      {/* Form grid */}
      <div className="glass-card p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Civic Address"
            hint="Full civic address including street number, name, and municipality"
          >
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 123 Example Street, Halifax, NS"
              value={data.civicAddress}
              onChange={(e) => onChange({ civicAddress: e.target.value })}
            />
          </FormField>

          <FormField
            label="Property Identification Number (PID)"
            hint="9-digit PID as shown on your Abstract of Title"
          >
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 00123456"
              value={data.pid}
              onChange={(e) => onChange({ pid: e.target.value })}
            />
          </FormField>

          <FormField
            label="Current Zone Designation"
            hint="Zoning as per HRM Land Use By-law or Municipal By-law"
          >
            <input
              type="text"
              className="form-input"
              placeholder="e.g. R-2, CEN-1, ER"
              value={data.zone}
              onChange={(e) => onChange({ zone: e.target.value })}
            />
          </FormField>

          <FormField
            label="Proposed Use"
            hint="What development or use is being proposed for the property?"
          >
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Four-unit residential building"
              value={data.proposedUse}
              onChange={(e) => onChange({ proposedUse: e.target.value })}
            />
          </FormField>
        </div>

        {/* Instrument detection */}
        <div className="border-t border-white/10 pt-6 space-y-6">
          <div>
            <p className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-1">
              Title Instrument Detection
            </p>
            <p className="text-xs text-white/40">
              Review your Abstract of Title and identify which instruments are
              registered. Select Yes or No for each.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card-light p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">📋</span>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    Development Agreement (DA)
                  </p>
                  <p className="text-xs text-white/45 mt-0.5">
                    A registered agreement between the property owner and HRM
                    governing permitted uses and development conditions.
                  </p>
                </div>
              </div>
              <YesNoToggle
                value={data.hasDevelopmentAgreement}
                onChange={(v) => onChange({ hasDevelopmentAgreement: v })}
              />
            </div>

            <div className="glass-card-light p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">🔒</span>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    Restrictive Covenant (RC)
                  </p>
                  <p className="text-xs text-white/45 mt-0.5">
                    A private restriction registered on title that limits how the
                    land can be used, often more restrictive than current zoning.
                  </p>
                </div>
              </div>
              <YesNoToggle
                value={data.hasRestrictiveCovenant}
                onChange={(v) => onChange({ hasRestrictiveCovenant: v })}
              />
            </div>
          </div>
        </div>

        {/* Restricting clauses textarea */}
        <FormField
          label="Restricting Clause(s)"
          hint='Paste the exact text of any restrictive covenant clauses from your title instruments. If no Restrictive Covenant, leave blank.'
        >
          <textarea
            className="form-input min-h-[120px] resize-y"
            placeholder={`Paste the exact restricting clause text here, e.g.:\n\n"The property shall not be used for any purpose other than a single-family dwelling and no building shall be erected thereon other than one single-family detached dwelling..."`}
            value={data.restrictingClauses}
            onChange={(e) => onChange({ restrictingClauses: e.target.value })}
          />
        </FormField>
      </div>

      {/* Next button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center gap-2"
        >
          Run Diagnostic
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
}
