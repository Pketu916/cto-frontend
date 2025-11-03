import React from "react";
import { Calendar } from "lucide-react";
import TimeSlotPicker from "./TimeSlotPicker";

const ScheduleStep = ({
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  serviceId,
  availableSlots,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 flex items-center">
        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
        Schedule Your Service
      </h3>

      <TimeSlotPicker
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        selectedTime={selectedTime}
        onTimeChange={onTimeChange}
        serviceId={serviceId}
        availableSlots={availableSlots}
      />
    </div>
  );
};

export default ScheduleStep;
