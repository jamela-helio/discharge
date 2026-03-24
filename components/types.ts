export interface FormData {
  civicAddress: string;
  pid: string;
  zone: string;
  proposedUse: string;
  hasDevelopmentAgreement: boolean | null;
  hasRestrictiveCovenant: boolean | null;
  restrictingClauses: string;
}

export type DischargePathType = "path-a" | "path-b" | "both" | "not-applicable" | null;

export interface DiagnosticResult {
  path: DischargePathType;
  title: string;
  description: string;
  timeline: string;
  authority: string;
  statute: string;
  badgeColor: string;
}
