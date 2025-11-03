import React, { useState, useEffect } from "react";
import {
  Navigation,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

const ProviderStatusUpdateCard = ({
  booking,
  onStatusUpdate,
  onLocationTrackingStart,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(
    booking.status || "pending"
  );
  const [enableTracking, setEnableTracking] = useState(false);
  const [providerNotes, setProviderNotes] = useState(
    booking.providerNotes || ""
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  // Get available status options based on current status
  const getAvailableStatuses = () => {
    const statusFlow = {
      pending: ["confirmed", "provider-on-way"],
      confirmed: ["provider-on-way", "provider-started"],
      "provider-on-way": ["provider-started", "work-started"],
      "provider-started": ["work-started", "in-progress"],
      "work-started": ["in-progress", "completed"],
      "in-progress": ["completed"],
      completed: [],
      cancelled: [],
    };

    return statusFlow[booking.status] || ["confirmed", "provider-on-way"];
  };

  const availableStatuses = getAvailableStatuses();

  const statusOptions = [
    {
      value: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      description: "Confirm the booking assignment",
      color: "blue",
    },
    {
      value: "provider-on-way",
      label: "En Route",
      icon: Navigation,
      description: "Provider is heading to customer location",
      color: "primary",
    },
    {
      value: "provider-started",
      label: "Arrived",
      icon: MapPin,
      description: "Provider has arrived at location",
      color: "green",
    },
    {
      value: "work-started",
      label: "Work Started",
      icon: Clock,
      description: "Service work has begun",
      color: "orange",
    },
    {
      value: "in-progress",
      label: "In Progress",
      icon: AlertCircle,
      description: "Service is currently in progress",
      color: "orange",
    },
    {
      value: "completed",
      label: "Completed",
      icon: CheckCircle,
      description: "Service has been completed",
      color: "green",
    },
  ];

  // Auto-enable tracking when "provider-on-way" is selected
  useEffect(() => {
    if (selectedStatus === "provider-on-way") {
      setEnableTracking(true);
    }
  }, [selectedStatus]);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsUpdating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError("");
        setIsUpdating(false);
      },
      (error) => {
        console.error("Location error:", error);
        setLocationError(
          "Unable to get your location. Please enable location access."
        );
        setIsUpdating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      return;
    }

    setIsUpdating(true);

    try {
      // If "en route" and tracking is enabled, get location first
      if (selectedStatus === "provider-on-way" && enableTracking) {
        if (!currentLocation) {
          await getCurrentLocation();
          // Wait a bit for location to be set
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (currentLocation) {
          // Start location tracking before status update
          if (onLocationTrackingStart) {
            await onLocationTrackingStart(booking._id, currentLocation);
          }
        } else {
          setLocationError("Please enable location access to start tracking");
          setIsUpdating(false);
          return;
        }
      }

      // Update status (this will also enable tracking if status is provider-on-way)
      await onStatusUpdate(booking._id, selectedStatus, providerNotes);

      setIsUpdating(false);
    } catch (error) {
      console.error("Status update error:", error);
      setLocationError("Failed to update status. Please try again.");
      setIsUpdating(false);
    }
  };

  const filteredStatusOptions = statusOptions.filter((opt) =>
    availableStatuses.includes(opt.value)
  );

  const selectedOption = statusOptions.find(
    (opt) => opt.value === selectedStatus
  );

  return (
    <Card padding="lg" className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Update Booking Status
          </h3>
          <p className="text-sm text-gray-600">
            Booking #{booking.bookingNumber}
          </p>
        </div>

        {/* Current Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Current Status
              </p>
              <p className="text-base font-semibold text-gray-900 capitalize">
                {booking.status.replace("-", " ")}
              </p>
            </div>
            {selectedOption && (
              <Badge color={selectedOption.color}>
                <selectedOption.icon className="h-4 w-4 mr-1" />
                {selectedOption.label}
              </Badge>
            )}
          </div>
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select New Status
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredStatusOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedStatus === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div
                        className={`font-semibold mb-1 ${
                          isSelected ? "text-primary" : "text-gray-900"
                        }`}
                      >
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-600">
                        {option.description}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Tracking Option */}
        {selectedStatus === "provider-on-way" && (
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="enableTracking"
                checked={enableTracking}
                onChange={(e) => setEnableTracking(e.target.checked)}
                className="mt-1 w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary"
              />
              <div className="flex-1">
                <label
                  htmlFor="enableTracking"
                  className="font-semibold text-gray-900 cursor-pointer"
                >
                  Enable Location Tracking
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Allow customer to track your location in real-time. This will
                  send them a tracking link via email.
                </p>

                {enableTracking && (
                  <div className="mt-4 space-y-3">
                    {!currentLocation && (
                      <Button
                        onClick={getCurrentLocation}
                        disabled={isUpdating}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        {isUpdating
                          ? "Getting Location..."
                          : "Get Current Location"}
                      </Button>
                    )}

                    {currentLocation && (
                      <div className="bg-white p-3 rounded border border-green-200">
                        <p className="text-sm font-medium text-green-700 mb-1">
                          ✓ Location detected
                        </p>
                        <p className="text-xs text-gray-600">
                          Lat: {currentLocation.latitude.toFixed(6)}, Lng:{" "}
                          {currentLocation.longitude.toFixed(6)}
                        </p>
                      </div>
                    )}

                    {locationError && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded">
                        <p className="text-sm text-red-700">{locationError}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Provider Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provider Notes (Optional)
          </label>
          <textarea
            value={providerNotes}
            onChange={(e) => setProviderNotes(e.target.value)}
            placeholder="Add any notes or updates for the customer..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={handleStatusUpdate}
            disabled={isUpdating || !selectedStatus}
            variant="primary"
            className="flex-1"
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProviderStatusUpdateCard;
