"use client";

import { FormData, DiagnosticResult } from "../types";
import { getDiagnosticResult } from "../utils/diagnostic";

interface Props {
  data: FormData;
  onNext: () => void;
  onBack: () => void;
}

function PathCard({ result }: { result: DiagnosticResult }) {
  const colorMap: Record<string, string> = {
    indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-400/30 text-indigo-300",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-400/30 text-purple-300",
    violet: "from-violet-500/20 to-violet-600/10 border-violet-400/30 text-violet-300",
    red: "from-red-500/20 to-red-600/10 border-red-400/30 text-red-300",
  };
  const classes = colorMap[result.badgeColor] || colorMap.indigo;

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-6 ${classes} animate-slide-up`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{getPathIcon(result.path)}</div>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">
              {result.statute}
            </p>
            <h3 className="text-xl font-bold text-white mt-1">{result.title}</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            {result.description}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs font-medium bg-white/10 rounded-lg px-3 py-1.5">
              <span>⏱</span>
              <span className="text-white/80">{result.timeline}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium bg-white/10 rounded-lg px-3 py-1.5">
              <span>🏛</span>
              <span className="text-white/80">{result.authority}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPathIcon(path: string | null): string {
  switch (path) {
    case "path-a": return "📋";
    case "path-b": return "🔒";
    case "both": return "⚡";
    case "not-applicable": return "ℹ️";
    default: return "📄";
  }
}

export default function Step2Diagnostic({ data, onNext, onBack }: Props) {
  const result = getDiagnosticResult(data);
  const isApplicable = result.path !== "not-applicable";

  const summaryItems = [
    {
      label: "Civic Address",
      value: data.civicAddress,
      icon: "📍",
    },
    { label: "PID", value: data.pid, icon: "🔢" },
    { label: "Zone", value: data.zone, icon: "🗺" },
    { label: "Proposed Use", value: data.proposedUse, icon: "🏗" },
    {
      label: "Development Agreement",
      value: data.hasDevelopmentAgreement ? "Yes — Found on Title" : "No",
      icon: "📋",
    },
    {
      label: "Restrictive Covenant",
      value: data.hasRestrictiveCovenant ? "Yes — Found on Title" : "No",
      icon: "🔒",
    },
  ];

  return (
    <div className="animate-slide-up space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-2">
          Step 2 of 3
        </div>
        <h2 className="text-2xl font-bold text-white">Diagnostic Results</h2>
        <p className="text-white/50 text-sm">
          Based on your inputs, we&apos;ve determined the applicable discharge
          path(s).
        </p>
      </div>

      {/* Property summary */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Property Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="glass-card-light p-3 space-y-1"
            >
              <div className="flex items-center gap-1.5 text-xs text-white/45 font-medium uppercase tracking-wider">
                <span>{item.icon}</span>
                {item.label}
              </div>
              <p className="text-white text-sm font-semibold truncate">
                {item.value || <span className="text-white/30 italic">—</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostic result */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Determined Discharge Path
        </h3>

        {result.path === "both" ? (
          <div className="space-y-4">
            <PathCard result={result} />
            <div className="glass-card-light p-4 flex items-start gap-3">
              <span className="text-yellow-400 text-lg">⚠</span>
              <p className="text-sm text-white/65">
                Both instruments are present on title. You must file
                concurrently under §244 (DA Discharge via Community Council) and
                §257A (Covenant Discharge via CAO). Separate applications and
                cover letters are required for each filing.
              </p>
            </div>
          </div>
        ) : (
          <PathCard result={result} />
        )}
      </div>

      {/* Next steps preview */}
      {isApplicable && (
        <div className="glass-card p-6 space-y-3">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            What Happens Next
          </h3>
          <ol className="space-y-2">
            {[
              "Review your auto-generated cover letter(s) in Step 3",
              "Create a Contractor Profile on the HRM PPLC portal",
              "Submit your application(s) with the required fees ($500–$1,500)",
              "Await review by Community Council (§244) and/or CAO (§257A)",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/65">
                <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        {isApplicable && (
          <button type="button" onClick={onNext} className="btn-primary flex items-center gap-2">
            Generate Letters
            <span className="text-lg">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
