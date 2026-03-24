"use client";

// Keywords that indicate a restricting clause
const RESTRICTION_KEYWORDS = [
  "shall not be used",
  "shall not be erected",
  "shall not be built",
  "shall not exceed",
  "only be used",
  "single-family",
  "single family",
  "one dwelling",
  "one detached",
  "no building shall",
  "no structure shall",
  "not used for",
  "restricted to",
  "shall be used only",
  "shall be used for",
  "residential purposes only",
  "residential use only",
  "dwelling house only",
  "detached dwelling",
  "not more than one",
  "prohibit",
  "no subdivision",
  "shall not subdivide",
  "written approval",
  "architectural approval",
  "minimum square footage",
  "minimum floor area",
  "no fence",
  "no outbuilding",
  "tree removal",
  "storey",
  "stories",
  "feet from",
  "metres from",
];

/** Extract plain text from a PDF file using pdfjs-dist */
async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: { str?: string }) => item.str ?? "")
      .join(" ");
    pages.push(pageText);
  }

  return pages.join("\n\n");
}

/** Extract plain text from a DOCX file using mammoth */
async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/** Extract plain text from a TXT file */
async function extractTxtText(file: File): Promise<string> {
  return file.text();
}

/** Split text into paragraphs/sentences for clause analysis */
function splitIntoParagraphs(text: string): string[] {
  // Split on double newlines, numbered clauses, or long single newlines
  return text
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 20);
}

/** Score a paragraph for how likely it is to be a restricting clause */
function scoreClause(text: string): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const keyword of RESTRICTION_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) {
      score += 1;
    }
  }
  return score;
}

// Signals that a document is a Development Agreement
const DA_SIGNALS = [
  "development agreement",
  "section 244",
  "§244",
  "s.244",
  "s. 244",
  "community council",
  "municipality of halifax",
  "halifax regional municipality",
  "permitted uses and development",
  "council may discharge",
  "hrm charter",
  "municipal planning strategy",
  "land use bylaw",
  "development officer",
];

// Signals that a document is a Restrictive Covenant
const RC_SIGNALS = [
  "restrictive covenant",
  "deed restriction",
  "building scheme",
  "covenant",
  "grantor",
  "grantee",
  "original developer",
  "covenant holder",
  "section 257",
  "§257",
  "s.257",
  "s. 257",
  "chief administrative officer",
  "cao",
  "private restriction",
  "benefit of the remaining lots",
  "runs with the land",
];

/** Detect whether a document contains a DA, RC, or both */
export function detectInstrumentTypes(text: string): {
  hasDA: boolean;
  hasRC: boolean;
  daConfidence: number;
  rcConfidence: number;
} {
  const lower = text.toLowerCase();

  const daConfidence = DA_SIGNALS.filter((s) =>
    lower.includes(s.toLowerCase())
  ).length;
  const rcConfidence = RC_SIGNALS.filter((s) =>
    lower.includes(s.toLowerCase())
  ).length;

  return {
    hasDA: daConfidence >= 2,
    hasRC: rcConfidence >= 2,
    daConfidence,
    rcConfidence,
  };
}

export interface DetectedClause {
  text: string;
  score: number;
  selected: boolean;
}

export interface ParseResult {
  clauses: DetectedClause[];
  fullText: string;
  fileName: string;
  hasDA: boolean;
  hasRC: boolean;
  daConfidence: number;
  rcConfidence: number;
}

/** Main entry point: parse a file and return detected clauses */
export async function parseDocumentForClauses(
  file: File
): Promise<ParseResult> {
  let fullText = "";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "pdf") {
    fullText = await extractPdfText(file);
  } else if (ext === "docx" || ext === "doc") {
    fullText = await extractDocxText(file);
  } else if (ext === "txt") {
    fullText = await extractTxtText(file);
  } else {
    throw new Error(`Unsupported file type: .${ext}. Please upload PDF, DOCX, or TXT.`);
  }

  const { hasDA, hasRC, daConfidence, rcConfidence } =
    detectInstrumentTypes(fullText);

  const paragraphs = splitIntoParagraphs(fullText);
  const scored = paragraphs
    .map((text) => ({ text, score: scoreClause(text), selected: false }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  // Auto-select top clauses (score >= 2, or top 5 if many)
  const threshold = scored.length > 0 ? Math.max(1, scored[0].score - 1) : 1;
  const clauses = scored.map((c, i) => ({
    ...c,
    selected: c.score >= threshold && i < 8,
  }));

  return { clauses, fullText, fileName: file.name, hasDA, hasRC, daConfidence, rcConfidence };
}

/** Highlight restriction keywords in a clause text (returns HTML string) */
export function highlightClauseText(text: string): string {
  let result = text;
  for (const keyword of RESTRICTION_KEYWORDS) {
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    result = result.replace(regex, '<mark class="bg-yellow-300/40 text-yellow-100 rounded px-0.5">$1</mark>');
  }
  return result;
}
