"use client";

import { useState } from "react";
import { FormData } from "../types";
import { getDiagnosticResult } from "../utils/diagnostic";

interface Props {
  data: FormData;
  onBack: () => void;
  onReset: () => void;
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function generateDALetter(data: FormData): string {
  const date = formatDate();
  return `${date}

Director, Planning and Development
Halifax Regional Municipality
5251 Duke Street, Suite 300
Halifax, Nova Scotia B3J 1P3

RE: Application to Discharge Development Agreement
    Civic Address: ${data.civicAddress}
    Property Identification Number (PID): ${data.pid}

Dear Director,

We write on behalf of the owner(s) of the above-referenced property to formally apply for the discharge of the Development Agreement registered on title, pursuant to Section 244 of the Municipal Government Act, SNS 1998, c 18.

The subject property, municipally addressed as ${data.civicAddress} (PID: ${data.pid}), is currently zoned ${data.zone} under the applicable Land Use By-law. A Development Agreement was previously registered on title governing the permitted uses and development conditions of the property.

The owner now proposes the following use: ${data.proposedUse}.

We respectfully submit that the Development Agreement is no longer necessary to achieve the objectives of the applicable Municipal Planning Strategy (MPS). The proposed discharge is reasonably consistent with the intent of the MPS, as the current ${data.zone} zone designation provides sufficient regulatory controls to govern the proposed development without the additional overlay of the Development Agreement.

The continued registration of the Development Agreement constitutes an unnecessary encumbrance that impedes the full utilization of the property in accordance with the as-of-right permissions afforded by the ${data.zone} zone. We respectfully request that Community Council consider and approve the discharge of the Development Agreement in its entirety.

We trust that this application will receive due consideration. Please do not hesitate to contact us should you require any additional information or supporting documentation.

Respectfully submitted,

[Applicant Name]
[Applicant Title / Organization]
[Address]
[Phone]
[Email]`;
}

function generateCovenantLetter(data: FormData): string {
  const date = formatDate();
  const clauseText = data.restrictingClauses.trim()
    ? `"${data.restrictingClauses.trim()}"`
    : "[Paste restricting clause(s) from your Abstract of Title here]";

  return `${date}

Chief Administrative Officer
Halifax Regional Municipality
5251 Duke Street, Suite 300
Halifax, Nova Scotia B3J 1P3

RE: Application to Discharge Restrictive Covenant
    Civic Address: ${data.civicAddress}
    Property Identification Number (PID): ${data.pid}

Dear Chief Administrative Officer,

We write on behalf of the owner(s) of the above-referenced property to formally apply for the discharge of the Restrictive Covenant registered on title, pursuant to Section 257A of the Municipal Government Act, SNS 1998, c 18.

The subject property, municipally addressed as ${data.civicAddress} (PID: ${data.pid}), is currently zoned ${data.zone} under the applicable Land Use By-law. A Restrictive Covenant was registered on title containing the following clause(s):

${clauseText}

The owner now proposes the following use: ${data.proposedUse}.

We respectfully submit that the Restrictive Covenant should be discharged on the following grounds:

1. More Restrictive Than Zoning: The Restrictive Covenant imposes restrictions that are more onerous than those imposed by the current ${data.zone} zone designation under the applicable Land Use By-law. The ${data.zone} zone permits a broader range of uses and development standards than those permitted by the Covenant, and the Covenant therefore restricts the property beyond the level of regulation already provided by current zoning.

2. No Valid Planning Purpose: The Restrictive Covenant no longer serves a valid or necessary planning purpose. The planning objectives that the Covenant was intended to achieve are now adequately addressed and superseded by the applicable Municipal Planning Strategy and Land Use By-law provisions governing the ${data.zone} zone.

3. Impediment to Appropriate Development: The continued registration of the Restrictive Covenant constitutes an unreasonable impediment to the use and development of the property in a manner consistent with current planning policy and the public interest.

We respectfully request that the Chief Administrative Officer approve the discharge of the Restrictive Covenant in its entirety pursuant to Section 257A of the Municipal Government Act.

We trust that this application will receive due consideration. Please do not hesitate to contact us should you require any additional information or supporting documentation.

Respectfully submitted,

[Applicant Name]
[Applicant Title / Organization]
[Address]
[Phone]
[Email]`;
}

function LetterCard({
  title,
  subtitle,
  icon,
  badgeText,
  badgeColor,
  letterText,
}: {
  title: string;
  subtitle: string;
  icon: string;
  badgeText: string;
  badgeColor: string;
  letterText: string;
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const badgeClasses: Record<string, string> = {
    indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-400/20",
    purple: "bg-purple-500/15 text-purple-300 border-purple-400/20",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-md border text-xs font-semibold uppercase tracking-wider mb-1.5 ${badgeClasses[badgeColor] || badgeClasses.indigo}`}>
              {badgeText}
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-white/50">{subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
            title="Copy letter text"
          >
            {copied ? (
              <>
                <span>✓</span> Copied
              </>
            ) : (
              <>
                <span>📋</span> Copy
              </>
            )}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-secondary text-xs px-3 py-2"
          >
            {expanded ? "Collapse" : "Preview"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="letter-preview p-6 text-sm animate-fade-in">
          <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-800">
            {letterText}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function Step3Output({ data, onBack, onReset }: Props) {
  const result = getDiagnosticResult(data);
  const showDA = result.path === "path-a" || result.path === "both";
  const showRC = result.path === "path-b" || result.path === "both";

  const daLetter = generateDALetter(data);
  const covenantLetter = generateCovenantLetter(data);

  return (
    <div className="animate-slide-up space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-400/20 text-green-300 text-xs font-semibold uppercase tracking-widest mb-2">
          Step 3 of 3 — Action Plan Ready
        </div>
        <h2 className="text-2xl font-bold text-white">
          Your Discharge Action Plan
        </h2>
        <p className="text-white/50 text-sm max-w-lg mx-auto">
          Your personalized plan and auto-populated cover letters are ready
          below. Review, copy, and submit.
        </p>
      </div>

      {/* Path summary banner */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-xl">
            ✅
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-400">
              Determined Path
            </p>
            <p className="text-white font-bold text-lg">{result.title}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Address", value: data.civicAddress, icon: "📍" },
            { label: "PID", value: data.pid, icon: "🔢" },
            { label: "Zone", value: data.zone, icon: "🗺" },
            { label: "Timeline", value: result.timeline, icon: "⏱" },
          ].map((item) => (
            <div key={item.label} className="glass-card-light p-3 space-y-1">
              <div className="text-xs text-white/40 uppercase tracking-wider font-medium flex items-center gap-1">
                <span>{item.icon}</span>
                {item.label}
              </div>
              <p className="text-white text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PPLC Setup Instructions */}
      <div className="glass-card p-6 space-y-4 border border-yellow-400/15">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏛</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
              Required Action
            </p>
            <h3 className="font-bold text-white text-lg">
              Set Up Your PPLC Contractor Profile
            </h3>
          </div>
        </div>
        <p className="text-sm text-white/65 leading-relaxed">
          Before submitting your application, you must create a{" "}
          <strong className="text-white">Contractor Profile</strong> on the HRM
          Planning and Permitting Licensing Centre (PPLC) portal at{" "}
          <span className="text-indigo-300 font-mono text-xs bg-indigo-500/10 px-2 py-0.5 rounded">
            plc.halifax.ca
          </span>
          . This portal is used to submit and track all planning applications in
          the Halifax Regional Municipality.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              step: "1",
              title: "Create Account",
              desc: 'Visit plc.halifax.ca and register a Contractor Profile under "New User Registration".',
            },
            {
              step: "2",
              title: "Start Application",
              desc: 'Submit a new Planning Application for "Development Agreement Discharge" and/or "Covenant Discharge" as applicable.',
            },
            {
              step: "3",
              title: "Pay Fees & Submit",
              desc: "Application fees range from $500 to $1,500 per application. Upload your cover letter(s) and supporting documents.",
            },
          ].map((s) => (
            <div key={s.step} className="glass-card-light p-4 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm font-bold flex items-center justify-center">
                {s.step}
              </div>
              <p className="font-semibold text-white text-sm">{s.title}</p>
              <p className="text-xs text-white/55 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-generated letters */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Auto-Generated Cover Letters
        </h3>
        <p className="text-xs text-white/40">
          Letters have been pre-populated with your property details. Click
          &quot;Preview&quot; to expand and &quot;Copy&quot; to copy the text to
          your clipboard. Finalize with your name, title, and contact details
          before submitting.
        </p>

        {showDA && (
          <LetterCard
            title="DA Discharge Cover Letter"
            subtitle="Submit to Director, Planning & Development — HRM"
            icon="📋"
            badgeText="§244 MGA — Path A"
            badgeColor="indigo"
            letterText={daLetter}
          />
        )}

        {showRC && (
          <LetterCard
            title="Covenant Rationale Letter"
            subtitle="Submit to Chief Administrative Officer — HRM"
            icon="🔒"
            badgeText="§257A MGA — Path B"
            badgeColor="purple"
            letterText={covenantLetter}
          />
        )}
      </div>

      {/* Disclaimer */}
      <div className="glass-card-light p-4 flex items-start gap-3 border border-white/5">
        <span className="text-white/40 text-base">⚠</span>
        <p className="text-xs text-white/40 leading-relaxed">
          <strong className="text-white/60">Legal Disclaimer:</strong> The
          content generated by this tool is for informational purposes only and
          does not constitute legal advice. Review all materials with a qualified
          solicitor before submission. Helio Urban Development is not liable for
          the outcome of any application.
        </p>
      </div>

      {/* Nav */}
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary flex items-center gap-2"
        >
          <span>↺</span> Start New Assessment
        </button>
      </div>
    </div>
  );
}
