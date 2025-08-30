"use client";

import { useState, useEffect } from "react";
import { useNexus } from "@/hooks/useNexus";
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
      {
        name: "updates",
        label: "Receive product updates",
        type: "checkbox",
      },
      {
        name: "contactPreference",
        label: "Preferred contact method",
        type: "radio",
        options: [
          { value: "email", label: "Email" },
          { value: "phone", label: "Phone" },
          { value: "both", label: "Both" },
        ],
      },
    ],
  },
];

interface FormData {
  [key: string]: string | boolean;
}

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [stepTimes, setStepTimes] = useState<Record<number, number>>({});
  const { trackEvent } = useNexus();

  useEffect(() => {
    // Track form start
    trackEvent("form_started", {
      form_name: "Multi-step Form",
      total_steps: steps.length,
      timestamp: new Date().toISOString(),
    });

    const handleUnload = () => {
      trackEvent("form_abandoned", {
        step_left: currentStep + 1,
        time_spent: Math.floor((Date.now() - startTime.getTime()) / 1000),
        form_data_progress: Object.keys(formData).length,
        timestamp: new Date().toISOString(),
      });
    };

    const handleBeforeUnload = () => {
      trackEvent("form_exit_attempt", {
        step_left: currentStep + 1,
        time_spent: Math.floor((Date.now() - startTime.getTime()) / 1000),
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener("unload", handleUnload);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentStep, trackEvent, startTime, formData]);

  useEffect(() => {
    // Track step completion
    if (currentStep > 0) {
      const stepTime = Math.floor((Date.now() - startTime.getTime()) / 1000);
      setStepTimes(prev => ({ ...prev, [currentStep - 1]: stepTime }));
      
      trackEvent("step_completed", {
        step_number: currentStep,
        step_name: steps[currentStep - 1].id,
        step_title: steps[currentStep - 1].title,
        time_on_step: stepTime,
        timestamp: new Date().toISOString(),
      });
    }
  }, [currentStep, startTime, trackEvent]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      trackEvent("step_navigation", {
        direction: "forward",
        from_step: currentStep + 1,
        to_step: currentStep + 2,
        step_name: steps[currentStep].id,
        timestamp: new Date().toISOString(),
      });
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      trackEvent("step_navigation", {
        direction: "backward",
        from_step: currentStep + 1,
        to_step: currentStep,
        step_name: steps[currentStep].id,
        timestamp: new Date().toISOString(),
      });
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep === steps.length - 1) {
      const totalTime = Math.floor((Date.now() - startTime.getTime()) / 1000);
      
      trackEvent("form_submitted", {
        form_name: "Multi-step Form",
        total_steps: steps.length,
        total_time: totalTime,
        step_times: stepTimes,
        form_data: formData,
        timestamp: new Date().toISOString(),
      });
      
      setCurrentStep(steps.length); // Move to the celebration step
    } else {
      handleNext();
    }
  };

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    
    trackEvent("form_field_changed", {
      field_name: field,
      field_value: String(value),
      step_number: currentStep + 1,
      step_name: steps[currentStep].id,
      timestamp: new Date().toISOString(),
    });
  };

  const handleReset = () => {
    trackEvent("form_reset", {
      form_name: "Multi-step Form",
      steps_completed: currentStep,
      time_spent: Math.floor((Date.now() - startTime.getTime()) / 1000),
      timestamp: new Date().toISOString(),
    });
    
    setFormData({});
    setCurrentStep(0);
    setStartTime(new Date());
    setStepTimes({});
  };

  const handleMockExit = () => {
    trackEvent("form_exit_simulation", {
      step_left: currentStep + 1,
      time_spent: Math.floor((Date.now() - startTime.getTime()) / 1000),
      form_data_progress: Object.keys(formData).length,
      timestamp: new Date().toISOString(),
    });
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex !== currentStep) {
      trackEvent("step_direct_navigation", {
        from_step: currentStep + 1,
        to_step: stepIndex + 1,
        step_name: steps[stepIndex].id,
        timestamp: new Date().toISOString(),
      });
      setCurrentStep(stepIndex);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <StepIndicator 
        steps={steps} 
        currentStep={currentStep} 
        onStepClick={handleStepClick}
      />

      {currentStep < steps.length ? (
        <form onSubmit={handleSubmit}>
          <StepFields
            fields={steps[currentStep].fields}
            trackEvent={trackEvent}
            formData={formData}
            handleFieldChange={handleFieldChange}
            currentStep={currentStep}
            stepName={steps[currentStep].id}
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
              onClick={handleMockExit}
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
