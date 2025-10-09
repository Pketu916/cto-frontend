import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Shield,
  Calendar,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Settings,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ProviderManagementTab from "../../components/dashboard/ProviderManagementTab";
import ErrorBoundary from "../../components/ErrorBoundary";
import api from "../../services/api";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    pendingApprovals: 0,
  });

  // Fetch dashboard statistics
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/stats");
      setStats({
        totalUsers: 0,
        totalProviders: 0,
        totalBookings: 0,
        pendingApprovals: 0,
        ...response.data,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      showError("Failed to load dashboard statistics");
      // Keep default stats on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "users", label: "Users", icon: Users },
    { id: "providers", label: "Providers", icon: Shield },
    { id: "bookings", label: "Bookings", icon: Calendar },
  ];

  if (loading && stats.totalUsers === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate("/settings")}
                className="flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                onClick={fetchStats}
                disabled={loading}
                className="flex items-center"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      selectedTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card padding="lg">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        stats.totalUsers
                      )}
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Service Providers
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        stats.totalProviders
                      )}
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Bookings
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        stats.totalBookings
                      )}
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Pending Approvals
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        stats.pendingApprovals
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* System Status */}
            <Card padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    System Status
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    All systems operational
                  </p>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Online</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Users Management Tab */}
        {selectedTab === "users" && (
          <div className="space-y-6">
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  User Management
                </h3>
                <Button variant="outline" size="sm">
                  Export Users
                </Button>
              </div>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  User Management
                </h4>
                <p className="text-gray-600 mb-4">
                  Manage user accounts, view user activity, and handle
                  user-related issues.
                </p>
                <div className="text-sm text-gray-500">
                  Total Active Users:{" "}
                  <span className="font-semibold">{stats.totalUsers}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Providers Management Tab */}
        {selectedTab === "providers" && (
          <ErrorBoundary>
            <ProviderManagementTab stats={stats} onStatsUpdate={fetchStats} />
          </ErrorBoundary>
        )}

        {/* Bookings Management Tab */}
        {selectedTab === "bookings" && (
          <div className="space-y-6">
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Booking Management
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export Bookings
                  </Button>
                  <Button size="sm">View All Bookings</Button>
                </div>
              </div>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Booking Management
                </h4>
                <p className="text-gray-600 mb-4">
                  Monitor bookings, handle booking issues, and track service
                  delivery.
                </p>
                <div className="text-sm text-gray-500">
                  Total Bookings:{" "}
                  <span className="font-semibold">{stats.totalBookings}</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
