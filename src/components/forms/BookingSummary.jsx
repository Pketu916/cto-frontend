import React from "react";
import { format } from "date-fns";

const BookingSummary = ({ service, selectedDate, selectedTime, subtotal }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Booking Summary
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Service:</span>
          <span className="font-medium">{service?.title || "Service"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium">
            {selectedDate
              ? format(selectedDate, "EEEE, MMMM d, yyyy")
              : "Not selected"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Time:</span>
          <span className="font-medium">{selectedTime || "Not selected"}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold text-green-600 text-base">
              ₹{subtotal.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This amount will be blocked in your account
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
