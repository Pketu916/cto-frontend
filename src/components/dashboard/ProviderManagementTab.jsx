import React, { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import { adminAPI } from "../../services/api";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Filter,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import LoadingSpinner from "../ui/LoadingSpinner";

const ProviderManagementTab = ({ stats = {}, onStatsUpdate }) => {
  const { showSuccess, showError } = useToast();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default stats values
  const defaultStats = {
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    pendingApprovals: 0,
    ...stats,
  };
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    notes: "",
  });
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProviders: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch providers
  const fetchProviders = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        status: filters.status !== "all" ? filters.status : undefined,
        search: filters.search || undefined,
      };

      const response = await adminAPI.getProviders(params);
      setProviders(response.data?.providers || []);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalProviders: 0,
        hasNext: false,
        hasPrev: false,
        ...response.data?.pagination,
      });
    } catch (error) {
      console.error("Error fetching providers:", error);
      showError("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders(1);
  }, [filters.status, filters.search]);

  // Update provider status
  const handleStatusUpdate = async () => {
    try {
      // Clean the status data (now should always be string from Select)
      const cleanStatus = String(statusUpdate.status || "");
      const cleanNotes = String(statusUpdate.notes || "");

      // Debug logging
      console.log("🔧 Status Update Debug:", {
        originalStatus: statusUpdate.status,
        cleanStatus,
        originalNotes: statusUpdate.notes,
        cleanNotes,
        providerId: selectedProvider._id,
        validStatuses: ["pending", "approved", "rejected", "suspended"],
      });

      // Validate status before API call
      const validStatuses = ["pending", "approved", "rejected", "suspended"];
      if (!validStatuses.includes(cleanStatus)) {
        throw new Error(
          `Invalid status: ${cleanStatus}. Must be one of: ${validStatuses.join(
            ", "
          )}`
        );
      }

      await adminAPI.updateProviderStatus(
        selectedProvider._id,
        cleanStatus,
        cleanNotes
      );

      showSuccess(`Provider status updated to ${cleanStatus}`);

      // Refresh data
      fetchProviders(pagination.currentPage);
      if (onStatsUpdate) onStatsUpdate(); // Update main dashboard stats

      setShowStatusModal(false);
      setStatusUpdate({ status: "", notes: "" });
      setSelectedProvider(null);
    } catch (error) {
      console.error("Error updating provider status:", error);
      showError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update provider status"
      );
    }
  };

  const handleViewDetails = (provider) => {
    setSelectedProvider(provider);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "suspended":
        return "orange";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return AlertTriangle;
      case "approved":
        return CheckCircle;
      case "rejected":
        return XCircle;
      case "suspended":
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Provider Management
          </h2>
          <p className="text-gray-600 mt-1">
            Review and manage healthcare provider profiles
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="lg">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Providers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.totalProviders}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Approval
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {defaultStats.pendingApprovals}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  providers.filter((p) => p.verificationStatus === "approved")
                    .length
                }
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  providers.filter((p) => p.verificationStatus === "rejected")
                    .length
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Providers List */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Provider Management
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search providers..."
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : providers.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No providers found</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {providers.map((provider) => {
              const StatusIcon = getStatusIcon(provider.verificationStatus);
              return (
                <div
                  key={provider._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {provider.name}
                        </h4>
                        <Badge color={getStatusColor(provider.verificationStatus)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {provider.verificationStatus.replace("-", " ")}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Provider Information */}
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-900 flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </h5>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Email:</span>{" "}
                              {provider.email}
                            </p>
                            {provider.phone && (
                              <p className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {provider.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Professional Info */}
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-900 flex items-center text-sm">
                            <Shield className="h-4 w-4 mr-2" />
                            Professional Info
                          </h5>
                          <div className="space-y-1 text-sm">
                            {provider.professionalInfo?.specialization && (
                              <p>
                                <span className="font-medium">Specialization:</span>{" "}
                                {provider.professionalInfo.specialization
                                  .replace(/-/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </p>
                            )}
                            {provider.professionalInfo?.licenseNumber && (
                              <p>
                                <span className="font-medium">License:</span>{" "}
                                {provider.professionalInfo.licenseNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(provider)}
                      className="flex items-center ml-4"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Provider Details Modal */}
      {selectedProvider && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Provider Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Provider Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Provider Information
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <p className="text-gray-900">{selectedProvider.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <p className="text-gray-900">{selectedProvider.email}</p>
                </div>
                {selectedProvider.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="text-gray-900">{selectedProvider.phone}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <Badge
                    color={getStatusColor(selectedProvider.verificationStatus)}
                    className="ml-2"
                  >
                    {selectedProvider.verificationStatus.replace("-", " ")}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            {selectedProvider.professionalInfo && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Professional Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {selectedProvider.professionalInfo.specialization && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Specialization:
                      </span>
                      <p className="text-gray-900">
                        {selectedProvider.professionalInfo.specialization
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                    </div>
                  )}
                  {selectedProvider.professionalInfo.licenseNumber && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        License Number:
                      </span>
                      <p className="text-gray-900">
                        {selectedProvider.professionalInfo.licenseNumber}
                      </p>
                    </div>
                  )}
                  {selectedProvider.professionalInfo.experience && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Experience:
                      </span>
                      <p className="text-gray-900">
                        {selectedProvider.professionalInfo.experience} years
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Address */}
            {selectedProvider.address && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">
                    {selectedProvider.address.street}
                    {selectedProvider.address.city && (
                      <>, {selectedProvider.address.city}</>
                    )}
                    {selectedProvider.address.state && (
                      <>, {selectedProvider.address.state}</>
                    )}
                    {selectedProvider.address.pincode && (
                      <> {selectedProvider.address.pincode}</>
                    )}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
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

      {/* Status Update Modal */}
      {selectedProvider && (
        <Modal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setStatusUpdate({ status: "", notes: "" });
            setSelectedProvider(null);
          }}
          title="Update Provider Status"
          size="md"
        >
          <div className="space-y-4">
            <Select
              label="Status"
              value={statusUpdate.status}
              onChange={(e) =>
                setStatusUpdate({ ...statusUpdate, status: e.target.value })
              }
              options={[
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
                { value: "suspended", label: "Suspended" },
              ]}
              required
            />
            <Input
              label="Notes (Optional)"
              type="textarea"
              value={statusUpdate.notes}
              onChange={(e) =>
                setStatusUpdate({ ...statusUpdate, notes: e.target.value })
              }
              placeholder="Add notes about this status change"
            />
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStatusModal(false);
                  setStatusUpdate({ status: "", notes: "" });
                  setSelectedProvider(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleStatusUpdate}
                disabled={!statusUpdate.status}
              >
                Update Status
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProviderManagementTab;
