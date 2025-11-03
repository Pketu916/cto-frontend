import React from "react";
import { ArrowLeft } from "lucide-react";
import Button from "../ui/Button";

const BookingFormFooter = ({
  step,
  totalSteps,
  onPrevStep,
  onNextStep,
  onSubmit,
  isLoading,
  isStepValid,
  isSubmitting,
  canSubmit,
}) => {
  return (
    <div className="px-4 py-3 bg-gray-50 rounded-b-lg flex justify-between border-t">
      <div>
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevStep}
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
        )}
      </div>

      <div>
        {step < totalSteps ? (
          <Button
            type="button"
            variant="outline"
            onClick={onNextStep}
            disabled={isLoading || !isStepValid}
            className={!isStepValid ? "opacity-50 cursor-not-allowed" : ""}
          >
            Next
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        ) : (
          <Button type="submit" disabled={!canSubmit} loading={isSubmitting}>
            {isSubmitting ? "Creating Booking..." : "Complete Booking"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingFormFooter;
