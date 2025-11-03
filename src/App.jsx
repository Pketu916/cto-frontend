import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { SocketProvider } from "./contexts/SocketContext";
import Header from "./components/navigation/Header";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import HowItWorks from "./pages/HowItWorks";
import Membership from "./pages/Membership";
import Eligibility from "./pages/Eligibility";
import ClinicalTeam from "./pages/ClinicalTeam";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import UserDashboard from "./pages/dashboard/UserDashboard";
import UserBookingDetails from "./pages/dashboard/UserBookingDetails";
import ProviderDashboard from "./pages/dashboard/ProviderDashboard";
import ProviderBookingDetails from "./pages/dashboard/ProviderBookingDetails";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import BookingConfirmation from "./pages/BookingConfirmation";
import Tracking from "./pages/Tracking";
import { ProtectedRoute } from "./components/auth";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <SocketProvider>
            <div className="min-h-screen bg-white">
              <Header />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/eligibility" element={<Eligibility />} />
                <Route path="/clinical-team" element={<ClinicalTeam />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register/user" element={<Register />} />
                <Route path="/register/provider" element={<Register />} />
                <Route path="/tracking/:bookingId" element={<Tracking />} />

                {/* Protected Routes */}
                <Route
                  path="/booking/confirmation"
                  element={
                    <ProtectedRoute userType="user">
                      <BookingConfirmation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/dashboard"
                  element={
                    <ProtectedRoute userType="user">
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/bookings/:bookingId"
                  element={
                    <ProtectedRoute userType="user">
                      <UserBookingDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/provider/dashboard"
                  element={
                    <ProtectedRoute userType="provider">
                      <ProviderDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/provider/bookings/:bookingId"
                  element={
                    <ProtectedRoute userType="provider">
                      <ProviderBookingDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute userType="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </SocketProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
