import React from "react";
import { CreditCard } from "lucide-react";
import BookingSummary from "./BookingSummary";
import InsuranceSection from "./InsuranceSection";
import PaymentMethodSelector from "./PaymentMethodSelector";

const PaymentStep = ({
  service,
  selectedDate,
  selectedTime,
  subtotal,
  isHealthServiceWithInsurance,
  useInsurance,
  onInsuranceToggle,
  register,
  errors,
  touchedFields = {},
  isSubmitted = false,
  insuranceVerified,
  onVerifyInsurance,
  setValue,
  paymentMethod,
  onPaymentMethodSelect,
  isCalculatingPrice = false,
  state = null,
  exactService = null,
}) => {
  // Helper to check if error should be shown
  const shouldShowError = (fieldName) => {
    return (touchedFields[fieldName] || isSubmitted) && errors[fieldName];
  };
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 flex items-center">
        <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
        Payment & Insurance
      </h3>

      {/* Show exact service information if available */}
      {exactService && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            Service Details:
          </h4>
          <div className="space-y-1 text-sm text-blue-800">
            <div>
              <strong>Support Item Number:</strong>{" "}
              {exactService.supportItemNumber}
            </div>
            <div>
              <strong>Service Name:</strong> {exactService.supportItemName}
            </div>
            <div>
              <strong>Condition:</strong> {exactService.condition}
            </div>
            <div>
              <strong>Unit:</strong> {exactService.unit}
            </div>
            {exactService.quote && (
              <div>
                <strong>Quote Required:</strong> {exactService.quote}
              </div>
            )}
          </div>
        </div>
      )}

      <BookingSummary
        service={exactService || service}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        subtotal={subtotal}
        isCalculatingPrice={isCalculatingPrice}
        state={state}
        exactService={exactService}
      />

      {isHealthServiceWithInsurance && (
        <InsuranceSection
          useInsurance={useInsurance}
          onInsuranceToggle={onInsuranceToggle}
          register={register}
          errors={errors}
          touchedFields={touchedFields}
          isSubmitted={isSubmitted}
          insuranceVerified={insuranceVerified}
          onVerifyInsurance={onVerifyInsurance}
          setValue={setValue}
        />
      )}

      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onMethodSelect={onPaymentMethodSelect}
        error={
          shouldShowError("paymentMethod")
            ? errors.paymentMethod?.message
            : undefined
        }
      />
      <input
        type="hidden"
        value={paymentMethod || ""}
        readOnly
        {...register("paymentMethod")}
      />

      {subtotal !== null && subtotal !== undefined && subtotal > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Amount will be blocked in your account.
            Payment will be processed after service completion.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
