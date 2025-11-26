import React, { useState, useEffect } from "react";
import { Clock, X } from "lucide-react";

const TimePicker = ({
  selectedTime,
  onTimeChange,
  disabled = false,
  className = "",
  blockedSlots = [],
  onSlotBlock,
  onSlotUnblock,
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("00");

  // Initialize hour and minute from selectedTime
  useEffect(() => {
    if (selectedTime) {
      const [hour, minute] = selectedTime.split(":");
      setSelectedHour(hour || "09");
      setSelectedMinute(minute || "00");
    }
  }, [selectedTime]);

  // Generate hours (9 AM to 6 PM)
  const hours = Array.from({ length: 10 }, (_, i) => {
    const hour = 9 + i;
    return hour.toString().padStart(2, "0");
  });

  // Generate minutes (0, 15, 30, 45)
  const minutes = ["00", "15", "30", "45"];

  const formatTime = (time) => {
    if (!time) return "Select Time";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
    const newTime = `${hour}:${selectedMinute}`;
    onTimeChange(newTime);
  };

  const handleMinuteSelect = (minute) => {
    setSelectedMinute(minute);
    const newTime = `${selectedHour}:${minute}`;
    onTimeChange(newTime);
  };

  const handleTimeConfirm = () => {
    const newTime = `${selectedHour}:${selectedMinute}`;
    onTimeChange(newTime);
    setShowTimePicker(false);
  };

  const handleTimeClear = () => {
    onTimeChange("");
    setSelectedHour("09");
    setSelectedMinute("00");
    setShowTimePicker(false);
  };

  const isSlotBlocked = (time) => {
    return blockedSlots.includes(time);
  };

  const handleBlockSlot = (e, time) => {
    e.stopPropagation();
    if (onSlotBlock) {
      onSlotBlock(time);
    }
  };

  const handleUnblockSlot = (e, time) => {
    e.stopPropagation();
    if (onSlotUnblock) {
      onSlotUnblock(time);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Time Input Button */}
      <button
        type="button"
        onClick={() => !disabled && setShowTimePicker(!showTimePicker)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center justify-between ${
          disabled
            ? "bg-gray-100 cursor-not-allowed border-gray-300"
            : "bg-white border-gray-300 hover:border-gray-400"
        }`}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-700">
            {formatTime(selectedTime)}
          </span>
          {selectedTime && isSlotBlocked(selectedTime) && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
              Blocked
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            showTimePicker ? "rotate-180" : ""
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
      </button>

      {/* Time Picker Dropdown */}
      {showTimePicker && !disabled && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowTimePicker(false)}
          />
          <div className="absolute z-20 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">
                Select Time (Hour & Minute)
              </h4>
              <button
                type="button"
                onClick={() => setShowTimePicker(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Hour Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Hour
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                  {hours.map((hour) => {
                    const hourNum = parseInt(hour);
                    const ampm = hourNum >= 12 ? "PM" : "AM";
                    const displayHour = hourNum % 12 || 12;
                    const isSelected = selectedHour === hour;
                    const time = `${hour}:${selectedMinute}`;
                    const isBlocked = isSlotBlocked(time);

                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => handleHourSelect(hour)}
                        disabled={isBlocked}
                        className={`p-2 text-center rounded-lg border transition-colors text-xs ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : isBlocked
                            ? "bg-red-100 text-red-400 border-red-200 cursor-not-allowed"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                        }`}
                        title={
                          isBlocked
                            ? "This slot is blocked"
                            : `${displayHour} ${ampm}`
                        }
                      >
                        <div className="font-medium">{displayHour}</div>
                        <div className="text-[10px]">{ampm}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minute Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Minute
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {minutes.map((minute) => {
                    const isSelected = selectedMinute === minute;
                    const time = `${selectedHour}:${minute}`;
                    const isBlocked = isSlotBlocked(time);

                    return (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => handleMinuteSelect(minute)}
                        disabled={isBlocked}
                        className={`p-3 text-center rounded-lg border transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : isBlocked
                            ? "bg-red-100 text-red-400 border-red-200 cursor-not-allowed"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                        }`}
                        title={isBlocked ? "This slot is blocked" : minute}
                      >
                        {minute}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected Time Display */}
            {selectedHour && selectedMinute && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Selected Time:</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {formatTime(`${selectedHour}:${selectedMinute}`)}
                    </p>
                  </div>
                  {isSlotBlocked(`${selectedHour}:${selectedMinute}`) ? (
                    <button
                      type="button"
                      onClick={(e) =>
                        handleUnblockSlot(
                          e,
                          `${selectedHour}:${selectedMinute}`
                        )
                      }
                      className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) =>
                        handleBlockSlot(e, `${selectedHour}:${selectedMinute}`)
                      }
                      className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    >
                      Block
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleTimeConfirm}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Confirm
              </button>
              {selectedTime && (
                <button
                  type="button"
                  onClick={handleTimeClear}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimePicker;
