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
  AlertCircle,
  XCircle,
  CheckCircle,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  ProviderLocationMap,
  StatusTracker,
  StatusDot,
} from "../../components/ui";
import { bookingsAPI } from "../../services/api";

const UserBookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { socket } = useSocket();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    if (socket && booking && bookingId) {
      const handleLocationUpdateWrapper = (data) => {
        if (data.bookingId === bookingId) {
          setBooking((prev) => ({
            ...prev,
            providerLocation: data.location,
          }));
        }
      };

      const handleStatusUpdateWrapper = (data) => {
        if (data.bookingId === bookingId) {
          fetchBooking(); // Refresh booking data
        }
      };

      socket.on("provider-location-updated", handleLocationUpdateWrapper);
      socket.on("booking-status-updated", handleStatusUpdateWrapper);
      return () => {
        socket.off("provider-location-updated");
        socket.off("booking-status-updated");
      };
    }
  }, [socket, bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getBookingDetails(bookingId);
      if (response.success && response.booking) {
        setBooking(response.booking);
      } else {
        showError("Booking not found");
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      showError("Failed to load booking details");
      navigate("/user/dashboard");
    } finally {
      setLoading(false);
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

  const getStatusMessage = (status) => {
    switch (status) {
      case "pending":
        return "Your booking is being reviewed by our team";
      case "confirmed":
        return "Your booking has been confirmed. Provider will contact you soon";
      case "in-progress":
        return "Service provider is en route or providing service";
      case "completed":
        return "Service has been completed successfully";
      case "cancelled":
        return "This booking has been cancelled";
      default:
        return "Status unknown";
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
          <Button onClick={() => navigate("/user/dashboard")}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(booking.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => navigate("/user/dashboard")}
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
                {booking.serviceTitle ||
                  booking.service?.title ||
                  "Healthcare Service"}
              </h1>
              <p className="text-gray-600">Booking #{booking.bookingNumber}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusDot
                status={booking.status}
                bookingNumber={booking.bookingNumber}
                size="lg"
              />
              <Badge color={getStatusColor(booking.status)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {booking.status.replace("-", " ")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card padding="md" className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => downloadInvoice(false)}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              {booking.status === "completed" &&
                booking.eSignature?.signature && (
                  <Button
                    onClick={() => downloadInvoice(true)}
                    variant="outline"
                    size="sm"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download E-Signed Invoice
                  </Button>
                )}
            </div>
            <div
              className="bg-gray-50 p-4 rounded-lg border-l-4"
              style={{
                borderColor: getStatusColor(booking.status),
              }}
            >
              <p className="text-sm text-gray-700 font-medium">
                {getStatusMessage(booking.status)}
              </p>
            </div>
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

            {/* Provider Location Map - Show when provider is assigned and tracking */}
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
                        Provider Location Tracking
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
                    ₹{booking.totalAmount}
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
                        user?.name}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Age</p>
                  <p className="font-medium text-gray-900">
                    {booking.customerInfo?.age || booking.patientInfo?.age}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">
                      {booking.customerInfo?.phone ||
                        booking.patientInfo?.phone}
                    </p>
                  </div>
                </div>
                {(booking.customerInfo?.emergencyContact ||
                  booking.patientInfo?.emergencyContact) && (
                  <div>
                    <p className="text-gray-600">Emergency Contact</p>
                    <p className="font-medium text-gray-900">
                      {booking.customerInfo?.emergencyContact ||
                        booking.patientInfo?.emergencyContact}
                    </p>
                  </div>
                )}
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
    </div>
  );
};

export default UserBookingDetails;
