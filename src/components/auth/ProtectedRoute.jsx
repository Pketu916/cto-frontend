import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, userType: authUserType, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the correct user type
  if (userType && authUserType !== userType) {
    // Redirect to appropriate dashboard based on user type
    const dashboardPath =
      authUserType === "admin"
        ? "/admin/dashboard"
        : authUserType === "provider"
        ? "/provider/dashboard"
        : "/user/dashboard";

    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
