# Discharge Workflow Web App - Prompt for Claude Code

**Instructions to feed into Claude Code:**

"You are an expert web developer tasked with building a modern, interactive web application for the **Helio Urban Development Discharge Workflow**. 

The goal of this application is to guide users (typically homeowners or project coordinators) through the process of diagnosing what instruments are on their property title (Development Agreements, Restrictive Covenants) and generating the correct action plan and legal correspondence to discharge them in the Halifax Regional Municipality (HRM).

### Design & Tech Stack Requirements
1. **Tech Stack:** React, Next.js (or Vite), Vanilla CSS (or Tailwind if preferred). 
2. **Design Language:** Use a modern, premium aesthetic. Incorporate vibrant colors, glassmorphism, dynamic animations, hover effects, and modern typography (e.g., Inter or Roboto). It must look highly professional and trustworthy.
3. **UX Flow:** Implement a multi-step 'Wizard' or 'Stepper' UI to walk the user through the process easily.

### Core Features & Workflow

**Step 1: Gather Inputs (The Intake Form)**
- Allow users to upload or paste text from their 'Abstract of Title' and title instruments. (For the MVP, simply have text areas where they can paste the clauses or instrument types).
- Form fields required: 
  - Civic Address
  - Property Identification Number (PID)
  - Current Zone Designation
  - Proposed Use
  - Did you find a 'DEVELOPMENT AGREEMENT' on title? (Yes/No)
  - Did you find a 'RESTRICTIVE COVENANT' on title? (Yes/No)
  - Specific Restricting Clauses (Text box to paste exact restrictive text).

**Step 2: Diagnostic Decision Tree (The Logic Layer)**
Based on the inputs from Step 1, the app must run a diagnostic check:
- **Only a Development Agreement (DA) = Path A:** §244 DA Discharge. Reasonably consistent with MPS argument. (Timeline: 8-16 weeks via Community Council).
- **Only a Restrictive Covenant = Path B:** §257A Covenant Discharge. More restrictive than zoning argument. (Timeline: 8-12 weeks via CAO).
- **Both DA and Covenant = Concurrent Filing:** Do both Path A and Path B.
- **Neither / Only Easement:** Inform the user this workflow does not apply.

**Step 3: Action Plan & Output Dashboard**
Provide a visually appealing dashboard showing the user their customized action plan:
- **Determined Path:** Clear explanation of whether they need Path A, Path B, or Both.
- **PPLC Setup Instructions:** Tell them to create a Contractor Profile on https://plc.halifax.ca. Explain fees ($500-$1,500 per application).
- **Auto-Generated Letters:** Based on their path, generate the applicable cover letters using their inputted data!

### Document Templates to Include in the App
The app should automatically populate these letter templates with the variables collected in Step 1.

**Template 1: DA Discharge Cover Letter (§244)**
Use this text and replace bracketed variables with user data:
[DATE] / Director, Planning and Development / HRM / 5251 Duke St...
RE: Application to Discharge Development Agreement for [CIVIC ADDRESS], PID: [PID].
The subject property is zoned [ZONE]. A development agreement was registered... We respectfully request discharge because the current [ZONE] zone designation is sufficient... The proposed discharge is reasonably consistent with the intent of the applicable Municipal Planning Strategy...

**Template 2: Covenant Rationale Letter (§257A)**
Use this text and replace bracketed variables with user data:
[DATE] / Chief Administrative Officer / HRM / 5251 Duke St...
RE: Application to Discharge Restrictive Covenant for [CIVIC ADDRESS], PID: [PID].
The subject property is zoned [ZONE]. A restrictive covenant was registered containing the following clause(s): '[USER PASTED CLAUSE(S)]'. The [ZONE] zone permits more density. The covenant restricts the property, which is more restrictive than the current zoning. We request discharge of the restrictive covenant in its entirety.

### Final Delivery
Please scaffold the entire React application structure, including the state management for the wizard form, the diagnostic logic branch, and the dynamically generated letter templates. Make sure the output relies entirely on client-side rendering for data privacy (no backend required for MVP)."
