import React from "react";
import { ArrowLeft, MapPin } from "lucide-react";

const BookingFormHeader = ({ service, onCancel, onBack }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-t-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-secondary">Book Service</h2>
          <p className="text-blue-100 text-sm mt-0.5">
            {service?.title || "Service"}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel || onBack}
          className="flex items-center text-blue-100 hover:text-white transition-colors duration-200 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>
    </div>
  );
};

export default BookingFormHeader;
