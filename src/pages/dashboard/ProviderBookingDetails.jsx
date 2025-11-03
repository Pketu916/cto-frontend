import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useSocket } from "../../contexts/SocketContext";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  MessageSquare,
  FileText,
  Download,
  Navigation,
  History,
  AlertCircle,
  XCircle,
  CheckCircle,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ProviderStatusUpdateCard from "../../components/dashboard/ProviderStatusUpdateCard";
import LocationTrackingManager from "../../components/dashboard/LocationTrackingManager";
import {
  ProviderLocationMap,
  StatusTracker,
  StatusDot,
} from "../../components/ui";
import ESignatureModal from "../../components/ui/ESignatureModal";
import api, { bookingsAPI } from "../../services/api";
import Modal from "../../components/ui/Modal";

const ProviderBookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { socket } = useSocket();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLogs, setBookingLogs] = useState([]);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showESignModal, setShowESignModal] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    if (!socket || !bookingId) return;

    const handleLocationUpdateWrapper = (data) => {
      if (
        data.bookingId === bookingId ||
        data.bookingNumber === booking?.bookingNumber
      ) {
        setBooking((prev) => ({
          ...prev,
          providerLocation: {
            ...prev?.providerLocation,
            ...data.location,
            isTracking: true,
          },
        }));
      }
    };

    const handleStatusUpdateWrapper = (data) => {
      if (
        data.bookingId === bookingId ||
        data.bookingNumber === booking?.bookingNumber
      ) {
        // Update booking immediately
        setBooking((prev) => {
          if (!prev) return prev;

          // Determine if tracking should be active
          const shouldTrack =
            data.status === "provider-on-way" ||
            data.status === "work-started" ||
            data.status === "provider-started" ||
            data.status === "in-progress";

          const isTracking = shouldTrack
            ? prev.providerLocation?.isTracking ?? false
            : false;

          return {
            ...prev,
            status: data.status,
            providerNotes: data.providerNotes || prev.providerNotes,
            providerLocation: {
              ...prev.providerLocation,
              isTracking: isTracking,
            },
          };
        });

        // Show notification
        const statusMessages = {
          pending: "Status updated to pending",
          confirmed: "Booking confirmed",
          "provider-started": "Provider started",
          "provider-on-way": "Provider is on the way",
          "work-started": "Work started",
          "in-progress": "Service in progress",
          completed: "Service completed",
          cancelled: "Booking cancelled",
        };

        const message =
          statusMessages[data.status] || `Status updated to ${data.status}`;
        showSuccess(`Booking ${data.bookingNumber}: ${message}`);

        // Refresh booking data after a short delay
        setTimeout(() => {
          fetchBooking();
        }, 500);
      }
    };

    socket.on("provider-location-updated", handleLocationUpdateWrapper);
    socket.on("booking-status-updated", handleStatusUpdateWrapper);

    return () => {
      socket.off("provider-location-updated", handleLocationUpdateWrapper);
      socket.off("booking-status-updated", handleStatusUpdateWrapper);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, bookingId, booking?.bookingNumber]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      // Try to get booking from provider bookings list first (has full data)
      try {
        const listResponse = await api.get(`/bookings/provider`);
        if (listResponse.data.success) {
          const booking = listResponse.data.bookings.find(
            (b) => b._id === bookingId
          );
          if (booking) {
            console.log("Booking from list:", booking);
            setBooking(booking);
            return;
          }
        }
      } catch (listError) {
        console.log("Could not fetch from list, trying details endpoint");
      }

      // Fallback to getBookingDetails API
      const detailResponse = await bookingsAPI.getBookingDetails(bookingId);
      if (detailResponse.success && detailResponse.booking) {
        console.log("Booking from details:", detailResponse.booking);
        setBooking(detailResponse.booking);
      } else {
        showError("Booking not found");
        navigate("/provider/dashboard");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      showError("Failed to load booking details");
      navigate("/provider/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status, providerNotes) => {
    try {
      if (status === "completed") {
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
        fetchBooking();
      } else {
        showError(response.message || "Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      showError("Failed to update booking status");
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
      fetchBooking();
    } catch (error) {
      console.error("Error starting location tracking:", error);
      showError("Failed to start location tracking");
    }
  };

  const fetchBookingLogs = async () => {
    try {
      const response = await bookingsAPI.getBookingLogs(bookingId);
      if (response.success) {
        setBookingLogs(response.logs || []);
        setShowLogsModal(true);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      showError("Failed to fetch booking logs");
    }
  };

  const downloadInvoice = async (includeSignature = false) => {
    try {
      const blob = await bookingsAPI.getInvoice(bookingId, includeSignature);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${booking?.bookingNumber}${
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card padding="lg" className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Booking Not Found
          </h2>
          <Button onClick={() => navigate("/provider/dashboard")}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => navigate("/provider/dashboard")}
            variant="outline"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Booking Details
              </h1>
              <p className="text-gray-600">#{booking.bookingNumber}</p>
            </div>
            <StatusDot
              status={booking.status}
              bookingNumber={booking.bookingNumber}
              size="lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <Card padding="md" className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchBookingLogs}
                variant="outline"
                size="sm"
                title="View Status History"
              >
                <History className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => downloadInvoice(false)}
                variant="outline"
                size="sm"
                title="Download Invoice"
              >
                <Download className="h-4 w-4" />
              </Button>
              {booking.status === "completed" &&
                booking.eSignature?.signature && (
                  <Button
                    onClick={() => downloadInvoice(true)}
                    variant="outline"
                    size="sm"
                    title="Download E-Signed Invoice"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                )}
            </div>
            <Badge color={getStatusColor(booking.status)}>
              {booking.status.replace("-", " ")}
            </Badge>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Tracker */}
            <Card padding="lg">
              <h3 className="font-semibold text-gray-900 mb-4">
                Booking Status
              </h3>
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
            </Card>

            {/* Status Update Card - Only show if not completed */}
            {booking.status !== "completed" && (
              <Card padding="lg">
                <ProviderStatusUpdateCard
                  booking={booking}
                  onStatusUpdate={updateBookingStatus}
                  onLocationTrackingStart={handleLocationTrackingStart}
                />
              </Card>
            )}

            {/* Location Tracking */}
            {(booking.status === "provider-on-way" ||
              booking.status === "provider-started" ||
              booking.status === "work-started" ||
              booking.status === "in-progress") && (
              <Card padding="lg">
                <LocationTrackingManager
                  booking={booking}
                  onTrackingUpdate={(updatedLocation) => {
                    setBooking((prev) => ({
                      ...prev,
                      providerLocation: updatedLocation,
                    }));
                  }}
                />
              </Card>
            )}

            {/* Provider Location Map */}
            {(booking.status === "provider-on-way" ||
              booking.status === "provider-started" ||
              booking.status === "work-started" ||
              booking.status === "in-progress" ||
              booking.status === "completed") &&
              booking.providerLocation?.isTracking && (
                <Card padding="lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-gray-900">
                        Provider Location
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
                        providerName={
                          booking.provider?.name || "Service Provider"
                        }
                        height="400px"
                      />
                    </div>
                  </div>
                </Card>
              )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Service Information */}
            <Card padding="lg">
              <h3 className="font-semibold text-gray-900 mb-4">
                Service Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">
                      {booking.scheduledTime}
                    </p>
                  </div>
                </div>
                {booking.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">
                        {booking.address.street}, {booking.address.city},{" "}
                        {booking.address.state} {booking.address.pincode}
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Total Amount</p>
                  <p className="font-semibold text-lg text-green-600">
                    ₹{booking.totalAmount || booking.amount || 0}
                  </p>
                </div>
              </div>
            </Card>

            {/* Customer Information */}
            <Card padding="lg">
              <h3 className="font-semibold text-gray-900 mb-4">
                Customer Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {booking.customerInfo?.name ||
                        booking.patientInfo?.name ||
                        booking.user?.name ||
                        booking.user?.user?.name ||
                        "N/A"}
                    </p>
                  </div>
                </div>
                {(booking.customerInfo?.age || booking.patientInfo?.age) && (
                  <div>
                    <p className="text-gray-600">Age</p>
                    <p className="font-medium text-gray-900">
                      {booking.customerInfo?.age || booking.patientInfo?.age}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">
                      {booking.customerInfo?.phone ||
                        booking.patientInfo?.phone ||
                        booking.user?.phone ||
                        booking.user?.user?.phone ||
                        "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Emergency Contact</p>
                  <p className="font-medium text-gray-900">
                    {booking.customerInfo?.emergencyContact ||
                      booking.patientInfo?.emergencyContact ||
                      booking.customerInfo?.emergencyPhone ||
                      booking.patientInfo?.emergencyPhone ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Additional Information */}
            {(booking.serviceRequirements ||
              booking.symptoms ||
              booking.notes) && (
              <Card padding="lg">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Additional Information
                </h3>
                <div className="space-y-3 text-sm">
                  {(booking.serviceRequirements || booking.symptoms) && (
                    <div>
                      <p className="text-gray-600 font-medium">
                        Service Requirements
                      </p>
                      <p className="text-gray-900">
                        {booking.serviceRequirements || booking.symptoms}
                      </p>
                    </div>
                  )}
                  {booking.notes && (
                    <div>
                      <p className="text-gray-600 font-medium">Notes</p>
                      <p className="text-gray-900">{booking.notes}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Provider Notes */}
            {booking.providerNotes && (
              <Card padding="lg">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Provider Notes
                </h3>
                <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                  {booking.providerNotes}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Booking Logs Modal */}
      <Modal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        title="Booking Status History"
        size="lg"
      >
        <div className="space-y-4">
          {bookingLogs.length > 0 ? (
            <div className="space-y-3">
              {bookingLogs.map((log, index) => (
                <div
                  key={index}
                  className="border-l-4 border-primary pl-4 py-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        Status:{" "}
                        <Badge color={getStatusColor(log.newStatus)}>
                          {log.newStatus.replace("-", " ")}
                        </Badge>
                      </p>
                      {log.oldStatus && (
                        <p className="text-sm text-gray-600 mt-1">
                          From:{" "}
                          <Badge color={getStatusColor(log.oldStatus)}>
                            {log.oldStatus.replace("-", " ")}
                          </Badge>
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>
                      <span className="font-medium">Changed by:</span>{" "}
                      {log.changedBy?.name || "System"}
                    </p>
                    {log.notes && (
                      <p className="mt-1">
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
              <p className="text-gray-600">No status history available</p>
            </div>
          )}
        </div>
      </Modal>

      {/* E-Signature Modal */}
      {booking && (
        <ESignatureModal
          isOpen={showESignModal}
          onClose={() => setShowESignModal(false)}
          bookingId={booking._id}
          onSigned={() => {
            setShowESignModal(false);
            fetchBooking();
          }}
        />
      )}
    </div>
  );
};

export default ProviderBookingDetails;
