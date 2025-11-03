import React from "react";
import { CreditCard, Smartphone, QrCode, Wallet } from "lucide-react";
import { PAYMENT_METHODS } from "./bookingFormConstants";

const PaymentMethodSelector = ({ selectedMethod, onMethodSelect, error }) => {
  const iconMap = {
    QrCode,
    Smartphone,
    CreditCard,
    Wallet,
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Select Payment Method <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PAYMENT_METHODS.map((method) => {
          const Icon = iconMap[method.icon];
          return (
            <button
              key={method.value}
              type="button"
              onClick={() => onMethodSelect(method.value)}
              className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                selectedMethod === method.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-2 ${
                  selectedMethod === method.value
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              />
              <span
                className={`font-medium ${
                  selectedMethod === method.value
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {method.label}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {method.description}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default PaymentMethodSelector;
