import React, { useState } from "react";
import Modal from "./Modal";
import StatusTracker from "./StatusTracker";

// Map booking status to tracker status
const mapBookingStatusToTracker = (bookingStatus) => {
  switch (bookingStatus) {
    case "provider-on-way":
      return "on_the_way";
    case "in-progress":
    case "work-started":
    case "provider-started":
      return "on_the_way";
    case "completed":
      return "completed";
    default:
      return "pending";
  }
};

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "#6c4bc0"; // Purple
    case "provider-on-way":
    case "confirmed":
      return "#0b1f3b"; // Dark blue
    case "in-progress":
    case "work-started":
    case "provider-started":
      return "#ff7a00"; // Orange
    case "completed":
      return "#0b1f3b"; // Dark blue
    default:
      return "#6c4bc0";
  }
};

// Get status label
const getStatusLabel = (status) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const StatusDot = ({ status, bookingNumber, size = "md", className = "" }) => {
  const [showModal, setShowModal] = useState(false);
  const statusColor = getStatusColor(status);
  const trackerStatus = mapBookingStatusToTracker(status);

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`relative ${sizeClasses[size]} rounded-full border-2 border-white shadow-lg hover:scale-125 hover:shadow-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 ${className}`}
        style={{
          backgroundColor: statusColor,
          focusRingColor: statusColor,
        }}
        title={`Click to view status: ${getStatusLabel(status)}`}
        aria-label={`View status: ${getStatusLabel(status)}`}
      >
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-75"
          style={{ backgroundColor: statusColor }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: statusColor }}
        />
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Booking Status"
        size="md"
      >
        <div className="space-y-6">
          {/* Booking Number */}
          {bookingNumber && (
            <div className="text-center">
              <p className="text-sm text-gray-600">Booking Number</p>
              <p className="text-lg font-semibold text-primary">
                {bookingNumber}
              </p>
            </div>
          )}

          {/* Current Status Badge */}
          <div className="flex items-center justify-center">
            <div
              className="px-4 py-2 rounded-full text-white font-semibold"
              style={{ backgroundColor: statusColor }}
            >
              {getStatusLabel(status)}
            </div>
          </div>

          {/* Status Tracker */}
          <div className="py-4">
            <StatusTracker
              status={trackerStatus}
              stages={[
                { key: "pending", label: "Pending" },
                { key: "on_the_way", label: "En Route" },
                { key: "completed", label: "Completed" },
              ]}
            />
          </div>

          {/* Status Description */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              What does this status mean?
            </h4>
            <p className="text-sm text-gray-600">
              {status === "pending" &&
                "Your booking is being reviewed. We'll confirm shortly."}
              {(status === "provider-on-way" || status === "confirmed") &&
                "A service provider has been assigned and is en route to your location."}
              {(status === "in-progress" ||
                status === "work-started" ||
                status === "provider-started") &&
                "The service provider has arrived and work is in progress."}
              {status === "completed" &&
                "The service has been completed successfully."}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StatusDot;
