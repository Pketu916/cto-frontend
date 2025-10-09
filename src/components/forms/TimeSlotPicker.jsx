import React, { useState, useEffect } from "react";
import { format, addDays, isSameDay, isBefore, isAfter } from "date-fns";
import { Clock, Calendar } from "lucide-react";
import { bookingsAPI } from "../../services/api";

const TimeSlotPicker = ({
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  serviceId,
  availableSlots = [],
  disabled = false,
  className = "",
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [availableSlotsForDate, setAvailableSlotsForDate] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate time slots (9 AM to 6 PM, 1 hour intervals)
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Fetch available slots for selected date
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate || !serviceId) {
        console.log("No selectedDate or serviceId, using all slots");
        setAvailableSlotsForDate(timeSlots);
        return;
      }

      console.log("Fetching available slots:", { selectedDate, serviceId });
      setLoading(true);
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        console.log("Formatted date:", formattedDate);

        // Call backend API to get available slots
        const response = await fetch(
          `https://cto-backend.onrender.com/api/bookings/available-slots?date=${formattedDate}&serviceId=${serviceId}`
        );

        //   const response = await fetch(
        //   `http://localhost:5000/api/bookings/available-slots?date=${formattedDate}&serviceId=${serviceId}`
        // );

        console.log("Available slots response:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Available slots data:", data);
          setAvailableSlotsForDate(data.availableSlots || []);
        } else {
          console.log("API call failed, using fallback");
          setAvailableSlotsForDate(timeSlots);
        }
      } catch (error) {
        console.error("Error fetching available slots:", error);
        setAvailableSlotsForDate(timeSlots);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, serviceId]);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const isSlotAvailable = (date, time) => {
    const slotKey = `${format(date, "yyyy-MM-dd")}-${time}`;
    return availableSlots.includes(slotKey);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  };

  const navigateWeek = (direction) => {
    setCurrentWeek((prev) => addDays(prev, direction * 7));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Select Date
        </h3>

        {/* Week Navigation */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigateWeek(-1)}
            disabled={disabled}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous Week
          </button>
          <span className="text-sm font-medium text-gray-600">
            {format(currentWeek, "MMM d")} -{" "}
            {format(addDays(currentWeek, 6), "MMM d, yyyy")}
          </span>
          <button
            onClick={() => navigateWeek(1)}
            disabled={disabled}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Week →
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isDisabled = isDateDisabled(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isDisabled && !disabled && onDateChange(day)}
                disabled={isDisabled || disabled}
                className={`
                  p-3 text-center rounded-lg border transition-colors
                  ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : isDisabled
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                  }
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <div className="text-xs font-medium">{format(day, "EEE")}</div>
                <div className="text-lg font-semibold">{format(day, "d")}</div>
                <div className="text-xs">{format(day, "MMM")}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Select Time
          </h3>

          <div className="grid grid-cols-5 gap-3">
            {loading ? (
              <div className="col-span-5 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">
                  Loading available slots...
                </p>
              </div>
            ) : availableSlotsForDate.length === 0 ? (
              <div className="col-span-5 text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  No available slots for this date
                </p>
                <p className="text-sm text-gray-400">
                  Please select another date
                </p>
                <div className="mt-4 text-xs text-gray-400">
                  Debug: availableSlotsForDate.length ={" "}
                  {availableSlotsForDate.length}
                </div>
              </div>
            ) : (
              timeSlots.map((time) => {
                const isAvailable =
                  availableSlotsForDate.includes(time) ||
                  availableSlotsForDate.length === 0;
                const isSelected = selectedTime === time;

                return (
                  <button
                    key={time}
                    onClick={() =>
                      isAvailable && !disabled && onTimeChange(time)
                    }
                    disabled={!isAvailable || disabled}
                    className={`
                    p-3 text-center rounded-lg border transition-colors
                    ${
                      isSelected
                        ? "bg-green-600 text-white border-green-600"
                        : isAvailable
                        ? "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300"
                        : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    }
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  >
                    {time}
                  </button>
                );
              })
            )}
          </div>

          {selectedDate && (
            <div className="mt-3 text-sm text-gray-600">
              Available slots for {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
