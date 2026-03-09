import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { adminAPI, bookingsAPI } from "../../services/api";
import { formatAUD } from "../../utils/pricingUtils";
import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Eye,
  History,
  Download,
  FileText,
  Search,
} from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import LoadingSpinner from "../ui/LoadingSpinner";

const BookingManagementTab = ({ stats = {} }) => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLogs, setBookingLogs] = useState([]);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedBookingForLogs, setSelectedBookingForLogs] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch bookings
  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        status: filters.status !== "all" ? filters.status : undefined,
        search: filters.search || undefined,
      };

      const response = await adminAPI.getBookings(params);
      setBookings(response.data?.bookings || []);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalBookings: 0,
        hasNext: false,
        hasPrev: false,
        ...response.data?.pagination,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, [filters.status, filters.search]);

  const handleViewDetails = async (booking) => {
    navigate(`/admin/bookings/${booking._id}`);
  };

  const fetchBookingLogs = async (bookingId) => {
    try {
      const response = await bookingsAPI.getBookingLogs(bookingId);
      if (response.success) {
        setBookingLogs(response.logs || []);
        const booking = bookings.find((b) => b._id === bookingId);
        setSelectedBookingForLogs(booking);
        setShowLogsModal(true);
      } else {
        showError(response.message || "Failed to fetch booking logs");
      }
    } catch (error) {
      console.error("Error fetching booking logs:", error);
      showError("Failed to fetch booking logs");
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

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Booking Management
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="provider-on-way">En Route</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No bookings found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold">
                      Booking #
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold">
                      Support Item #
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold">
                      Support Item Name
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold">
                      Reg. Group
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold">
                      Day & Time
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-xs font-semibold">
                      Hours
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right text-xs font-semibold">
                      Pricing
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-xs font-semibold">
                      Status
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-xs font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const StatusIcon = getStatusIcon(booking.status);
                    const serviceDay = booking.scheduledDate
                      ? new Date(booking.scheduledDate).toLocaleDateString(
                          "en-AU",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Not scheduled";

                    return (
                      <tr
                        key={booking._id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <td className="border border-gray-300 px-4 py-3 text-xs font-medium">
                          {booking.bookingNumber}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs">
                          {booking.serviceDetails?.supportItemNumber || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs">
                          {booking.serviceDetails?.serviceName ||
                            booking.serviceTitle ||
                            booking.service?.title ||
                            "Service"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs">
                          {booking.serviceDetails?.registrationGroup || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs">
                          <div>{serviceDay}</div>
                          <div className="text-gray-600">
                            {booking.scheduledTime || "Not set"}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs text-center">
                          {booking.serviceHours ||
                            (booking.bookingType === "dateRange"
                              ? "Multiple"
                              : "N/A")}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs text-right font-semibold">
                          {booking.totalAmount
                            ? formatAUD(booking.totalAmount)
                            : "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <Badge color={getStatusColor(booking.status)}>
                            <StatusIcon className="h-3 w-3 mr-1 inline" />
                            {booking.status.replace("-", " ")}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(booking);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                fetchBookingLogs(booking._id);
                              }}
                              className="p-1 text-gray-600 hover:text-gray-800"
                              title="View Status History"
                            >
                              <History className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadInvoice(booking._id, false);
                              }}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Download Invoice"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            {booking.status === "completed" &&
                              booking.eSignature?.signature && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadInvoice(booking._id, true);
                                  }}
                                  className="p-1 text-purple-600 hover:text-purple-800"
                                  title="Download E-Signed Invoice"
                                >
                                  <FileText className="h-4 w-4" />
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 px-4">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.currentPage} of{" "}
                  {pagination.totalPages} ({pagination.totalBookings} total
                  bookings)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchBookings(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchBookings(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

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
            {selectedBookingForLogs?.bookingNumber}
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
                          {log.newStatus?.replace("-", " ") || "N/A"}
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
                      {log.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          Notes: {log.notes}
                        </p>
                      )}
                      {log.providerNotes && (
                        <p className="text-sm text-blue-600 mt-1">
                          Provider Notes: {log.providerNotes}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No status history available for this booking.
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={() => setShowLogsModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingManagementTab;
