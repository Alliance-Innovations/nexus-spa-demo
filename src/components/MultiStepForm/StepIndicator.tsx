export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: Array<{ id: string; title: string }>;
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}) {
  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`flex-1 text-center ${
            index === currentStep
              ? "text-blue-600 font-medium"
              : index < currentStep
              ? "text-green-600"
              : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 cursor-pointer transition-colors ${
              index === currentStep
                ? "bg-blue-100 text-blue-600"
                : index < currentStep
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => onStepClick?.(index)}
          >
            {index + 1}
          </div>
          <span className="text-sm">{step.title}</span>
        </div>
      ))}
    </div>
  );
}
