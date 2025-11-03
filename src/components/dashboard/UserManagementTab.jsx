import React, { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import { adminAPI } from "../../services/api";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Filter,
  Search,
} from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import LoadingSpinner from "../ui/LoadingSpinner";

const UserManagementTab = ({ stats = {} }) => {
  const { showError } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch users
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: filters.search || undefined,
      };

      const response = await adminAPI.getUsers(params);
      setUsers(response.data?.users || []);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        hasNext: false,
        hasPrev: false,
        ...response.data?.pagination,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      showError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [filters.search]);

  const handleViewDetails = async (user) => {
    try {
      const response = await adminAPI.getUserDetails(user._id);
      setSelectedUser(response.data?.user || user);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setSelectedUser(user);
      setShowDetailsModal(true);
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
            User Management
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(user)}
                          className="flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 px-4">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.currentPage} of{" "}
                  {pagination.totalPages} ({pagination.totalUsers} total users)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchUsers(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchUsers(pagination.currentPage + 1)}
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

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="User Details"
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Personal Information
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Name:
                  </span>
                  <p className="text-gray-900">{selectedUser.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Email:
                  </span>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Phone:
                  </span>
                  <p className="text-gray-900">{selectedUser.phone}</p>
                </div>
                {selectedUser.dateOfBirth && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Date of Birth:
                    </span>
                    <p className="text-gray-900">
                      {formatDate(selectedUser.dateOfBirth)}
                    </p>
                  </div>
                )}
                {selectedUser.gender && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Gender:
                    </span>
                    <p className="text-gray-900 capitalize">
                      {selectedUser.gender}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {selectedUser.address && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedUser.address.street && (
                    <p className="text-gray-900">
                      {selectedUser.address.street}
                    </p>
                  )}
                  <p className="text-gray-900">
                    {selectedUser.address.city}
                    {selectedUser.address.state &&
                      `, ${selectedUser.address.state}`}
                    {selectedUser.address.pincode &&
                      ` ${selectedUser.address.pincode}`}
                  </p>
                  {selectedUser.address.country && (
                    <p className="text-gray-600">
                      {selectedUser.address.country}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Account Information
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Registration Date:
                  </span>
                  <p className="text-gray-900">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Status:
                  </span>
                  <span
                    className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedUser.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedUser.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
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
    </div>
  );
};

export default UserManagementTab;
