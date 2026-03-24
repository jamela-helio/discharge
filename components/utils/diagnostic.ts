import { FormData, DiagnosticResult } from "../types";

export function getDiagnosticResult(data: FormData): DiagnosticResult {
  const hasDA = data.hasDevelopmentAgreement === true;
  const hasRC = data.hasRestrictiveCovenant === true;

  if (hasDA && hasRC) {
    return {
      path: "both",
      title: "Concurrent Filing — Path A + Path B",
      description:
        "Both a Development Agreement and a Restrictive Covenant are registered on title. You must file concurrent applications: a §244 DA Discharge Application through Community Council, and a §257A Covenant Discharge Application through the Chief Administrative Officer.",
      timeline: "8–16 weeks (concurrent)",
      authority: "Community Council + CAO",
      statute: "§244 MGA + §257A MGA",
      badgeColor: "violet",
    };
  }

  if (hasDA && !hasRC) {
    return {
      path: "path-a",
      title: "Path A — Development Agreement Discharge",
      description:
        "A Development Agreement is the sole encumbrance on title. Under §244 of the Municipal Government Act, you may apply to discharge it on the basis that the proposed development is reasonably consistent with the intent of the applicable Municipal Planning Strategy. The application is reviewed by Community Council.",
      timeline: "8–16 weeks",
      authority: "Community Council",
      statute: "§244 MGA",
      badgeColor: "indigo",
    };
  }

  if (!hasDA && hasRC) {
    return {
      path: "path-b",
      title: "Path B — Restrictive Covenant Discharge",
      description:
        "A Restrictive Covenant is the sole encumbrance on title. Under §257A of the Municipal Government Act, you may apply to discharge it on the basis that it is more restrictive than the current zone designation and no longer serves a valid planning purpose. The application is reviewed by the Chief Administrative Officer.",
      timeline: "8–12 weeks",
      authority: "Chief Administrative Officer (CAO)",
      statute: "§257A MGA",
      badgeColor: "purple",
    };
  }

  // Neither DA nor RC
  return {
    path: "not-applicable",
    title: "No Applicable Discharge Path",
    description:
      "Based on your inputs, neither a Development Agreement nor a Restrictive Covenant was found on title. This discharge workflow does not apply. If only an Easement or other instrument is present, please consult legal counsel for the appropriate remedy.",
    timeline: "N/A",
    authority: "N/A",
    statute: "N/A",
    badgeColor: "red",
  };
}
