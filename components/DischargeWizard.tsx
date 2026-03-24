"use client";

import { useState } from "react";
import { FormData } from "./types";
import Step1Intake from "./steps/Step1Intake";
import Step2Diagnostic from "./steps/Step2Diagnostic";
import Step3Output from "./steps/Step3Output";

const INITIAL_FORM_DATA: FormData = {
  civicAddress: "",
  pid: "",
  zone: "",
  proposedUse: "",
  hasDevelopmentAgreement: null,
  hasRestrictiveCovenant: null,
  restrictingClauses: "",
};

const STEPS = [
  { number: 1, label: "Property Intake", icon: "📝" },
  { number: 2, label: "Diagnostic", icon: "🔍" },
  { number: 3, label: "Action Plan", icon: "📄" },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, idx) => {
        const isComplete = currentStep > step.number;
        const isCurrent = currentStep === step.number;
        const isUpcoming = currentStep < step.number;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step circle */}
            <div
              className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 ${
                isCurrent ? "scale-110" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isComplete
                    ? "bg-green-500/30 text-green-300 border-2 border-green-400/50"
                    : isCurrent
                    ? "bg-indigo-500/40 text-white border-2 border-indigo-400 shadow-lg shadow-indigo-500/30"
                    : "bg-white/5 text-white/30 border-2 border-white/10"
                }`}
              >
                {isComplete ? "✓" : step.icon}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                  isCurrent
                    ? "text-white"
                    : isComplete
                    ? "text-green-400"
                    : "text-white/30"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div
                className={`w-16 md:w-24 h-0.5 mx-2 mb-5 transition-all duration-500 ${
                  currentStep > step.number
                    ? "bg-gradient-to-r from-green-500/50 to-indigo-500/50"
                    : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function DischargeWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    goToStep(1);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Logo / Brand header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white text-lg font-bold">H</span>
          </div>
          <div className="text-left">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
              Helio Urban Development
            </p>
            <p className="text-xs text-white/40 tracking-wider">
              Halifax Regional Municipality
            </p>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="gradient-text">Discharge</span>{" "}
          <span className="text-white">Workflow</span>
        </h1>
        <p className="mt-3 text-white/50 text-base max-w-xl mx-auto leading-relaxed">
          Diagnose title instruments and generate legally-framed discharge
          correspondence for Development Agreements and Restrictive Covenants.
        </p>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
          {[
            "100% Client-Side",
            "No Data Stored",
            "MGA §244 & §257A Compliant",
          ].map((badge) => (
            <div
              key={badge}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/45 text-xs font-medium"
            >
              <span className="text-green-400">●</span>
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Main wizard card */}
      <div className="glass-card p-8">
        {currentStep === 1 && (
          <Step1Intake
            data={formData}
            onChange={updateFormData}
            onNext={() => goToStep(2)}
          />
        )}
        {currentStep === 2 && (
          <Step2Diagnostic
            data={formData}
            onNext={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        )}
        {currentStep === 3 && (
          <Step3Output
            data={formData}
            onBack={() => goToStep(2)}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-xs text-white/25 space-y-1">
        <p>
          Helio Urban Development · Halifax Regional Municipality Discharge
          Workflow
        </p>
        <p>All data processed locally. No information is transmitted.</p>
      </div>
    </div>
  );
}
