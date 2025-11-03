import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { adminAPI, bookingsAPI } from "../../services/api";
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
  Download,
  FileText,
  Search,
  Navigation,
} from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import LoadingSpinner from "../ui/LoadingSpinner";
import { ProviderLocationMap, StatusTracker } from "../ui";

const BookingManagementTab = ({ stats = {} }) => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [bookingLogs, setBookingLogs] = useState([]);
  const [showLogsModal, setShowLogsModal] = useState(false);
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
    try {
      const response = await adminAPI.getBookingDetails(booking._id);
      setSelectedBooking(response.data?.booking || booking);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setSelectedBooking(booking);
      setShowDetailsModal(true);
    }
  };

  const fetchBookingLogs = async (bookingId) => {
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
            <div className="space-y-4">
              {bookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status);

                return (
                  <Card
                    key={booking._id}
                    padding="lg"
                    className="hover:shadow-md transition-all relative group cursor-pointer"
                    onClick={() => handleViewDetails(booking)}
                  >
                    {/* Shortcut Icon Buttons - Top Right */}
                    <div
                      className="absolute top-4 right-4 flex gap-2 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          handleViewDetails(booking);
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
                              "Service Booking"}
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
                            {booking.scheduledDate
                              ? new Date(
                                  booking.scheduledDate
                                ).toLocaleDateString()
                              : "Not scheduled"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.scheduledTime || "Not set"}
                          </span>
                          {booking.totalAmount && (
                            <span className="font-medium text-green-600">
                              ₹{booking.totalAmount}
                            </span>
                          )}
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
              })}
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

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Booking Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Booking Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Booking Information
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Booking Number:
                  </span>
                  <p className="text-gray-900">
                    {selectedBooking.bookingNumber}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Service:
                  </span>
                  <p className="text-gray-900">
                    {selectedBooking.serviceTitle || "Service"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Status:
                  </span>
                  <Badge color={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status.replace("-", " ")}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Amount:
                  </span>
                  <p className="font-semibold text-green-600">
                    ₹{selectedBooking.totalAmount}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Customer Information
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Name:
                  </span>
                  <p className="text-gray-900">
                    {selectedBooking.customerInfo?.name ||
                      selectedBooking.patientInfo?.name ||
                      selectedBooking.user?.name ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Age:
                  </span>
                  <p className="text-gray-900">
                    {selectedBooking.customerInfo?.age ||
                      selectedBooking.patientInfo?.age ||
                      "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Phone:
                  </span>
                  <p className="text-gray-900">
                    {selectedBooking.customerInfo?.phone ||
                      selectedBooking.patientInfo?.phone ||
                      selectedBooking.user?.phone ||
                      "N/A"}
                  </p>
                </div>
                {selectedBooking.user?.email && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      Email:
                    </span>
                    <p className="text-gray-900">
                      {selectedBooking.user.email}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Emergency Contact:
                  </span>
                  <p className="text-gray-900">
                    {selectedBooking.customerInfo?.emergencyContact ||
                      selectedBooking.patientInfo?.emergencyContact ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule & Location
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Date:
                  </span>
                  <p className="text-gray-900">
                    {formatDate(selectedBooking.scheduledDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Time:
                  </span>
                  <p className="text-gray-900">
                    {selectedBooking.scheduledTime}
                  </p>
                </div>
                {selectedBooking.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Address:
                      </span>
                      <p className="text-gray-900">
                        {selectedBooking.address.street}
                        {selectedBooking.address.city && (
                          <>, {selectedBooking.address.city}</>
                        )}
                        {selectedBooking.address.state && (
                          <>, {selectedBooking.address.state}</>
                        )}
                        {selectedBooking.address.pincode && (
                          <> {selectedBooking.address.pincode}</>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Provider */}
            {selectedBooking.provider && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Assigned Provider
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">
                    {selectedBooking.provider?.name || "Not assigned"}
                  </p>
                  {selectedBooking.provider?.email && (
                    <p className="text-sm text-gray-600">
                      {selectedBooking.provider.email}
                    </p>
                  )}
                  {selectedBooking.provider?.professionalInfo
                    ?.specialization && (
                    <p className="text-sm text-gray-600">
                      Service Type:{" "}
                      {selectedBooking.provider.professionalInfo.specialization
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Service Requirements */}
            {(selectedBooking.serviceRequirements ||
              selectedBooking.symptoms ||
              selectedBooking.notes) && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Additional Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {(selectedBooking.serviceRequirements ||
                    selectedBooking.symptoms) && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Service Requirements:
                      </span>
                      <p className="text-gray-900">
                        {selectedBooking.serviceRequirements ||
                          selectedBooking.symptoms}
                      </p>
                    </div>
                  )}
                  {selectedBooking.notes && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Notes:
                      </span>
                      <p className="text-gray-900">{selectedBooking.notes}</p>
                    </div>
                  )}
                  {selectedBooking.providerNotes && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Provider Notes:
                      </span>
                      <p className="text-gray-900 bg-blue-50 p-2 rounded mt-1">
                        {selectedBooking.providerNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Tracker */}
            <div>
              <StatusTracker
                status={
                  selectedBooking.status === "provider-on-way"
                    ? "on_the_way"
                    : selectedBooking.status === "in-progress" ||
                      selectedBooking.status === "work-started"
                    ? "on_the_way"
                    : selectedBooking.status === "completed"
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

            {/* Provider Location Map - Show when provider is assigned and tracking */}
            {(selectedBooking.status === "provider-on-way" ||
              selectedBooking.status === "provider-started" ||
              selectedBooking.status === "work-started" ||
              selectedBooking.status === "in-progress" ||
              selectedBooking.status === "completed") &&
              (selectedBooking.providerLocation?.isTracking ||
                selectedBooking.provider) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                    <Navigation className="h-4 w-4 mr-2" />
                    Provider Location Tracking
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <ProviderLocationMap
                        providerLocation={selectedBooking.providerLocation}
                        customerAddress={selectedBooking.address}
                        status={selectedBooking.status}
                        bookingId={selectedBooking._id}
                        providerName={
                          selectedBooking.provider?.name || "Service Provider"
                        }
                        height="400px"
                      />
                    </div>
                  </div>
                </div>
              )}

            <div className="flex justify-between pt-4 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadInvoice(selectedBooking._id, false)}
                >
                  Download Invoice
                </Button>
                {selectedBooking.status === "completed" &&
                selectedBooking.eSignature?.signature ? (
                  <Button
                    variant="outline"
                    onClick={() => downloadInvoice(selectedBooking._id, true)}
                  >
                    Download E-Signed Invoice
                  </Button>
                ) : null}
              </div>
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

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
