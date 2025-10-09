import React from "react";
import { Calendar } from "lucide-react";

const DatePicker = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  className = "",
  ...props
}) => {
  const formatDateForInput = (date) => {
    if (!date) return "";
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }
    return date;
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="date"
          id={name}
          name={name}
          value={formatDateForInput(value)}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          min={minDate}
          max={maxDate}
          className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
          {...props}
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default DatePicker;
