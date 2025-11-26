import React, { useState, useEffect, useRef } from "react";
import { Calendar, Clock } from "lucide-react";
import CalendarPicker from "../ui/CalendarPicker";
import { formatAUD } from "../../utils/pricingUtils";

const ScheduleStep = ({
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  serviceId,
  availableSlots,
  estimatedPrice = null,
  isCalculatingPrice = false,
  exactService = null,
  blockedSlots = [],
  onSlotBlock,
  onSlotUnblock,
  state = null,
  onCalculatePricing,
}) => {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const prevSelectedTimeRef = useRef(selectedTime);
  const isInternalUpdateRef = useRef(false);

  // Initialize hour and minute from selectedTime (only when selectedTime changes externally)
  useEffect(() => {
    // Only update if selectedTime changed externally (not from our internal update)
    if (
      selectedTime !== prevSelectedTimeRef.current &&
      !isInternalUpdateRef.current
    ) {
      if (selectedTime) {
        const [h, m] = selectedTime.split(":");
        setHour(h || "");
        setMinute(m || "");
      } else {
        setHour("");
        setMinute("");
      }
      prevSelectedTimeRef.current = selectedTime;
    }
    isInternalUpdateRef.current = false;
  }, [selectedTime]);

  // Update selectedTime when hour or minute changes (only if user manually changed them)
  useEffect(() => {
    if (hour && minute) {
      // Convert hour 24 to 0 (midnight)
      let hourValue = parseInt(hour);
      if (hourValue === 24) {
        hourValue = 0;
      }
      const timeString = `${hourValue
        .toString()
        .padStart(2, "0")}:${minute.padStart(2, "0")}`;
      if (timeString !== selectedTime) {
        isInternalUpdateRef.current = true;
        onTimeChange(timeString);
        prevSelectedTimeRef.current = timeString;
      }
    } else if (!hour && !minute && selectedTime) {
      isInternalUpdateRef.current = true;
      onTimeChange("");
      prevSelectedTimeRef.current = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute]);

  const handleHourChange = (e) => {
    const value = e.target.value;
    // Allow empty or valid hour (1-24)
    if (value === "") {
      setHour("");
      return;
    }
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 24) {
      setHour(value);
    }
  };

  const handleMinuteChange = (e) => {
    const value = e.target.value;
    // Allow empty or valid minute (0-59)
    if (value === "") {
      setMinute("");
      return;
    }
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 59) {
      setMinute(value);
    }
  };

  const formatTimeDisplay = (h, m) => {
    if (!h || !m) return "";
    const hourNum = parseInt(h);
    const minuteNum = parseInt(m);
    if (isNaN(hourNum) || isNaN(minuteNum)) return "";
    // Handle hour 24 as midnight (0)
    const displayHourNum = hourNum === 24 ? 0 : hourNum;
    const ampm = displayHourNum >= 12 ? "PM" : "AM";
    const displayHour = displayHourNum % 12 || 12;
    return `${displayHour}:${m.padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-900 flex items-center">
        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
        Schedule Your Service
      </h3>

      <div className="space-y-4">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date <span className="text-red-500">*</span>
          </label>
          <CalendarPicker
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            minDate={new Date()}
          />
        </div>

        {/* Time Selection - Direct Input */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Hour (1-24)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={hour}
                    onChange={handleHourChange}
                    onBlur={(e) => {
                      const val = e.target.value;
                      if (val && (parseInt(val) < 1 || parseInt(val) > 24)) {
                        setHour("");
                      }
                    }}
                    placeholder="09"
                    min="1"
                    max="24"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Minute (0-59)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={minute}
                    onChange={handleMinuteChange}
                    onBlur={(e) => {
                      const val = e.target.value;
                      if (val && (parseInt(val) < 0 || parseInt(val) > 59)) {
                        setMinute("");
                      }
                    }}
                    placeholder="00"
                    min="0"
                    max="59"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
            {hour && minute && (
              <p className="mt-2 text-sm text-gray-600">
                Selected Time:{" "}
                <span className="font-medium">
                  {formatTimeDisplay(hour, minute)}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Show Total Price Below Date/Time Selection */}
        {selectedDate && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-base font-semibold text-gray-800">
                Total Price:
              </span>
              {isCalculatingPrice ? (
                <span className="text-sm text-blue-600 font-medium">
                  Calculating...
                </span>
              ) : estimatedPrice !== null &&
                estimatedPrice !== undefined &&
                !isNaN(estimatedPrice) ? (
                <span className="text-2xl font-bold text-blue-700">
                  {formatAUD(estimatedPrice)}
                  {exactService?.priceType && (
                    <span className="text-xs text-blue-500 ml-2 font-normal">
                      ({exactService.priceType})
                    </span>
                  )}
                </span>
              ) : exactService?.price !== null &&
                exactService?.price !== undefined &&
                !isNaN(exactService.price) ? (
                <span className="text-2xl font-bold text-blue-700">
                  {formatAUD(exactService.price)}
                  {exactService?.priceType && (
                    <span className="text-xs text-blue-500 ml-2 font-normal">
                      ({exactService.priceType})
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-sm text-orange-600 font-medium">
                  Click button below to calculate pricing
                </span>
              )}
            </div>

            {/* Calculate Pricing Button */}
            {selectedDate && selectedTime && (
              <div className="mb-3">
                <button
                  type="button"
                  onClick={onCalculatePricing}
                  disabled={isCalculatingPrice || !state}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isCalculatingPrice || !state
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  }`}
                >
                  {isCalculatingPrice ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Calculating Pricing...
                    </span>
                  ) : !state ? (
                    "Please Select State in Step 3 First"
                  ) : (
                    "Calculate Your Pricing"
                  )}
                </button>
              </div>
            )}

            <div className="text-xs text-gray-600 space-y-1">
              {exactService ? (
                <p>
                  Price for{" "}
                  <strong>
                    {exactService.determinedCondition || exactService.condition}
                  </strong>{" "}
                  condition
                  {selectedTime && " at selected time"}
                </p>
              ) : (
                <p>Price varies by state, day of week, and time of day</p>
              )}
              <p className="text-blue-700 font-medium">
                All prices in Australian Dollars (AUD)
              </p>
            </div>
          </div>
        )}

        {/* Show exact service information when available */}
        {exactService && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-900 mb-2">
              Service Details:
            </h4>
            <div className="space-y-2 text-sm text-green-800">
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
      </div>
    </div>
  );
};

export default ScheduleStep;
