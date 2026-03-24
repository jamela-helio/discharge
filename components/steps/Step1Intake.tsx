"use client";

import { useCallback, useRef, useState } from "react";
import { FormData } from "../types";
import {
  DetectedClause,
  ParseResult,
  highlightClauseText,
  parseDocumentForClauses,
} from "../utils/documentParser";

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

function ClauseCard({
  clause,
  index,
  onToggle,
}: {
  clause: DetectedClause;
  index: number;
  onToggle: (i: number) => void;
}) {
  return (
    <div
      className={`rounded-xl border p-4 cursor-pointer transition-all ${
        clause.selected
          ? "border-yellow-400/50 bg-yellow-400/5"
          : "border-white/10 bg-white/3 opacity-50"
      }`}
      onClick={() => onToggle(index)}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border flex items-center justify-center text-xs font-bold transition-colors ${
            clause.selected
              ? "bg-yellow-400/30 border-yellow-400/60 text-yellow-300"
              : "border-white/20 text-white/20"
          }`}
        >
          {clause.selected ? "✓" : ""}
        </div>
        <p
          className="text-sm text-white/80 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlightClauseText(clause.text) }}
        />
      </div>
    </div>
  );
}

export default function Step1Intake({ data, onChange, onNext }: Props) {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [clauses, setClauses] = useState<DetectedClause[]>([]);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid =
    data.civicAddress.trim() &&
    data.pid.trim() &&
    data.zone.trim() &&
    data.proposedUse.trim() &&
    data.hasDevelopmentAgreement !== null &&
    data.hasRestrictiveCovenant !== null;

  const handleFile = useCallback(
    async (file: File) => {
      setParsing(true);
      setParseError(null);
      setParseResult(null);
      setClauses([]);
      onChange({ restrictingClauses: "" });

      try {
        const result = await parseDocumentForClauses(file);
        setParseResult(result);
        setClauses(result.clauses);

        // Build combined text from auto-selected clauses
        const selected = result.clauses.filter((c) => c.selected);
        onChange({
          restrictingClauses: selected.map((c) => c.text).join("\n\n"),
        });
      } catch (err) {
        setParseError(
          err instanceof Error ? err.message : "Failed to parse file."
        );
      } finally {
        setParsing(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const toggleClause = (index: number) => {
    const updated = clauses.map((c, i) =>
      i === index ? { ...c, selected: !c.selected } : c
    );
    setClauses(updated);
    const selected = updated.filter((c) => c.selected);
    onChange({ restrictingClauses: selected.map((c) => c.text).join("\n\n") });
  };

  return (
    <div className="animate-slide-up space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-2">
          Step 1 of 3
        </div>
        <h2 className="text-2xl font-bold text-white">Property Intake Form</h2>
        <p className="text-white/50 text-sm max-w-lg mx-auto">
          Provide property details and upload your title document. Restricting
          clauses are detected automatically. All processing is local — nothing
          leaves this page.
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
                    A private restriction registered on title that limits how
                    the land can be used, often more restrictive than current
                    zoning.
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

        {/* File upload + clause detection */}
        <div className="border-t border-white/10 pt-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-1">
              Restricting Clause(s)
            </p>
            <p className="text-xs text-white/40">
              Upload your title document (PDF, DOCX, or TXT) — restricting
              clauses will be detected and highlighted automatically.
            </p>
          </div>

          {/* Drop zone */}
          <div
            className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${
              isDragOver
                ? "border-indigo-400/70 bg-indigo-500/10"
                : "border-white/20 hover:border-white/40 bg-white/3"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <div className="p-8 text-center space-y-2">
              {parsing ? (
                <>
                  <div className="text-3xl animate-spin inline-block">⏳</div>
                  <p className="text-white/60 text-sm">Scanning document for clauses…</p>
                </>
              ) : parseResult ? (
                <>
                  <div className="text-3xl">✅</div>
                  <p className="text-white/80 text-sm font-medium">
                    {parseResult.fileName}
                  </p>
                  <p className="text-white/40 text-xs">
                    {clauses.length} potential clause
                    {clauses.length !== 1 ? "s" : ""} found —{" "}
                    {clauses.filter((c) => c.selected).length} selected
                  </p>
                  <p className="text-indigo-300/60 text-xs">
                    Click to upload a different file
                  </p>
                </>
              ) : (
                <>
                  <div className="text-3xl">📄</div>
                  <p className="text-white/70 text-sm font-medium">
                    Drop your title document here, or click to browse
                  </p>
                  <p className="text-white/30 text-xs">
                    PDF, DOCX, or TXT — processed entirely in your browser
                  </p>
                </>
              )}
            </div>
          </div>

          {parseError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-300 text-sm">
              {parseError}
            </div>
          )}

          {/* Detected clauses */}
          {clauses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 font-medium uppercase tracking-wider">
                  Detected Restricting Clauses — click to select / deselect
                </p>
                <button
                  type="button"
                  className="text-xs text-indigo-300/70 hover:text-indigo-300 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    const allSelected = clauses.every((c) => c.selected);
                    const updated = clauses.map((c) => ({
                      ...c,
                      selected: !allSelected,
                    }));
                    setClauses(updated);
                    onChange({
                      restrictingClauses: updated
                        .filter((c) => c.selected)
                        .map((c) => c.text)
                        .join("\n\n"),
                    });
                  }}
                >
                  {clauses.every((c) => c.selected)
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {clauses.map((clause, i) => (
                  <ClauseCard
                    key={i}
                    clause={clause}
                    index={i}
                    onToggle={toggleClause}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Manual fallback */}
          <div className="pt-1">
            <button
              type="button"
              className="text-xs text-white/40 hover:text-white/60 transition-colors underline underline-offset-2"
              onClick={() => setShowManual((v) => !v)}
            >
              {showManual ? "Hide manual entry" : "Or type / paste clauses manually"}
            </button>
            {showManual && (
              <textarea
                className="form-input min-h-[120px] resize-y mt-3"
                placeholder={`Paste the exact restricting clause text here, e.g.:\n\n"The property shall not be used for any purpose other than a single-family dwelling..."`}
                value={data.restrictingClauses}
                onChange={(e) => onChange({ restrictingClauses: e.target.value })}
              />
            )}
          </div>
        </div>
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
