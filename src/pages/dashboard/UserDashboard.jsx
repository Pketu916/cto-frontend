import React, { useState, useEffect } from "react";
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

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const { socket } = useSocket();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
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

    // Listen for booking status updates
    if (socket) {
      socket.on("booking-status-updated", handleBookingStatusUpdate);
      return () => {
        socket.off("booking-status-updated");
      };
    }
  }, [socket]);

  const handleBookingStatusUpdate = (data) => {
    console.log("Booking status updated:", data);
    showSuccess(
      `Booking ${data.bookingNumber} status updated to ${data.status}`
    );
    fetchBookings(); // Refresh the list
  };

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully");
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      await api.post("/bookings", bookingData);
      showSuccess("Service booked successfully!");
      setShowBookingModal(false);
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error("Error booking service:", error);
      showError("Failed to book service");
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

  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetailsModal(true);
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

  const getStatusMessage = (status) => {
    switch (status) {
      case "pending":
        return "Your booking is being reviewed by our team";
      case "confirmed":
        return "Your booking has been confirmed. Provider will contact you soon";
      case "in-progress":
        return "Service provider is on the way or providing service";
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
                <Button onClick={fetchBookings} variant="outline" size="sm">
                  Refresh
                </Button>
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
                    <p className="text-gray-600">
                      Your service bookings will appear here.
                    </p>
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
                        className="hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {booking.serviceTitle ||
                                  booking.service?.title ||
                                  "Healthcare Service"}
                              </h3>
                              <Badge color={getStatusColor(booking.status)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {booking.status.replace("-", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              Booking #: {booking.bookingNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              {getStatusMessage(booking.status)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => viewBookingDetails(booking)}
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Service Information */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900 flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              Service Details
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(
                                  booking.scheduledDate
                                ).toLocaleDateString()}
                              </p>
                              <p className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {booking.scheduledTime}
                              </p>
                              <p className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {booking.address?.street},{" "}
                                {booking.address?.city}
                              </p>
                              <p className="font-medium text-green-600">
                                ₹{booking.totalAmount}
                              </p>
                            </div>
                          </div>

                          {/* Patient Information */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900 flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Patient Details
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Name:</span>{" "}
                                {booking.patientInfo?.name}
                              </p>
                              <p>
                                <span className="font-medium">Age:</span>{" "}
                                {booking.patientInfo?.age}
                              </p>
                              <p>
                                <span className="font-medium">Phone:</span>{" "}
                                {booking.patientInfo?.phone}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Symptoms and Notes */}
                        {(booking.symptoms || booking.notes) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Additional Information
                            </h4>
                            {booking.symptoms && (
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Symptoms:</span>{" "}
                                {booking.symptoms}
                              </p>
                            )}
                            {booking.notes && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Notes:</span>{" "}
                                {booking.notes}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Provider Notes */}
                        {booking.providerNotes && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Provider Notes
                            </h4>
                            <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                              {booking.providerNotes}
                            </p>
                          </div>
                        )}
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
            onSubmit={handleBookingSubmit}
            onCancel={handleCloseBookingModal}
          />
        </Modal>

        {/* Booking Details Modal */}
        <Modal
          isOpen={showBookingDetailsModal}
          onClose={() => setShowBookingDetailsModal(false)}
          title="Booking Details"
          size="lg"
        >
          {selectedBooking && (
            <div className="space-y-6">
              {/* Booking Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedBooking.serviceTitle ||
                      selectedBooking.service?.title ||
                      "Healthcare Service"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Booking #: {selectedBooking.bookingNumber}
                  </p>
                </div>
                <Badge color={getStatusColor(selectedBooking.status)}>
                  {(() => {
                    const StatusIcon = getStatusIcon(selectedBooking.status);
                    return <StatusIcon className="h-3 w-3 mr-1" />;
                  })()}
                  {selectedBooking.status.replace("-", " ")}
                </Badge>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Service Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(
                        selectedBooking.scheduledDate
                      ).toLocaleDateString()}
                    </p>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedBooking.scheduledTime}
                    </p>
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedBooking.address?.street},{" "}
                      {selectedBooking.address?.city},{" "}
                      {selectedBooking.address?.state} -{" "}
                      {selectedBooking.address?.pincode}
                    </p>
                    <p className="font-medium text-green-600 text-lg">
                      Total Amount: ₹{selectedBooking.totalAmount}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Patient Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedBooking.patientInfo?.name}
                    </p>
                    <p>
                      <span className="font-medium">Age:</span>{" "}
                      {selectedBooking.patientInfo?.age}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedBooking.patientInfo?.phone}
                    </p>
                    <p>
                      <span className="font-medium">Emergency Contact:</span>{" "}
                      {selectedBooking.patientInfo?.emergencyContact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(selectedBooking.symptoms || selectedBooking.notes) && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Additional Information
                  </h4>
                  {selectedBooking.symptoms && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Symptoms:
                      </p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {selectedBooking.symptoms}
                      </p>
                    </div>
                  )}
                  {selectedBooking.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Notes:
                      </p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {selectedBooking.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Provider Notes */}
              {selectedBooking.providerNotes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Provider Notes
                  </h4>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    {selectedBooking.providerNotes}
                  </p>
                </div>
              )}

              {/* Status Message */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Current Status
                </h4>
                <p className="text-sm text-gray-600">
                  {getStatusMessage(selectedBooking.status)}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default UserDashboard;
