import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import {
  Calendar,
  Clock,
  Package,
  CheckCircle,
  RefreshCw,
  MapPin,
  Phone,
  User,
  MessageSquare,
  XCircle,
  AlertCircle,
  Eye,
  Navigation,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { ServiceBookingForm } from "../../components/forms";
import { useSocket } from "../../contexts/SocketContext";
import { bookingsAPI } from "../../services/api";
import api from "../../services/api";
import Badge from "../../components/ui/Badge";
import {
  ProviderLocationMap,
  StatusTracker,
  StatusDot,
} from "../../components/ui";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const { socket } = useSocket();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
  });
  const [bookings, setBookings] = useState([]);

  // Fetch user statistics
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      showError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user bookings
  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const response = await bookingsAPI.getUserBookings();
      if (response.success) {
        setBookings(response.bookings || []);
      } else {
        showError("Failed to fetch bookings");
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showError("Failed to fetch bookings");
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBookings();
  }, []);

  useEffect(() => {
    // Listen for booking status updates
    if (!socket) return;

    socket.on("booking-status-updated", handleBookingStatusUpdate);
    socket.on("provider-location-updated", handleProviderLocationUpdate);

    return () => {
      socket.off("booking-status-updated", handleBookingStatusUpdate);
      socket.off("provider-location-updated", handleProviderLocationUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleBookingStatusUpdate = (data) => {
    console.log("Booking status updated:", data);

    // Update the booking in the list immediately
    setBookings((prevBookings) =>
      prevBookings.map((booking) => {
        if (
          booking._id === data.bookingId ||
          booking.bookingNumber === data.bookingNumber
        ) {
          // Determine if tracking should be active
          const shouldTrack =
            data.status === "provider-on-way" ||
            data.status === "work-started" ||
            data.status === "provider-started" ||
            data.status === "in-progress";

          const isTracking = shouldTrack
            ? booking.providerLocation?.isTracking ?? false
            : false;

          return {
            ...booking,
            status: data.status,
            providerNotes: data.providerNotes || booking.providerNotes,
            providerLocation: {
              ...booking.providerLocation,
              isTracking: isTracking,
            },
          };
        }
        return booking;
      })
    );

    // Show success notification with status details
    const statusMessages = {
      pending: "Booking is being reviewed",
      confirmed: "Booking confirmed! Provider will contact you soon",
      "provider-started": "Provider has started the service",
      "provider-on-way": "Provider is on the way! You can track their location",
      "work-started": "Service work has started",
      "in-progress": "Service is in progress",
      completed: "Service completed successfully!",
      cancelled: "Booking has been cancelled",
    };

    const message =
      statusMessages[data.status] || `Status updated to ${data.status}`;
    showSuccess(`Booking ${data.bookingNumber}: ${message}`);

    // Refresh stats and bookings to get latest data
    setTimeout(() => {
      fetchStats();
      fetchBookings();
    }, 500);
  };

  const handleProviderLocationUpdate = (data) => {
    console.log("Provider location updated:", data);

    // Update the booking in the list with new location
    setBookings((prevBookings) =>
      prevBookings.map((booking) => {
        if (
          booking._id === data.bookingId ||
          booking.bookingNumber === data.bookingNumber
        ) {
          return {
            ...booking,
            providerLocation: {
              ...booking.providerLocation,
              ...data.location,
              isTracking: true,
            },
          };
        }
        return booking;
      })
    );
  };

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully");
  };

  const handleBookingSubmit = (bookingResponse) => {
    // ServiceBookingForm handles the booking internally and calls this callback with the response
    if (bookingResponse.success) {
      showSuccess(bookingResponse.message || "Service booked successfully!");
      setShowBookingModal(false);
      setSelectedService(null);
      fetchBookings(); // Refresh bookings list
      fetchStats(); // Refresh stats
    } else {
      showError(bookingResponse.message || "Failed to book service");
    }
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setSelectedService(null);
  };

  const openBookingModal = (service) => {
    // If no service is provided, create a default service for general booking
    const serviceToUse = service || {
      _id: "general-booking",
      title: "General Health Service",
      estimatedPriceRange: "Contact for pricing",
      description: "Book a general health service consultation",
    };
    setSelectedService(serviceToUse);
    setShowBookingModal(true);
  };

  const handleBookingClick = (bookingId) => {
    navigate(`/user/bookings/${bookingId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "confirmed":
        return "blue";
      case "in-progress":
        return "purple";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return AlertCircle;
      case "confirmed":
        return CheckCircle;
      case "in-progress":
        return Clock;
      case "completed":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getStatusMessage = (status, booking) => {
    switch (status) {
      case "pending":
        return "Your booking is being reviewed by our team";
      case "confirmed":
        return booking.providerLocation?.isTracking
          ? "Provider is on the way! Track their location below"
          : "Your booking has been confirmed. Provider will contact you soon";
      case "provider-started":
        return booking.providerLocation?.isTracking
          ? "Provider has started and location tracking is active"
          : "Provider has started the service";
      case "provider-on-way":
        return booking.providerLocation?.isTracking
          ? "Provider is en route! Track their real-time location below"
          : "Provider is on the way to your location";
      case "work-started":
        return booking.providerLocation?.isTracking
          ? "Service work has started and location tracking is active"
          : "Service work has started";
      case "in-progress":
        return booking.providerLocation?.isTracking
          ? "Service is in progress. Location tracking active"
          : "Service provider is currently providing service";
      case "completed":
        return "Service has been completed successfully";
      case "cancelled":
        return "This booking has been cancelled";
      default:
        return "Status unknown";
    }
  };

  if (loading && stats.totalBookings === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your health services and bookings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={fetchStats}
                disabled={loading}
                className="flex items-center"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card padding="lg">
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card padding="md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Bookings
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        stats.totalBookings
                      )}
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        stats.completedBookings
                      )}
                    </p>
                  </div>
                </div>
              </Card>
              <Card padding="md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        stats.pendingBookings
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* My Orders */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">My Orders</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => openBookingModal()}
                    variant="primary"
                    size="sm"
                  >
                    Book New Service
                  </Button>
                  <Button onClick={fetchBookings} variant="outline" size="sm">
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Bookings List */}
              <div className="grid gap-4">
                {bookingsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : !bookings || bookings.length === 0 ? (
                  <Card padding="lg" className="text-center shadow-none">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Bookings Yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Your service bookings will appear here.
                    </p>
                    <Button
                      onClick={() => openBookingModal()}
                      variant="primary"
                    >
                      Book Your First Service
                    </Button>
                  </Card>
                ) : (
                  bookings &&
                  bookings.length > 0 &&
                  bookings.map((booking) => {
                    const StatusIcon = getStatusIcon(booking.status);

                    return (
                      <Card
                        key={booking._id}
                        padding="lg"
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleBookingClick(booking._id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {/* Status Dot */}
                              <StatusDot
                                status={booking.status}
                                bookingNumber={booking.bookingNumber}
                                size="lg"
                              />
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {booking.serviceTitle ||
                                    booking.service?.title ||
                                    "Healthcare Service"}
                                </h3>
                              </div>
                              <Badge color={getStatusColor(booking.status)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {booking.status.replace("-", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1 ml-9">
                              Booking #: {booking.bookingNumber}
                            </p>
                            <p className="text-sm text-gray-500 ml-9">
                              {getStatusMessage(booking.status, booking)}
                            </p>
                            {/* Basic Info - Always Visible */}
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2 ml-9">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(
                                  booking.scheduledDate
                                ).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.scheduledTime}
                              </span>
                              <span className="font-medium text-green-600">
                                ₹{booking.totalAmount}
                              </span>
                            </div>
                            {/* Location Tracking Information */}
                            {booking.providerLocation?.isTracking &&
                              (booking.status === "provider-on-way" ||
                                booking.status === "provider-started" ||
                                booking.status === "work-started" ||
                                booking.status === "in-progress" ||
                                booking.status === "confirmed") && (
                                <div className="mt-3 ml-9 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="flex items-center gap-2 text-sm text-blue-700 mb-1">
                                    <Navigation className="h-4 w-4 animate-pulse" />
                                    <span className="font-semibold">
                                      Location Tracking Active
                                    </span>
                                  </div>
                                  {booking.providerLocation?.lastUpdated && (
                                    <p className="text-xs text-blue-600 ml-6">
                                      Last updated:{" "}
                                      {new Date(
                                        booking.providerLocation.lastUpdated
                                      ).toLocaleTimeString()}{" "}
                                      (
                                      {Math.round(
                                        (new Date() -
                                          new Date(
                                            booking.providerLocation.lastUpdated
                                          )) /
                                          1000 /
                                          60
                                      )}{" "}
                                      min ago)
                                    </p>
                                  )}
                                  {booking.providerLocation?.latitude &&
                                    booking.providerLocation?.longitude && (
                                      <a
                                        href={`https://www.google.com/maps?q=${booking.providerLocation.latitude},${booking.providerLocation.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-6 text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1 mt-1"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MapPin className="h-3 w-3" />
                                        View on Map
                                      </a>
                                    )}
                                </div>
                              )}
                          </div>
                          <Eye className="h-5 w-5 text-gray-400 mt-2" />
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Booking Modal */}
        <Modal
          isOpen={showBookingModal}
          onClose={handleCloseBookingModal}
          title="Book Service"
        >
          <ServiceBookingForm
            service={selectedService}
            onBookingSuccess={handleBookingSubmit}
            onCancel={handleCloseBookingModal}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UserDashboard;
