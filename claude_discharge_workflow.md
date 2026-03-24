# Discharge Workflow Skill

**Description:** An interactive decision-making workflow to guide users through the process of discharging Development Agreements (DAs) and Restrictive Covenants in the Halifax Regional Municipality (HRM).
**Trigger:** When a user uploads title documents (e.g. PDFs or screenshots), mentions instruments on a title, asks what's blocking a permit, or asks to draft a discharge letter.

## Step 1: Gather Inputs
When triggered, start by extracting and collecting the following information from the user or uploaded documents:
- **Title Documents:** Analyze any uploaded "Abstract of Title", PDFs, or screenshots showing instrument names.
- **Instrument Texts:** Read the full text of the instruments (DAs, Covenants).
- **Property Identification Number (PID):** Ask for this if not provided.
- **Current Zone and Proposed Use:** Ask the user what the current zone is and what they are trying to build (e.g., 4 units).

## Step 2: Identify What's on Title
Review the abstract and instruments to categorize them:
- **Development Agreement (DA):** A contract between the property owner and HRM. Enforced at the permit counter. Key identifiers: Type is 'DEVELOPMENT AGREEMENT', Grantee is often 'MUNICIPALITY OF HALIFAX'. Must be discharged through Community Council (§244).
- **Restrictive Covenant:** An agreement between private parties (e.g., original developer). It does not block HRM building permits but carries civil litigation risk. Key identifiers: Type is 'RESTRICTIVE COVENANT' or 'DEED RESTRICTION'. Discharged through the HRM CAO (§257A) or negotiated release.
- **Easement (Utility/Access):** Not in scope for discharge. Governs utility corridors or access routes.

## Step 3: Run Diagnostic Decision Tree
Based on the identified instruments, determine the required action:
- **Condition:** Only a DA on title; no covenant.
  - **Action:** Path A: §244 DA discharge. No covenant application needed.
- **Condition:** Only a covenant on title; no DA.
  - **Action:** Path B: §257A covenant discharge.
- **Condition:** Both a DA and a covenant on title.
  - **Action:** Concurrent Filing: File both Path A and Path B applications concurrently. Use the same project rationale.
- **Condition:** Easement only.
  - **Action:** Tell the user it's not in scope for PPLC discharge. Suggest checking if it conflicts with the building envelope.

## Step 4: Execute the Path

### Path A: §244 DA Discharge
- **The Argument:** The discharge must be "reasonably consistent with the intent of the applicable Municipal Planning Strategy". This targets DAs that are spent, moot, or restrict density below what current zoning permits.
- **Docs Required:** Full text of DA instrument, PID, civic address, current zone/LUB confirmation, Abstract of Title, Cover letter.
- **PPLC Path:** 'Planning Application' → 'Development Agreement' → 'Discharge of Development Agreement'.
- **Timeline:** 8–16 weeks (Community Council resolution).

### Path B: §257A Covenant Discharge
- **The Statutory Test:** The covenant must be "more restrictive than the current zoning with respect to height or density."
- **Surgical Targeting:** Locate specific clauses that cap unit counts, building height, or restrict to single-family.
- **PPLC Path:** 'Planning Application' → 'Private Covenant' → 'Modification or Discharge of a Private Covenant'.
- **Timeline:** 8–12 weeks (CAO administrative decision).

## Step 5: Letter Drafting
Before generating a letter, ensure you have:
1. Exact instrument numbers and registration dates.
2. The specific restricting clauses (quote them precisely).
3. The zoning gap (what the covenant/DA restricts vs. what the current zone permits).

*Action:* Use `references/letter-templates.md` to draft the appropriate letter. Make sure to customize option blocks depending on whether the DA is fully performed, moot, or just more restrictive than current zoning. Cross-reference if doing a concurrent filing.

## Step 6: PPLC Filing Checklist
Provide the user with setup steps and a per-application checklist:
- **Setup:** Create a PPLC portal account and Contractor Profile (e.g. under Helio Urban Development). Find portal at https://plc.halifax.ca.
- **Confirm Fees:** Advise that fees are typically $500–$1,500 per application.
- **Select Correct Category:** Make sure the user selects the right application type in PPLC based on Step 4.

## Step 7: Output Guide
Based on the user's input and current stage, produce the following output:
1. **Diagnostic Phase:** A summary of instruments found on title, what each means, and the determined Action Path.
2. **Planning Phase:** The timeline, required documents, and PPLC setup steps for their specific path.
3. **Execution Phase:** The drafted rationale/cover letters (using the templates) customized with their specific details.
