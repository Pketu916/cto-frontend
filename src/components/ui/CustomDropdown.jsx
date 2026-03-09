import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  label,
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {label && (
        <div className="mb-3">
          {typeof label === "string" ? (
            <label className="block text-sm font-semibold text-gray-800">
              {label}
            </label>
          ) : (
            label
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-5 py-3.5 
          bg-white 
          border-2 
          rounded-xl 
          text-left
          flex items-center justify-between
          transition-all duration-300 ease-out
          outline-none
          shadow-sm
          ${
            disabled
              ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
              : isOpen
              ? "border-accent shadow-lg ring-2 ring-accent/20 scale-[1.01]"
              : "border-gray-300 hover:border-accent/50 hover:shadow-md active:scale-[0.99]"
          }
        `}
      >
        <span
          className={`text-sm font-medium ${
            value ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {displayText}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-all duration-300 ${
            isOpen ? "transform rotate-180 text-accent" : "text-gray-400"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl max-h-64 overflow-hidden"
          style={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            animation: "slideDown 0.2s ease-out",
          }}
        >
          <div
            className="py-2 overflow-y-auto max-h-64"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#6c4bc0 #f1f1f1",
            }}
          >
            <style>
              {`
                div::-webkit-scrollbar {
                  width: 6px;
                }
                div::-webkit-scrollbar-track {
                  background: #f1f1f1;
                  border-radius: 10px;
                }
                div::-webkit-scrollbar-thumb {
                  background: #6c4bc0;
                  border-radius: 10px;
                }
                div::-webkit-scrollbar-thumb:hover {
                  background: #5a3ba8;
                }
                @keyframes slideDown {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}
            </style>
            {options.length > 0 ? (
              options.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full px-5 py-3.5 text-left text-sm
                    flex items-center justify-between
                    transition-all duration-200 ease-out
                    relative
                    ${
                      value === option.value
                        ? "bg-gradient-to-r from-accent/10 to-accent/5 text-accent font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                    ${index === 0 ? "rounded-t-lg" : ""}
                    ${index === options.length - 1 ? "rounded-b-lg" : ""}
                    hover:pl-6
                  `}
                >
                  <span className="flex-1">{option.label}</span>
                  {value === option.value && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <Check className="w-5 h-5 text-accent font-bold" />
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-5 py-4 text-sm text-gray-500 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  </div>
                  <p>No options available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
