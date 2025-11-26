import React, { useState, useEffect, useRef } from "react";
import { Navigation, MapPin, StopCircle, CheckCircle } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { bookingsAPI } from "../../services/api";

const LocationTrackingManager = ({ booking, onTrackingUpdate }) => {
  const [isTracking, setIsTracking] = useState(
    booking.providerLocation?.isTracking || false
  );
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const trackingIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, []);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const updateLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      setError("");

      // Send location to backend
      await bookingsAPI.updateProviderLocation(
        booking._id,
        location.latitude,
        location.longitude
      );

      if (onTrackingUpdate) {
        onTrackingUpdate({
          ...booking.providerLocation,
          latitude: location.latitude,
          longitude: location.longitude,
          lastUpdated: new Date(),
          isTracking: true,
        });
      }
    } catch (err) {
      console.error("Location update error:", err);
      setError("Failed to update location");
    }
  };

  const startTracking = async () => {
    try {
      setIsStarting(true);
      setError("");

      // Get initial location
      const location = await getCurrentLocation();
      setCurrentLocation(location);

      // Start location tracking
      await bookingsAPI.updateProviderLocation(
        booking._id,
        location.latitude,
        location.longitude
      );

      setIsTracking(true);

      // Update location every 30 seconds
      trackingIntervalRef.current = setInterval(() => {
        updateLocation();
      }, 30000);

      setIsStarting(false);
    } catch (err) {
      console.error("Start tracking error:", err);
      setError("Failed to start tracking. Please check location permissions.");
      setIsStarting(false);
    }
  };

  const stopTracking = () => {
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
    setIsTracking(false);
    setError("");
  };

  return (
    <Card padding="md" className="w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-secondary" />
              Location Tracking
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {isTracking
                ? "Customer can see your real-time location"
                : "Enable to share your location with customer"}
            </p>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${
              isTracking ? "bg-green-500 animate-pulse" : "bg-gray-300"
            }`}
          />
        </div>

        {currentLocation && isTracking && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-green-700" />
              <span className="text-sm font-medium text-green-900">
                Location Active
              </span>
            </div>
            <p className="text-xs text-green-700">
              Lat: {currentLocation.latitude.toFixed(6)}, Lng:{" "}
              {currentLocation.longitude.toFixed(6)}
            </p>
            {booking.providerLocation?.lastUpdated && (
              <p className="text-xs text-green-600 mt-1">
                Last updated:{" "}
                {new Date(
                  booking.providerLocation.lastUpdated
                ).toLocaleTimeString()}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          {!isTracking ? (
            <Button
              onClick={startTracking}
              disabled={isStarting}
              variant="primary"
              size="sm"
              className="flex-1"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {isStarting ? "Starting..." : "Start Tracking"}
            </Button>
          ) : (
            <Button
              onClick={stopTracking}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Stop Tracking
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LocationTrackingManager;











