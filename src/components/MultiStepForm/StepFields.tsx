export function StepFields({
  fields,
  trackEvent,
  formData,
  handleFieldChange,
}: {
  fields: Array<{ name: string; label: string; type: string }>;
  trackEvent: (event: string, eventData: Record<string, unknown>) => void;
  formData: Record<string, string | boolean>;
  handleFieldChange: (name: string, value: string | boolean) => void;
}) {
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
          {field.type === "checkbox" ? (
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={(formData[field.name] as boolean) || false}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  onFocus={() => trackEvent("field_focus", {
                "field_name": field.label,
              })}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
            />
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={(formData[field.name] as string) || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onFocus={() => trackEvent("field_focus", {
                "field_name": field.label,
              })}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
