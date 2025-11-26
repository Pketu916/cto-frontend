import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ServiceBookingForm } from "../components/forms";
import { useToast } from "../contexts/ToastContext";

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get service from location state
  useEffect(() => {
    // Check if service is passed via location state
    if (location.state?.service) {
      setService(location.state.service);
      setLoading(false);
      return;
    }

    // No service provided, redirect to services page
    showError("Please select a service to book");
    navigate("/services");
  }, [location.state, navigate, showError]);

  const handleBookingSuccess = async (bookingData) => {
    try {
      console.log("Booking submit data:", bookingData);

      if (bookingData.success) {
        showSuccess(bookingData.message || "Service booked successfully!");

        // Wait a bit for toast to show, then redirect to confirmation page
        setTimeout(() => {
          navigate("/booking/confirmation", {
            state: {
              booking: bookingData.booking,
            },
          });
        }, 1500);
      } else {
        showError(bookingData.message || "Failed to book service");
      }
    } catch (error) {
      console.error("Booking submit error:", error);
      showError("Failed to book service. Please try again.");
    }
  };

  const handleCancel = () => {
    // Navigate back to services page
    navigate("/services");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Service Not Found
          </h1>
          <button
            onClick={() => navigate("/services")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ServiceBookingForm
          service={service}
          onBookingSuccess={handleBookingSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default Booking;
