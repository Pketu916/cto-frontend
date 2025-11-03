import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      placeholder,
      error,
      required = false,
      disabled = false,
      className = "",
      autoComplete,
      ...props
    },
    ref
  ) => {
    // Auto-detect autocomplete based on field name and type
    const getAutoComplete = () => {
      if (autoComplete) return autoComplete;

      const fieldName = name?.toLowerCase();
      if (fieldName?.includes("email")) return "email";
      if (fieldName?.includes("password")) {
        if (fieldName?.includes("confirm") || fieldName?.includes("repeat")) {
          return "new-password";
        }
        return "current-password";
      }
      if (fieldName?.includes("phone")) return "tel";
      if (fieldName?.includes("name")) return "name";
      if (fieldName?.includes("address")) return "address-line1";
      if (fieldName?.includes("city")) return "address-level2";
      if (fieldName?.includes("state")) return "address-level1";
      if (fieldName?.includes("pincode") || fieldName?.includes("zip"))
        return "postal-code";

      return "off";
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-0.5"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={getAutoComplete()}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          style={{
            backgroundImage: "none !important",
            backgroundRepeat: "no-repeat !important",
            backgroundPosition: "calc(100% - 3px) center !important",
            backgroundSize: "14px !important",
            backgroundClip: "border-box !important",
          }}
          className={`w-full px-3 py-1.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
          {...props}
        />
        {error && <p className="mt-0.5 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

export default Input;
