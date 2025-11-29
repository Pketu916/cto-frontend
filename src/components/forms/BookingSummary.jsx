import React from "react";
import { format } from "date-fns";
import { formatAUD } from "../../utils/pricingUtils";

const BookingSummary = ({
  service,
  selectedDate,
  selectedTime,
  subtotal,
  isCalculatingPrice = false,
  state = null,
  exactService = null,
  bookingType = "oneTime",
  startDate = null,
  endDate = null,
  selectedDays = [],
  serviceHours = null,
}) => {
  // Days of week labels
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const serviceName =
    exactService?.supportItemName ||
    service?.title ||
    service?.name ||
    "Service";
  const serviceId = exactService?.serviceId || service?.serviceId || "";
  const supportItemNumber = exactService?.supportItemNumber || "";

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Booking Summary
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Service:</span>
          <span className="font-medium text-right max-w-xs">{serviceName}</span>
        </div>
        {serviceId && (
          <div className="flex justify-between">
            <span className="text-gray-600">Service ID:</span>
            <span className="font-medium">{serviceId}</span>
          </div>
        )}
        {supportItemNumber && (
          <div className="flex justify-between">
            <span className="text-gray-600">Support Item Number:</span>
            <span className="font-medium text-xs">{supportItemNumber}</span>
          </div>
        )}
        {state && (
          <div className="flex justify-between">
            <span className="text-gray-600">State:</span>
            <span className="font-medium">{state}</span>
          </div>
        )}
        {exactService?.condition && (
          <div className="flex justify-between">
            <span className="text-gray-600">Condition:</span>
            <span className="font-medium">{exactService.condition}</span>
          </div>
        )}
        {bookingType === "oneTime" ? (
          <>
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
              <span className="font-medium">
                {selectedTime || "Not selected"}
              </span>
            </div>
            {serviceHours && (
              <div className="flex justify-between">
                <span className="text-gray-600">Service Hours:</span>
                <span className="font-medium">{serviceHours} hours</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium">
                {startDate
                  ? format(startDate, "EEEE, MMMM d, yyyy")
                  : "Not selected"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">End Date:</span>
              <span className="font-medium">
                {endDate
                  ? format(endDate, "EEEE, MMMM d, yyyy")
                  : "Not selected"}
              </span>
            </div>
            {selectedDays.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Service Days:</span>
                <span className="font-medium text-right max-w-xs">
                  {selectedDays
                    .sort()
                    .map((d) => daysOfWeek[d])
                    .join(", ")}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">
                {selectedTime || "Not selected"}
              </span>
            </div>
            {serviceHours && (
              <div className="flex justify-between">
                <span className="text-gray-600">Service Hours per Day:</span>
                <span className="font-medium">{serviceHours} hours</span>
              </div>
            )}
          </>
        )}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Price:</span>
            {isCalculatingPrice ? (
              <span className="text-sm text-gray-500">Calculating...</span>
            ) : subtotal !== null && subtotal !== undefined ? (
              <span className="font-bold text-green-600 text-lg">
                {formatAUD(subtotal)}
              </span>
            ) : exactService?.price !== null &&
              exactService?.price !== undefined ? (
              <span className="font-bold text-green-600 text-lg">
                {formatAUD(exactService.price)}
              </span>
            ) : (
              <span className="text-sm text-orange-600 font-medium">
                Price not available - Please complete previous steps
              </span>
            )}
          </div>
          {exactService?.priceType && exactService.priceType !== state && (
            <p className="text-xs text-blue-600 mt-1">
              Using {exactService.priceType} pricing
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {exactService
              ? `Price for ${
                  exactService.determinedCondition || exactService.condition
                } condition. Amount will be blocked in your account.`
              : "Price based on state, date, and time. Amount will be blocked in your account."}
            <br />
            <span className="font-medium text-blue-600">
              All prices in Australian Dollars (AUD)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
