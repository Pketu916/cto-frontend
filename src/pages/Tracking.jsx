import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Navigation, Clock, AlertCircle } from "lucide-react";
import {
  ProviderLocationMap,
  StatusTracker,
  StatusDot,
} from "../components/ui";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { bookingsAPI } from "../services/api";
import { useSocket } from "../contexts/SocketContext";

const Tracking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    if (socket && booking) {
      socket.on("provider-location-updated", handleLocationUpdate);
      return () => {
        socket.off("provider-location-updated");
      };
    }
  }, [socket, booking]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      // Use a public endpoint or include booking number in params
      const response = await bookingsAPI.getBookingDetails(bookingId);
      if (response.success && response.booking) {
        setBooking(response.booking);
        setError("");
      } else {
        setError("Booking not found");
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError("Failed to load tracking information");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = (data) => {
    if (data.bookingId === bookingId) {
      setBooking((prev) => ({
        ...prev,
        providerLocation: data.location,
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card padding="lg" className="max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Booking Not Found"}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The tracking link you followed is invalid or expired."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline"
          >
            Go to Home
          </button>
        </Card>
      </div>
    );
  }

  const canTrack =
    booking.status === "provider-on-way" ||
    booking.status === "provider-started" ||
    booking.status === "work-started" ||
    booking.status === "in-progress";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Track Your Service
          </h1>
          <p className="text-gray-600">Booking #{booking.bookingNumber}</p>
        </div>

        {/* Status Section */}
        <Card padding="lg" className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {booking.serviceTitle || "Healthcare Service"}
                </h3>
                <p className="text-sm text-gray-600">
                  Provider: {booking.provider?.name || "Service Provider"}
                </p>
              </div>
              <StatusDot
                status={booking.status}
                bookingNumber={booking.bookingNumber}
                size="lg"
              />
            </div>

            {/* Status Tracker */}
            <div className="pt-4 border-t border-gray-200">
              <StatusTracker
                status={
                  booking.status === "provider-on-way"
                    ? "on_the_way"
                    : booking.status === "in-progress" ||
                      booking.status === "work-started"
                    ? "on_the_way"
                    : booking.status === "completed"
                    ? "completed"
                    : "pending"
                }
                stages={[
                  { key: "pending", label: "Pending" },
                  { key: "on_the_way", label: "En Route" },
                  { key: "completed", label: "Completed" },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Location Map */}
        {canTrack && booking.providerLocation?.isTracking ? (
          <Card padding="lg" className="mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-gray-900">
                  Live Location Tracking
                </h3>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-600">Active</span>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden border border-gray-200">
                <ProviderLocationMap
                  providerLocation={booking.providerLocation}
                  customerAddress={booking.address}
                  status={booking.status}
                  bookingId={booking._id}
                  providerName={booking.provider?.name || "Service Provider"}
                  height="500px"
                />
              </div>

              {booking.providerLocation?.lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    Last updated:{" "}
                    {new Date(
                      booking.providerLocation.lastUpdated
                    ).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card padding="lg" className="mb-6">
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Location Tracking Not Available
              </h3>
              <p className="text-sm text-gray-600">
                {!canTrack
                  ? "Location tracking will be available once the provider is en route."
                  : "The provider has not enabled location tracking for this booking."}
              </p>
            </div>
          </Card>
        )}

        {/* Booking Details */}
        <Card padding="lg">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium text-gray-900">
                {new Date(booking.scheduledDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Time</p>
              <p className="font-medium text-gray-900">
                {booking.scheduledTime}
              </p>
            </div>
            {booking.address && (
              <div className="md:col-span-2">
                <p className="text-gray-600">Address</p>
                <p className="font-medium text-gray-900">
                  {booking.address.street}, {booking.address.city},{" "}
                  {booking.address.state} {booking.address.pincode}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Tracking;
