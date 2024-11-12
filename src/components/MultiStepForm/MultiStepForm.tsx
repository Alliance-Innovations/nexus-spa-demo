"use client";

import { useEffect, useState, useCallback } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { StepIndicator } from "./StepIndicator";
import { StepFields } from "./StepFields";

const steps = [
  {
    id: "personal",
    title: "Personal Information",
    fields: [
      { name: "firstName", label: "First Name", type: "text" },
      { name: "lastName", label: "Last Name", type: "text" },
    ],
  },
  {
    id: "contact",
    title: "Contact Details",
    fields: [
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "tel" },
    ],
  },
  {
    id: "company",
    title: "Company Information",
    fields: [
      { name: "company", label: "Company Name", type: "text" },
      { name: "role", label: "Job Title", type: "text" },
    ],
  },
  {
    id: "preferences",
    title: "Preferences",
    fields: [
      {
        name: "newsletter",
        label: "Subscribe to newsletter",
        type: "checkbox",
      },
      { name: "updates", label: "Receive product updates", type: "checkbox" },
    ],
  },
];

interface FormData {
  [key: string]: string | boolean;
}

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const { trackEvent } = useAnalytics();
  const handleBeforeUnload = useCallback(() => {
    trackEvent("exit_form", {
      "inputs_filled": steps[currentStep].fields
        .filter((field) => formData[field.name])
        .map((field) => field.name)
        .join(", "),
      "step_left": currentStep + 1,
    });
  }, [currentStep, formData, trackEvent]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleBeforeUnload]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      trackEvent("button_click", {
        "button_name": "Next Step Button",
      });
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      trackEvent("button_click", {
        "button_name": "Previous Step Button",
      });
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep === steps.length - 1) {
      trackEvent("form_submit", {
        "form_name": "Multi-step Form",
      });
      setCurrentStep(steps.length); // Move to the celebration step
    } else {
      handleNext();
    }
  };

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleReset = () => {
    setFormData({});
    setCurrentStep(0);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <StepIndicator steps={steps} currentStep={currentStep} />

      {currentStep < steps.length ? (
        <form onSubmit={handleSubmit}>
          <StepFields
            fields={steps[currentStep].fields}
            trackEvent={trackEvent}
            formData={formData}
            handleFieldChange={handleFieldChange}
          />
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={handleBeforeUnload}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Mock Exit
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Congratulations!
          </h2>
          <p className="text-gray-600 mb-8">
            You have successfully completed the form.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Fill Again
          </button>
        </div>
      )}
    </div>
  );
}
