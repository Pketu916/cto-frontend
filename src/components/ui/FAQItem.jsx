import React, { useState } from "react";

const FAQItem = ({ question, answer, isOpen = false, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 pr-4">
            {question}
          </h3>
          <div className="flex-shrink-0">
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4">
          <div className="border-t border-gray-100 pt-4">
            <p className="text-gray-600 leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
