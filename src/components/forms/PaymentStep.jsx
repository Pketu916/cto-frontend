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
  insuranceVerified,
  onVerifyInsurance,
  setValue,
  paymentMethod,
  onPaymentMethodSelect,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 flex items-center">
        <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
        Payment & Insurance
      </h3>

      <BookingSummary
        service={service}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        subtotal={subtotal}
      />

      {isHealthServiceWithInsurance && (
        <InsuranceSection
          useInsurance={useInsurance}
          onInsuranceToggle={onInsuranceToggle}
          register={register}
          errors={errors}
          insuranceVerified={insuranceVerified}
          onVerifyInsurance={onVerifyInsurance}
          setValue={setValue}
        />
      )}

      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onMethodSelect={onPaymentMethodSelect}
        error={errors.paymentMethod?.message}
      />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Amount of ₹{subtotal.toLocaleString()} will be
          blocked in your account. Payment will be processed after service
          completion.
        </p>
      </div>
    </div>
  );
};

export default PaymentStep;
