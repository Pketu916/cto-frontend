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
        status: filters.status !== "all" ? filters.status : undefined,
        page,
        limit: 10,
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
    fetchProviders();
  }, [filters.status]);

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
      showError("Failed to update provider status");
    }
  };

  // Open status update modal
  const openStatusModal = (provider) => {
    console.log("🔧 Opening Status Modal:", {
      provider: provider.name,
      currentStatus: provider.verificationStatus,
      currentNotes: provider.verificationNotes,
    });

    setSelectedProvider(provider);
    setStatusUpdate({
      status: provider.verificationStatus,
      notes: provider.verificationNotes || "",
    });
    setShowStatusModal(true);
  };

  // Open provider details modal
  const openDetailsModal = async (provider) => {
    try {
      const response = await adminAPI.getProviderDetails(provider._id);
      setSelectedProvider(response.data.provider);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching provider details:", error);
      showError("Failed to load provider details");
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "pending":
        return "yellow";
      case "rejected":
        return "red";
      case "suspended":
        return "red";
      default:
        return "gray";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return CheckCircle;
      case "pending":
        return AlertTriangle;
      case "rejected":
        return XCircle;
      case "suspended":
        return Shield;
      default:
        return AlertTriangle;
    }
  };

  // Filter providers by search
  const filteredProviders = providers.filter((provider) => {
    if (!filters.search) return true;
    const searchTerm = filters.search.toLowerCase();
    return (
      provider.name.toLowerCase().includes(searchTerm) ||
      provider.email.toLowerCase().includes(searchTerm) ||
      provider.professionalInfo?.specialization
        ?.toLowerCase()
        .includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

      {/* Filters */}
      <Card padding="lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search providers..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              icon={Search}
            />
          </div>
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: "all", label: "All Status" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
              { value: "suspended", label: "Suspended" },
            ]}
          />
        </div>
      </Card>

      {/* Providers List */}
      <Card padding="lg">
        <div className="space-y-4">
          {filteredProviders.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No providers found
              </h3>
              <p className="text-gray-600">
                {filters.search || filters.status !== "all"
                  ? "Try adjusting your search or filters"
                  : "No providers have registered yet"}
              </p>
            </div>
          ) : (
            filteredProviders.map((provider) => {
              const StatusIcon = getStatusIcon(provider.verificationStatus);
              return (
                <div
                  key={provider._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {provider.documents?.profilePicture ? (
                          <img
                            src={provider.documents.profilePicture}
                            alt={provider.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {provider.name}
                          </h3>
                          <Badge
                            color={getStatusColor(provider.verificationStatus)}
                            icon={StatusIcon}
                          >
                            {provider.verificationStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {provider.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {provider.phone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {provider.address?.city}, {provider.address?.state}
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            <strong>Specialization:</strong>{" "}
                            {provider.professionalInfo?.specialization?.replace(
                              "-",
                              " "
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Experience:</strong>{" "}
                            {provider.professionalInfo?.experience}
                          </p>
                        </div>
                        {provider.verificationNotes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <strong>Admin Notes:</strong>{" "}
                            {provider.verificationNotes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailsModal(provider)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => openStatusModal(provider)}
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrev}
                onClick={() => fetchProviders(pagination.currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNext}
                onClick={() => fetchProviders(pagination.currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Provider Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Provider Details"
        size="lg"
      >
        {selectedProvider && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <p className="text-gray-900">{selectedProvider.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900">{selectedProvider.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Phone
                    </label>
                    <p className="text-gray-900">{selectedProvider.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <Badge
                      color={getStatusColor(
                        selectedProvider.verificationStatus
                      )}
                    >
                      {selectedProvider.verificationStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Professional Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Specialization
                    </label>
                    <p className="text-gray-900">
                      {selectedProvider.professionalInfo?.specialization?.replace(
                        "-",
                        " "
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      License Number
                    </label>
                    <p className="text-gray-900">
                      {selectedProvider.professionalInfo?.licenseNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Experience
                    </label>
                    <p className="text-gray-900">
                      {selectedProvider.professionalInfo?.experience}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Hospital/Clinic
                    </label>
                    <p className="text-gray-900">
                      {selectedProvider.professionalInfo?.hospital}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Address
              </h3>
              <p className="text-gray-900">
                {selectedProvider.address?.street},{" "}
                {selectedProvider.address?.city},{" "}
                {selectedProvider.address?.state} -{" "}
                {selectedProvider.address?.pincode}
              </p>
            </div>

            {/* Verification Notes */}
            {selectedProvider.verificationNotes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Admin Notes
                </h3>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">
                  {selectedProvider.verificationNotes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
              <Button onClick={() => openStatusModal(selectedProvider)}>
                Update Status
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Provider Status"
      >
        {selectedProvider && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider
              </label>
              <p className="text-gray-900 font-medium">
                {selectedProvider.name}
              </p>
              <p className="text-sm text-gray-600">{selectedProvider.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                value={statusUpdate.status}
                onChange={(e) => {
                  // Standard HTML select onChange passes event object
                  const value = e.target.value;

                  console.log("🔧 Select onChange Debug:", {
                    event: e,
                    targetValue: e.target.value,
                    valueType: typeof value,
                  });

                  setStatusUpdate({ ...statusUpdate, status: value });
                }}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                  { value: "suspended", label: "Suspended" },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={statusUpdate.notes}
                onChange={(e) =>
                  setStatusUpdate({ ...statusUpdate, notes: e.target.value })
                }
                placeholder="Add notes for the provider..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleStatusUpdate}>Update Status</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProviderManagementTab;
