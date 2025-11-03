import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Logo1 from "../../assets/Logo1.jpg";

const Header = () => {
  const { isAuthenticated, user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  const getDashboardPath = () => {
    switch (userType) {
      case "admin":
        return "/admin/dashboard";
      case "provider":
        return "/provider/dashboard";
      case "user":
        return "/user/dashboard";
      default:
        return "/login";
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Navigation Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container">
          <div className="flex flex-wrap justify-between items-center text-sm">
            <div className="flex flex-wrap gap-4">
              <span className="hover:text-secondary transition-colors duration-200">
                📞 1800 40 30 50
              </span>
              <span className="hover:text-secondary transition-colors duration-200">
                📧 info@mycrt.com.au
              </span>
            </div>
            <div className="flex gap-4 items-center">
              {isAuthenticated ? (
                <>
                  <span className="text-white">Welcome, {user?.name}</span>
                  <Link
                    to={getDashboardPath()}
                    className="hover:text-secondary transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hover:text-secondary transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:text-secondary transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register/user"
                    className="hover:text-secondary transition-colors duration-200"
                  >
                    Register as Customer
                  </Link>
                  <Link
                    to="/register/provider"
                    className="hover:text-secondary transition-colors duration-200"
                  >
                    Register as Provider
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white">
        <div className="container">
          <div className="flex items-center justify-between py-2">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={Logo1}
                  alt="CTO India Logo"
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Main Navigation Links */}
              <Link
                to="/"
                className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <Link
                to="/services"
                className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
              >
                Services
              </Link>
              <Link
                to="/about"
                className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
              >
                About
              </Link>
              <Link
                to="/membership"
                className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
              >
                Membership
              </Link>
              <Link
                to="/how-it-works"
                className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
              >
                How It Works
              </Link>
              <Link
                to="/contact"
                className="text-primary hover:text-secondary transition-colors duration-200 font-medium"
              >
                Contact
              </Link>

              {/* User Menu Dropdown */}
              {isAuthenticated && (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-primary hover:text-secondary transition-colors duration-200 font-medium"
                  >
                    <span>{user?.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to={getDashboardPath()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>

                      {/* Role-specific Links */}
                      {userType === "admin" && (
                        <>
                          <div className="border-t border-gray-100"></div>
                          <Link
                            to="/admin/users"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Manage Customers
                          </Link>
                          <Link
                            to="/admin/providers"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Manage Providers
                          </Link>
                        </>
                      )}

                      {userType === "provider" && (
                        <>
                          <div className="border-t border-gray-100"></div>
                          <Link
                            to="/provider/requests"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Service Requests
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-primary hover:text-secondary transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Main Navigation Links */}
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/membership"
                className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Membership
              </Link>
              <Link
                to="/how-it-works"
                className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* User-specific Links */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    to={getDashboardPath()}
                    className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>

                  {/* Role-specific Links */}
                  {userType === "admin" && (
                    <>
                      <Link
                        to="/admin/users"
                        className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary hover:bg-gray-50 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Manage Customers
                      </Link>
                      <Link
                        to="/admin/providers"
                        className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary hover:bg-gray-50 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Manage Providers
                      </Link>
                    </>
                  )}

                  {userType === "provider" && (
                    <Link
                      to="/provider/requests"
                      className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Service Requests
                    </Link>
                  )}

                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
