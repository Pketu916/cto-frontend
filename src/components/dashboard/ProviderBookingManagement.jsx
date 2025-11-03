import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Download,
  FileText,
  Navigation,
} from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import ESignatureModal from "../ui/ESignatureModal";
import ProviderStatusUpdateCard from "./ProviderStatusUpdateCard";
import LocationTrackingManager from "./LocationTrackingManager";

const ProviderBookingManagement = () => {
  const navigate = useNavigate();
  const { user, userType, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const { socket } = useSocket();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    providerNotes: "",
  });
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [bookingLogs, setBookingLogs] = useState([]);
  const [showESignModal, setShowESignModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    // Listen for new bookings and status updates
    if (!socket) return;

    socket.on("new-booking", handleNewBooking);
    socket.on("booking-status-updated", handleBookingStatusUpdate);
    socket.on("provider-location-updated", handleProviderLocationUpdate);

    return () => {
      socket.off("new-booking", handleNewBooking);
      socket.off("booking-status-updated", handleBookingStatusUpdate);
      socket.off("provider-location-updated", handleProviderLocationUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Add new booking to the list immediately
    setBookings((prevBookings) => {
      // Check if booking already exists
      const exists = prevBookings.some(
        (b) =>
          b._id === bookingData.bookingId ||
          b.bookingNumber === bookingData.bookingNumber
      );
      if (!exists) {
        // Add new booking to the beginning
        return [bookingData, ...prevBookings];
      }
      return prevBookings;
    });

    // Refresh after a short delay to get full booking data
    setTimeout(() => {
      fetchBookings();
    }, 500);
  };

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

    // Update filtered bookings as well
    setFilteredBookings((prevFiltered) =>
      prevFiltered.map((booking) => {
        if (
          booking._id === data.bookingId ||
          booking.bookingNumber === data.bookingNumber
        ) {
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

    // Show success notification
    const statusMessages = {
      pending: "Booking is pending review",
      confirmed: "Booking confirmed",
      "provider-started": "Provider started service",
      "provider-on-way": "Provider is on the way - Location tracking enabled",
      "work-started": "Work started - Location tracking active",
      "in-progress": "Service in progress - Location tracking active",
      completed: "Service completed successfully",
      cancelled: "Booking cancelled",
    };

    const message =
      statusMessages[data.status] || `Status updated to ${data.status}`;
    showSuccess(`Booking ${data.bookingNumber}: ${message}`);

    // Refresh to get latest data
    setTimeout(() => {
      fetchBookings();
    }, 500);
  };

  const handleProviderLocationUpdate = (data) => {
    console.log("Provider location updated:", data);

    // Update the booking in both lists with new location
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

    setFilteredBookings((prevFiltered) =>
      prevFiltered.map((booking) => {
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

    // Update selected booking if it matches
    if (
      selectedBooking &&
      (selectedBooking._id === data.bookingId ||
        selectedBooking.bookingNumber === data.bookingNumber)
    ) {
      setSelectedBooking((prev) => ({
        ...prev,
        providerLocation: {
          ...prev.providerLocation,
          ...data.location,
          isTracking: true,
        },
      }));
    }
  };

  const downloadInvoice = async (bookingId, includeSignature = false) => {
    try {
      const blob = await bookingsAPI.getInvoice(bookingId, includeSignature);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${bookingId}${
        includeSignature ? "_signed" : ""
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess("Invoice download started");
    } catch (error) {
      console.error("Invoice download error:", error);
      showError("Failed to download invoice");
    }
  };

  // Booking claimed handler removed - no more assignment restrictions

  const updateBookingStatus = async (bookingId, status, providerNotes) => {
    try {
      // If completing, require e-signature first
      if (status === "completed") {
        setSelectedBooking(
          bookings.find((b) => b._id === bookingId) || selectedBooking
        );
        setShowESignModal(true);
        return;
      }

      const response = await bookingsAPI.updateBookingStatus(
        bookingId,
        status,
        providerNotes,
        user._id,
        user.name
      );

      if (response.success) {
        showSuccess(`Booking status updated to ${status}`);
        setExpandedStatusUpdate(null); // Collapse the status update section
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

  const handleLocationTrackingStart = async (bookingId, location) => {
    try {
      await bookingsAPI.updateProviderLocation(
        bookingId,
        location.latitude,
        location.longitude
      );
      showSuccess("Location tracking started");
      fetchBookings();
    } catch (error) {
      console.error("Error starting location tracking:", error);
      showError("Failed to start location tracking");
    }
  };

  const handleLocationTrackingUpdate = (updatedLocation) => {
    setBookings((prevBookings) =>
      prevBookings.map((b) =>
        b._id === selectedBooking._id
          ? {
              ...b,
              providerLocation: updatedLocation,
            }
          : b
      )
    );
    if (selectedBooking) {
      setSelectedBooking((prev) => ({
        ...prev,
        providerLocation: updatedLocation,
      }));
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

  // Check if provider profile is approved (wait until auth profile is loaded)
  const isProfileApproved = user?.verificationStatus === "approved";

  // While auth is loading, show spinner not pending gate
  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show profile status message only when explicitly pending/rejected/suspended
  if (user?.verificationStatus && !isProfileApproved) {
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
              onClick={() => handleFilterChange("provider-on-way")}
              variant={
                selectedFilter === "provider-on-way" ? "primary" : "outline"
              }
              size="sm"
            >
              En Route (
              {bookings.filter((b) => b.status === "provider-on-way").length})
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
                className="hover:shadow-md transition-all relative group cursor-pointer"
                onClick={() => navigate(`/provider/bookings/${booking._id}`)}
              >
                {/* Shortcut Icon Buttons - Top Right */}
                <div
                  className="absolute top-4 right-4 flex gap-2 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      navigate(`/provider/bookings/${booking._id}`);
                    }}
                    className="p-2 rounded-lg bg-white/90 hover:bg-white border border-gray-200 shadow-sm transition-all hover:scale-110"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchBookingLogs(booking._id);
                    }}
                    className="p-2 rounded-lg bg-white/90 hover:bg-white border border-gray-200 shadow-sm transition-all hover:scale-110"
                    title="View Status History"
                  >
                    <History className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadInvoice(booking._id, false);
                    }}
                    className="p-2 rounded-lg bg-white/90 hover:bg-white border border-gray-200 shadow-sm transition-all hover:scale-110"
                    title="Download Invoice"
                  >
                    <Download className="h-4 w-4 text-gray-700" />
                  </button>
                  {booking.status === "completed" &&
                    booking.eSignature?.signature && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadInvoice(booking._id, true);
                        }}
                        className="p-2 rounded-lg bg-white/90 hover:bg-white border border-gray-200 shadow-sm transition-all hover:scale-110"
                        title="Download E-Signed Invoice"
                      >
                        <FileText className="h-4 w-4 text-gray-700" />
                      </button>
                    )}
                </div>

                <div className="flex flex-col gap-3 mb-4 pr-20">
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
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(booking.scheduledDate).toLocaleDateString()}
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
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
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
                </div>
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
                  Customer Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedBooking.customerInfo?.name ||
                      selectedBooking.patientInfo?.name}
                  </p>
                  <p>
                    <span className="font-medium">Age:</span>{" "}
                    {selectedBooking.customerInfo?.age ||
                      selectedBooking.patientInfo?.age}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedBooking.customerInfo?.phone ||
                      selectedBooking.patientInfo?.phone}
                  </p>
                  <p>
                    <span className="font-medium">Emergency Contact:</span>{" "}
                    {selectedBooking.customerInfo?.emergencyContact ||
                      selectedBooking.patientInfo?.emergencyContact}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(selectedBooking.serviceRequirements ||
              selectedBooking.symptoms ||
              selectedBooking.notes) && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Additional Information
                </h4>
                {(selectedBooking.serviceRequirements ||
                  selectedBooking.symptoms) && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Service Requirements:
                    </p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {selectedBooking.serviceRequirements ||
                        selectedBooking.symptoms}
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

      {/* E-Signature Modal */}
      {selectedBooking && (
        <ESignatureModal
          isOpen={showESignModal}
          onClose={() => setShowESignModal(false)}
          bookingId={selectedBooking._id}
          onSigned={() => {
            setShowStatusModal(false);
            setShowESignModal(false);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
};

export default ProviderBookingManagement;
