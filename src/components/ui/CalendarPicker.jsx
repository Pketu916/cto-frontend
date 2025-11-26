import React, { useState, useEffect, useRef } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isBefore,
  addMonths,
  subMonths,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

const CalendarPicker = ({
  selectedDate,
  onDateChange,
  minDate = new Date(),
  disabled = false,
  className = "",
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const prevSelectedDateRef = useRef(selectedDate);

  // Update currentMonth when selectedDate changes (only if it's a different date)
  useEffect(() => {
    if (selectedDate && selectedDate !== prevSelectedDateRef.current) {
      setCurrentMonth(selectedDate);
      prevSelectedDateRef.current = selectedDate;
    }
  }, [selectedDate]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const isDisabled = isBefore(cloneDay, minDate);
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);

      days.push(
        <div
          key={day.toString()}
          className={`relative flex items-center justify-center h-10 w-10 ${
            isSelected
              ? "bg-blue-600 text-white rounded-full"
              : isDisabled
              ? "text-gray-300 cursor-not-allowed"
              : isCurrentMonth
              ? "text-gray-900 hover:bg-blue-50 cursor-pointer rounded-full"
              : "text-gray-400"
          } ${!isDisabled && isCurrentMonth ? "hover:bg-blue-50" : ""}`}
          onClick={() => {
            if (!isDisabled && isCurrentMonth) {
              onDateChange(cloneDay);
              setShowCalendar(false);
            }
          }}
        >
          <span
            className={`text-sm font-medium ${isSelected ? "text-white" : ""}`}
          >
            {formattedDate}
          </span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
    days = [];
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className={`relative ${className}`}>
      {/* Date Input Button */}
      <button
        type="button"
        onClick={() => !disabled && setShowCalendar(!showCalendar)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center justify-between ${
          disabled
            ? "bg-gray-100 cursor-not-allowed border-gray-300"
            : "bg-white border-gray-300 hover:border-gray-400"
        }`}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-700">
            {selectedDate
              ? format(selectedDate, "EEEE, MMMM d, yyyy")
              : "Select Date"}
          </span>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-gray-400 transition-transform ${
            showCalendar ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Calendar Dropdown */}
      {showCalendar && !disabled && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowCalendar(false)}
          />
          <div className="absolute z-20 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="space-y-1">{rows}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarPicker;
