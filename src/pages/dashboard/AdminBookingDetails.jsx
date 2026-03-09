import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
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
  History,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Modal from "../../components/ui/Modal";
import {
  ProviderLocationMap,
  StatusTracker,
  StatusDot,
} from "../../components/ui";
import { adminAPI, bookingsAPI } from "../../services/api";
import { formatAUD } from "../../utils/pricingUtils";

const AdminBookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLogs, setBookingLogs] = useState([]);
  const [showLogsModal, setShowLogsModal] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBookingDetails(bookingId);
      if (response.success && response.data?.booking) {
        setBooking(response.data.booking);
      } else {
        showError("Booking not found");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      showError("Failed to load booking details");
      navigate("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingLogs = async () => {
    try {
      const response = await bookingsAPI.getBookingLogs(bookingId);
      if (response.success) {
        setBookingLogs(response.logs || []);
        setShowLogsModal(true);
      } else {
        showError(response.message || "Failed to fetch booking logs");
      }
    } catch (error) {
      console.error("Error fetching booking logs:", error);
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
          <Button onClick={() => navigate("/admin/dashboard")}>
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
            onClick={() => navigate("/admin/dashboard")}
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
                onClick={fetchBookingLogs}
                variant="outline"
                size="sm"
                title="View Status History"
              >
                <History className="h-4 w-4 mr-2" />
                View History
              </Button>
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
          </div>
        </Card>

        <div className="space-y-6">
          {/* Status Tracker */}
          <Card padding="lg">
            <h3 className="font-semibold text-gray-900 mb-4">Booking Status</h3>
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

          {/* Service Information & Additional Information - Merged Table */}
          <Card padding="lg">
            <h3 className="font-semibold text-gray-900 mb-4">
              Service Information & Additional Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold">
                      Support Item #
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold">
                      Support Item Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold">
                      Reg. Group
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold">
                      Day & Time
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold">
                      Address
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-xs font-semibold">
                      Hours
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right text-xs font-semibold">
                      Pricing
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-xs">
                      {booking.serviceDetails?.supportItemNumber || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-xs">
                      {booking.serviceDetails?.serviceName ||
                        booking.serviceTitle ||
                        "Service"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-xs">
                      {booking.serviceDetails?.registrationGroup || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-xs">
                      <div>
                        {new Date(booking.scheduledDate).toLocaleDateString(
                          "en-AU",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-gray-600">
                        {booking.scheduledTime}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-xs">
                      {booking.address
                        ? `${booking.address.street}, ${booking.address.city}, ${booking.address.state} ${booking.address.pincode}`
                        : "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-xs text-center">
                      {booking.serviceHours ||
                        (booking.bookingType === "dateRange"
                          ? "Multiple"
                          : "N/A")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-xs text-right font-semibold">
                      {booking.totalAmount !== null &&
                      booking.totalAmount !== undefined
                        ? formatAUD(booking.totalAmount)
                        : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* Additional Information below the table */}
              {(booking.serviceRequirements ||
                booking.symptoms ||
                booking.notes ||
                booking.providerNotes) && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Additional Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    {(booking.serviceRequirements || booking.symptoms) && (
                      <div>
                        <p className="text-gray-600 font-medium">
                          Service Requirements:
                        </p>
                        <p className="text-gray-900">
                          {booking.serviceRequirements || booking.symptoms}
                        </p>
                      </div>
                    )}
                    {booking.notes && (
                      <div>
                        <p className="text-gray-600 font-medium">Notes:</p>
                        <p className="text-gray-900">{booking.notes}</p>
                      </div>
                    )}
                    {booking.providerNotes && (
                      <div>
                        <p className="text-gray-600 font-medium">
                          Provider Notes:
                        </p>
                        <p className="text-gray-900 bg-blue-50 p-2 rounded">
                          {booking.providerNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-4 text-right">
                <p className="text-sm font-semibold text-gray-900">
                  Total Amount:{" "}
                  {booking.totalAmount !== null &&
                  booking.totalAmount !== undefined
                    ? formatAUD(booking.totalAmount)
                    : "Price not available"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  All prices in Australian Dollars (AUD)
                </p>
              </div>
            </div>
          </Card>

          {/* Customer Information - Second Row */}
          <Card padding="lg">
            <h3 className="font-semibold text-gray-900 mb-4">
              Customer Information
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold">
                      Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold">
                      Age
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold">
                      Phone
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold">
                      Emergency Contact
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-xs">
                      {booking.customerInfo?.name ||
                        booking.patientInfo?.name ||
                        booking.user?.name ||
                        booking.user?.user?.name ||
                        "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-xs">
                      {booking.customerInfo?.age ||
                        booking.patientInfo?.age ||
                        "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-xs">
                      {booking.customerInfo?.phone ||
                        booking.patientInfo?.phone ||
                        booking.user?.phone ||
                        booking.user?.user?.phone ||
                        "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-xs">
                      {booking.customerInfo?.emergencyContact ||
                        booking.patientInfo?.emergencyContact ||
                        booking.customerInfo?.emergencyPhone ||
                        booking.patientInfo?.emergencyPhone ||
                        "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Provider Information */}
          {booking.provider && (
            <Card padding="lg">
              <h3 className="font-semibold text-gray-900 mb-4">
                Provider Information
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold">
                        Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold">
                        Email
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-xs font-semibold">
                        Specialization
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-xs">
                        {booking.provider?.name || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-xs">
                        {booking.provider?.email || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-xs">
                        {booking.provider?.professionalInfo?.specialization
                          ? booking.provider.professionalInfo.specialization
                              .replace(/-/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())
                          : "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          )}
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
    </div>
  );
};

export default AdminBookingDetails;
