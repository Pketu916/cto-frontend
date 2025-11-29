import React, { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import { adminAPI } from "../../services/api";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Eye,
  Search,
  FileText,
  Edit,
} from "lucide-react";
import Button from "../ui/Button";
import { formatAUD } from "../../utils/pricingUtils";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import LoadingSpinner from "../ui/LoadingSpinner";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

const QuotationManagementTab = ({ stats = {} }) => {
  const { showError, showSuccess } = useToast();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQuotations: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [quoteForm, setQuoteForm] = useState({
    quotedPrice: "",
    priceType: "Standard",
    adminNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch quotations
  const fetchQuotations = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        status: filters.status !== "all" ? filters.status : undefined,
        search: filters.search || undefined,
      };

      const response = await adminAPI.getQuotations(params);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch quotations");
      }
      setQuotations(response.data?.quotations || []);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalQuotations: 0,
        hasNext: false,
        hasPrev: false,
        ...response.data?.pagination,
      });
    } catch (error) {
      console.error("Error fetching quotations:", error);
      showError("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations(1);
  }, [filters.status, filters.search]);

  const handleViewDetails = async (quotation) => {
    try {
      const response = await adminAPI.getQuotationDetails(quotation._id);
      setSelectedQuotation(response.data?.quotation || quotation);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching quotation details:", error);
      setSelectedQuotation(quotation);
      setShowDetailsModal(true);
    }
  };

  const handleOpenQuoteModal = (quotation) => {
    setSelectedQuotation(quotation);
    setQuoteForm({
      quotedPrice: quotation.quotedPrice || "",
      priceType: quotation.priceType || "Standard",
      adminNotes: quotation.adminNotes || "",
    });
    setShowQuoteModal(true);
  };

  const handleSubmitQuote = async () => {
    if (!quoteForm.quotedPrice || parseFloat(quoteForm.quotedPrice) <= 0) {
      showError("Please enter a valid price");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await adminAPI.quoteQuotation(
        selectedQuotation._id,
        parseFloat(quoteForm.quotedPrice),
        quoteForm.priceType,
        quoteForm.adminNotes
      );

      if (response.success) {
        showSuccess("Quotation priced successfully");
        setShowQuoteModal(false);
        fetchQuotations(pagination.currentPage);
      } else {
        showError(response.message || "Failed to price quotation");
      }
    } catch (error) {
      console.error("Error pricing quotation:", error);
      showError("Failed to price quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveQuotation = async (quotationId) => {
    if (!window.confirm("Approve this quotation and create booking?")) {
      return;
    }

    try {
      const response = await adminAPI.approveQuotation(quotationId);
      if (response.success) {
        showSuccess("Quotation approved and booking created successfully");
        fetchQuotations(pagination.currentPage);
        if (showDetailsModal) {
          setShowDetailsModal(false);
        }
      } else {
        showError(response.message || "Failed to approve quotation");
      }
    } catch (error) {
      console.error("Error approving quotation:", error);
      showError("Failed to approve quotation");
    }
  };

  const handleRejectQuotation = async (quotationId) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const response = await adminAPI.rejectQuotation(quotationId, reason);
      if (response.success) {
        showSuccess("Quotation rejected");
        fetchQuotations(pagination.currentPage);
        if (showDetailsModal) {
          setShowDetailsModal(false);
        }
      } else {
        showError(response.message || "Failed to reject quotation");
      }
    } catch (error) {
      console.error("Error rejecting quotation:", error);
      showError("Failed to reject quotation");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "quoted":
        return "blue";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "converted":
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return AlertCircle;
      case "quoted":
        return FileText;
      case "approved":
        return CheckCircle;
      case "rejected":
        return XCircle;
      case "converted":
        return CheckCircle;
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
            Quotation Management
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search quotations..."
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
                <option value="quoted">Quoted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : quotations.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No quotations found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold">
                      Quotation #
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
                      Quoted Price
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold">
                      Customer
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
                  {quotations.map((quotation) => {
                    const StatusIcon = getStatusIcon(quotation.status);
                    const serviceDay = quotation.scheduledDate
                      ? new Date(quotation.scheduledDate).toLocaleDateString(
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
                      <tr key={quotation._id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 text-xs font-medium">
                          {quotation.quotationNumber}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs">
                          {quotation.serviceDetails?.supportItemNumber || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs">
                          {quotation.serviceDetails?.serviceName ||
                            quotation.serviceTitle ||
                            "Service Request"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs">
                          {quotation.serviceDetails?.registrationGroup || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs">
                          <div>{serviceDay}</div>
                          <div className="text-gray-600">
                            {quotation.scheduledTime || "Not set"}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs text-center">
                          {quotation.serviceHours || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs text-right font-semibold">
                          {quotation.quotedPrice
                            ? formatAUD(quotation.quotedPrice)
                            : "Pending"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-xs">
                          {quotation.customerInfo?.name || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <Badge color={getStatusColor(quotation.status)}>
                            <StatusIcon className="h-3 w-3 mr-1 inline" />
                            {quotation.status.replace("-", " ")}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(quotation)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {quotation.status === "pending" && (
                              <button
                                onClick={() => handleOpenQuoteModal(quotation)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Add Pricing"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
                            {quotation.status === "quoted" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleApproveQuotation(quotation._id)
                                  }
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleRejectQuotation(quotation._id)
                                  }
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
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
                  {pagination.totalPages} ({pagination.totalQuotations} total
                  quotations)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchQuotations(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchQuotations(pagination.currentPage + 1)}
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

      {/* Quotation Details Modal */}
      {selectedQuotation && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Quotation Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Quotation Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Quotation Information
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Quotation Number:
                  </span>
                  <p className="text-gray-900">
                    {selectedQuotation.quotationNumber}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Service:
                  </span>
                  <p className="text-gray-900">
                    {selectedQuotation.serviceTitle || "Service"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Status:
                  </span>
                  <Badge color={getStatusColor(selectedQuotation.status)}>
                    {selectedQuotation.status.replace("-", " ")}
                  </Badge>
                </div>
                {selectedQuotation.quotedPrice && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Quoted Price:
                    </span>
                    <p className="font-semibold text-green-600">
                      {formatAUD(selectedQuotation.quotedPrice)}
                    </p>
                  </div>
                )}
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
                    {selectedQuotation.customerInfo?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Age:
                  </span>
                  <p className="text-gray-900">
                    {selectedQuotation.customerInfo?.age || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Phone:
                  </span>
                  <p className="text-gray-900">
                    {selectedQuotation.customerInfo?.phone || "N/A"}
                  </p>
                </div>
                {selectedQuotation.user?.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Email:
                    </span>
                    <p className="text-gray-900">
                      {selectedQuotation.user.email}
                    </p>
                  </div>
                )}
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
                    {formatDate(selectedQuotation.scheduledDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Time:
                  </span>
                  <p className="text-gray-900">
                    {selectedQuotation.scheduledTime}
                  </p>
                </div>
                {selectedQuotation.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Address:
                      </span>
                      <p className="text-gray-900">
                        {selectedQuotation.address.street}
                        {selectedQuotation.address.city && (
                          <>, {selectedQuotation.address.city}</>
                        )}
                        {selectedQuotation.address.state && (
                          <>, {selectedQuotation.address.state}</>
                        )}
                        {selectedQuotation.address.pincode && (
                          <> {selectedQuotation.address.pincode}</>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Service Requirements */}
            {selectedQuotation.serviceRequirements && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Service Requirements
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">
                    {selectedQuotation.serviceRequirements}
                  </p>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {selectedQuotation.adminNotes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Admin Notes
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-900">
                    {selectedQuotation.adminNotes}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              {selectedQuotation.status === "pending" && (
                <Button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleOpenQuoteModal(selectedQuotation);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Add Pricing
                </Button>
              )}
              {selectedQuotation.status === "quoted" && (
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleApproveQuotation(selectedQuotation._id)
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Create Booking
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRejectQuotation(selectedQuotation._id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
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

      {/* Quote Modal */}
      <Modal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        title="Add Pricing to Quotation"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quoted Price (AUD) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={quoteForm.quotedPrice}
              onChange={(e) =>
                setQuoteForm({ ...quoteForm, quotedPrice: e.target.value })
              }
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Type
            </label>
            <select
              value={quoteForm.priceType}
              onChange={(e) =>
                setQuoteForm({ ...quoteForm, priceType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Standard">Standard</option>
              <option value="Remote">Remote</option>
              <option value="Very Remote">Very Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Optional)
            </label>
            <Textarea
              value={quoteForm.adminNotes}
              onChange={(e) =>
                setQuoteForm({ ...quoteForm, adminNotes: e.target.value })
              }
              rows={4}
              placeholder="Add any notes about this quotation..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowQuoteModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitQuote} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Pricing"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuotationManagementTab;
