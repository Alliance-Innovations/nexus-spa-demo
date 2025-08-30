export function StepFields({
  fields,
  trackEvent,
  formData,
  handleFieldChange,
  currentStep,
  stepName,
}: {
  fields: Array<{
    name: string;
    label: string;
    type: string;
    options?: Array<{ value: string; label: string }>;
  }>;
  trackEvent: (event: string, eventData: Record<string, unknown>) => void;
  formData: Record<string, string | boolean>;
  handleFieldChange: (name: string, value: string | boolean) => void;
  currentStep: number;
  stepName: string;
}) {
  const handleFieldFocus = (fieldName: string, fieldLabel: string) => {
    trackEvent("field_focus", {
      field_name: fieldName,
      field_label: fieldLabel,
      step_number: currentStep + 1,
      step_name: stepName,
      timestamp: new Date().toISOString(),
    });
  };

  const handleFieldBlur = (fieldName: string, fieldLabel: string, value: string | boolean) => {
    trackEvent("field_blur", {
      field_name: fieldName,
      field_label: fieldLabel,
      field_value: String(value),
      step_number: currentStep + 1,
      step_name: stepName,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
          </label>
          {field.type === "radio" && field.options ? (
            <div className="space-y-2">
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`${field.name}-${option.value}`}
                    name={field.name}
                    value={option.value}
                    checked={(formData[field.name] as string) === option.value}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    onFocus={() => handleFieldFocus(field.name, field.label)}
                    onBlur={() => handleFieldBlur(field.name, field.label, formData[field.name] || "")}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  />
                  <label
                    htmlFor={`${field.name}-${option.value}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={(formData[field.name] as boolean) || false}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              onFocus={() => handleFieldFocus(field.name, field.label)}
              onBlur={() => handleFieldBlur(field.name, field.label, formData[field.name] || false)}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
            />
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={(formData[field.name] as string) || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onFocus={() => handleFieldFocus(field.name, field.label)}
              onBlur={() => handleFieldBlur(field.name, field.label, formData[field.name] || "")}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
