import React from "react";
import { STEP_LABELS } from "./bookingFormConstants";

const StepIndicator = ({ currentStep, totalSteps, getStepStatus }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="px-4 py-2 bg-blue-50 border-b border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {steps.map((stepNumber) => {
            const status = getStepStatus(stepNumber);
            const isCompleted = status === "completed";
            const isCurrent = status === "current";
            const hasError = status === "error";

            return (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    hasError
                      ? "bg-red-500 text-white"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {hasError ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={`ml-1.5 text-xs font-medium transition-colors ${
                    hasError
                      ? "text-red-600"
                      : isCompleted
                      ? "text-green-600"
                      : isCurrent
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {STEP_LABELS[stepNumber] || `Step ${stepNumber}`}
                </span>
                {stepNumber < totalSteps && (
                  <div
                    className={`w-6 h-0.5 ml-2 transition-colors ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-xs text-gray-600">
          {currentStep}/{totalSteps}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
