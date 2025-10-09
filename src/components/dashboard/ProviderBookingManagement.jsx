import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useSocket } from "../../contexts/SocketContext";
import { bookingsAPI } from "../../services/api";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Eye,
  History,
  Shield,
  AlertTriangle,
} from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";

const ProviderBookingManagement = () => {
  const { user, userType } = useAuth();
  const { showSuccess, showError } = useToast();
  const { socket } = useSocket();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    providerNotes: "",
  });
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [bookingLogs, setBookingLogs] = useState([]);

  useEffect(() => {
    fetchBookings();

    // Listen for new bookings
    if (socket) {
      socket.on("new-booking", handleNewBooking);
      socket.on("booking-status-updated", handleBookingStatusUpdate);
      // Removed booking-claimed listener - no more assignment restrictions

      return () => {
        socket.off("new-booking");
        socket.off("booking-status-updated");
        // Removed booking-claimed cleanup
      };
    }
  }, [socket]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getProviderBookings();
      if (response.success) {
        setBookings(response.bookings || []);
        applyFilter(response.bookings || [], selectedFilter);
      } else {
        showError("Failed to fetch bookings");
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showError("Failed to fetch bookings");
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (bookingsList, filter) => {
    if (filter === "all") {
      // "All" filter shows only active bookings (not completed/cancelled)
      const activeBookings = bookingsList.filter(
        (booking) => !["completed", "cancelled"].includes(booking.status)
      );
      setFilteredBookings(activeBookings);
    } else {
      const filtered = bookingsList.filter(
        (booking) => booking.status === filter
      );
      setFilteredBookings(filtered);
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    applyFilter(bookings, filter);
  };

  const handleShowAllBookings = () => {
    setShowAllBookings(!showAllBookings);
    if (!showAllBookings) {
      // Show all bookings including completed/cancelled
      setFilteredBookings(bookings);
    } else {
      // Apply current filter
      applyFilter(bookings, selectedFilter);
    }
  };

  const fetchBookingLogs = async (bookingId) => {
    try {
      const response = await bookingsAPI.getBookingLogs(bookingId);
      if (response.success) {
        setBookingLogs(response.logs || []);
        setShowLogsModal(true);
      } else {
        showError("Failed to fetch booking logs");
      }
    } catch (error) {
      console.error("Error fetching booking logs:", error);
      showError("Failed to fetch booking logs");
    }
  };

  const handleNewBooking = (bookingData) => {
    console.log("New booking received:", bookingData);
    showSuccess(`New booking received: ${bookingData.bookingNumber}`);
    fetchBookings(); // Refresh the list
  };

  const handleBookingStatusUpdate = (data) => {
    console.log("Booking status updated:", data);
    fetchBookings(); // Refresh the list
  };

  // Booking claimed handler removed - no more assignment restrictions

  const handleStatusUpdate = (booking) => {
    // All providers can update any booking (removed assignment restrictions)
    console.log("🔧 Status update check:", {
      bookingId: booking._id,
      bookingProvider: booking.provider?._id,
      currentUser: user._id,
      userType,
      canUpdate: true, // All providers can update
    });

    setSelectedBooking(booking);
    setStatusUpdate({
      status: booking.status,
      providerNotes: booking.providerNotes || "",
    });
    setShowStatusModal(true);
  };

  const updateBookingStatus = async () => {
    try {
      console.log("🔧 Updating booking status:", {
        bookingId: selectedBooking._id,
        status: statusUpdate.status,
        providerNotes: statusUpdate.providerNotes,
        providerId: user._id,
        providerName: user.name,
        userType,
      });

      const response = await bookingsAPI.updateBookingStatus(
        selectedBooking._id,
        statusUpdate.status,
        statusUpdate.providerNotes,
        user._id, // Provider ID for logging
        user.name // Provider name for logging
      );

      if (response.success) {
        showSuccess(
          `Booking status updated to ${statusUpdate.status} by ${user.name}`
        );
        setShowStatusModal(false);
        fetchBookings();
      } else {
        showError(response.message || "Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Failed to update booking status");
      }
    }
  };

  // Claim booking functionality removed - all providers can manage all bookings

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if provider profile is approved
  const isProfileApproved = user?.verificationStatus === "approved";

  // Show profile status message if not approved
  if (!isProfileApproved) {
    const getStatusMessage = (status) => {
      switch (status) {
        case "pending":
          return "Your profile is under review. You'll be able to manage bookings once approved by admin.";
        case "rejected":
          return "Your profile has been rejected. Please update your information and resubmit for review.";
        case "suspended":
          return "Your account has been suspended. Please contact support for assistance.";
        default:
          return "Your profile status is being verified.";
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "pending":
          return "bg-yellow-50 border-yellow-200 text-yellow-800";
        case "rejected":
          return "bg-red-50 border-red-200 text-red-800";
        case "suspended":
          return "bg-red-50 border-red-200 text-red-800";
        default:
          return "bg-gray-50 border-gray-200 text-gray-800";
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case "pending":
          return AlertTriangle;
        case "rejected":
          return XCircle;
        case "suspended":
          return Shield;
        default:
          return AlertCircle;
      }
    };

    const StatusIcon = getStatusIcon(user?.verificationStatus || "pending");

    return (
      <div className="space-y-6">
        {/* Profile Status Alert */}
        <div
          className={`rounded-lg border p-6 ${getStatusColor(
            user?.verificationStatus || "pending"
          )}`}
        >
          <div className="flex items-start">
            <StatusIcon className="h-6 w-6 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">
                Profile Status:{" "}
                {user?.verificationStatus?.toUpperCase() || "PENDING"}
              </h3>
              <p className="text-sm mb-3">
                {getStatusMessage(user?.verificationStatus || "pending")}
              </p>
              {user?.verificationNotes && (
                <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border">
                  <p className="text-sm font-medium">Admin Notes:</p>
                  <p className="text-sm mt-1">{user.verificationNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Disabled booking management section */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Booking Management Unavailable
          </h3>
          <p className="text-gray-600">
            Complete your profile verification to start managing bookings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Booking Management
          </h2>
          <p className="text-gray-600">
            Manage and update booking statuses |{" "}
            {userType === "admin" ? "Admin" : "Provider"}: {user?.name} (ID:{" "}
            {user?._id})
          </p>
        </div>
        <Button onClick={fetchBookings} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Filter by Status:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleFilterChange("all")}
              variant={selectedFilter === "all" ? "primary" : "outline"}
              size="sm"
            >
              All (
              {
                bookings.filter(
                  (b) => !["completed", "cancelled"].includes(b.status)
                ).length
              }
              )
            </Button>
            <Button
              onClick={() => handleFilterChange("pending")}
              variant={selectedFilter === "pending" ? "primary" : "outline"}
              size="sm"
            >
              Pending ({bookings.filter((b) => b.status === "pending").length})
            </Button>
            <Button
              onClick={() => handleFilterChange("confirmed")}
              variant={selectedFilter === "confirmed" ? "primary" : "outline"}
              size="sm"
            >
              Confirmed (
              {bookings.filter((b) => b.status === "confirmed").length})
            </Button>
            <Button
              onClick={() => handleFilterChange("in-progress")}
              variant={selectedFilter === "in-progress" ? "primary" : "outline"}
              size="sm"
            >
              In Progress (
              {bookings.filter((b) => b.status === "in-progress").length})
            </Button>
            <Button
              onClick={() => handleFilterChange("completed")}
              variant={selectedFilter === "completed" ? "primary" : "outline"}
              size="sm"
            >
              Completed (
              {bookings.filter((b) => b.status === "completed").length})
            </Button>
            <Button
              onClick={() => handleFilterChange("cancelled")}
              variant={selectedFilter === "cancelled" ? "primary" : "outline"}
              size="sm"
            >
              Cancelled (
              {bookings.filter((b) => b.status === "cancelled").length})
            </Button>

            {/* Show All Bookings Button */}
            <Button
              onClick={handleShowAllBookings}
              variant={showAllBookings ? "primary" : "outline"}
              size="sm"
              className="ml-2"
            >
              {showAllBookings ? "Hide Completed" : "Show All"} (
              {bookings.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {!filteredBookings || filteredBookings.length === 0 ? (
          <Card padding="lg" className="text-center shadow-none">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedFilter === "all"
                ? "No Bookings Yet"
                : `No ${selectedFilter} Bookings`}
            </h3>
            <p className="text-gray-600">
              {selectedFilter === "all"
                ? "New bookings will appear here when customers book your services."
                : `No bookings with ${selectedFilter} status found.`}
            </p>
          </Card>
        ) : (
          filteredBookings &&
          filteredBookings.length > 0 &&
          filteredBookings.map((booking) => {
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
                        {booking.service?.title}
                      </h3>
                      <Badge color={getStatusColor(booking.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {booking.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Booking #: {booking.bookingNumber}
                    </p>
                    <div className="text-sm text-gray-600">
                      <p>All providers can manage this booking</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetailsModal(true);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>

                    <Button
                      onClick={() => fetchBookingLogs(booking._id)}
                      variant="outline"
                      size="sm"
                    >
                      <History className="h-4 w-4 mr-1" />
                      View Logs
                    </Button>

                    <Button
                      onClick={() => handleStatusUpdate(booking)}
                      variant="primary"
                      size="sm"
                    >
                      {userType === "admin" ? "Admin Update" : "Update Status"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <p>
                        <span className="font-medium">Emergency:</span>{" "}
                        {booking.patientInfo?.emergencyContact}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Booking Details
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </p>
                      <p className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {booking.scheduledTime}
                      </p>
                      <p className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {booking.address?.street}, {booking.address?.city}
                      </p>
                      <p className="font-medium text-green-600">
                        ₹{booking.totalAmount}
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

      {/* Booking Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
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

            {/* Provider Assignment Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Provider Assignment
              </h4>
              {selectedBooking.provider ? (
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Assigned to:</span>{" "}
                    {selectedBooking.provider.name} (ID:{" "}
                    {selectedBooking.provider._id})
                  </p>
                  {selectedBooking.provider._id === user._id ? (
                    <p className="text-green-600 font-medium">
                      ✓ You are assigned to this booking
                    </p>
                  ) : (
                    <p className="text-red-600 font-medium">
                      ⚠ Assigned to another provider
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-yellow-600 font-medium">
                  ⚠ Not assigned to any provider
                </p>
              )}
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
          </div>
        )}
      </Modal>

      {/* Booking Logs Modal */}
      <Modal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        title="Booking Status History"
        size="lg"
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Showing status change history for booking #
            {selectedBooking?.bookingNumber}
          </div>

          {bookingLogs.length > 0 ? (
            <div className="space-y-3">
              {bookingLogs.map((log, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        Status changed to:{" "}
                        <Badge color={getStatusColor(log.newStatus)}>
                          {log.newStatus.replace("-", " ")}
                        </Badge>
                      </p>
                      {log.oldStatus && (
                        <p className="text-sm text-gray-600">
                          From:{" "}
                          <Badge color={getStatusColor(log.oldStatus)}>
                            {log.oldStatus.replace("-", " ")}
                          </Badge>
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-2 text-sm">
                    <p>
                      <span className="font-medium">Changed by:</span>{" "}
                      {log.changedBy?.name || "System"} (ID:{" "}
                      {log.changedBy?.id || "N/A"})
                    </p>
                    <p>
                      <span className="font-medium">User Type:</span>{" "}
                      {log.userType || "Unknown"}
                    </p>
                    {log.notes && (
                      <p>
                        <span className="font-medium">Notes:</span> {log.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No status change history available for this booking.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Booking Status"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Booking #{selectedBooking.bookingNumber}
              </h3>
              <p className="text-sm text-gray-600">
                Service:{" "}
                {selectedBooking.serviceTitle ||
                  selectedBooking.service?.title ||
                  "Healthcare Service"}
              </p>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-700 font-medium">
                  📋 Booking Management
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  All providers can update this booking status
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusUpdate.status}
                onChange={(e) =>
                  setStatusUpdate({ ...statusUpdate, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider Notes
              </label>
              <textarea
                value={statusUpdate.providerNotes}
                onChange={(e) =>
                  setStatusUpdate({
                    ...statusUpdate,
                    providerNotes: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any notes for the customer..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowStatusModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={updateBookingStatus}>
                {userType === "admin" ? "Admin Update" : "Update Status"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProviderBookingManagement;
