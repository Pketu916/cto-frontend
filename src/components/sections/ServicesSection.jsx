import React, { useState } from "react";
import { ServiceGrid } from "../services";
import { Button } from "../ui";
import { ServiceBookingForm } from "../forms";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { bookingsAPI } from "../../services/api";

const ServicesSection = ({
  services = [],
  loading = false,
  onBookService,
  showBookButton = true,
  className = "",
  showBookingForm = true, // New prop to control booking form display
}) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  // Internal booking handler if no external handler provided
  const handleBookService = (service) => {
    if (!isAuthenticated) {
      showError("Please login to book a service");
      navigate("/login");
      return;
    }

    setSelectedService(service);
    if (showBookingForm) {
      setShowForm(true);
    } else {
      // Use external handler if provided
      onBookService?.(service);
    }
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      const result = await bookingsAPI.createBooking({
        ...bookingData,
        serviceId: selectedService.id,
        userId: user.id,
      });

      if (result.success) {
        showSuccess("Service booked successfully!");
        setShowForm(false);
        setSelectedService(null);
      } else {
        showError(result.message || "Failed to book service");
      }
    } catch (error) {
      showError("Failed to book service. Please try again.");
    }
  };

  const handleCloseBookingForm = () => {
    setShowForm(false);
    setSelectedService(null);
  };

  // Use external handler if provided, otherwise use internal
  const bookHandler = onBookService || handleBookService;

  // If booking form is open, show booking form
  if (showForm && selectedService && showBookingForm) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <ServiceBookingForm
            service={selectedService}
            onSubmit={handleBookingSubmit}
            onCancel={handleCloseBookingForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`py-16 ${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-bold relative inline-block ">
          Choose Your{" "}
          <span className="relative inline-block">
            Healthcare
            {/* underline svg */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-0 -bottom-2 w-full"
              viewBox="0 0 340 12"
              fill="none"
            >
              <path
                d="M2.02157 6.67507C59.3392 4.51664 116.939 4.73302 174.328 3.84915C225.628 3.05906 276.93 2.75644 328.24 2.36882C330.362 2.35278 336.552 1.98241 334.603 2.56927C328.79 4.31962 317.08 3.46496 311.52 3.62073C234.971 5.76542 158.303 4.80472 81.7124 6.00586C62.8847 6.30113 6.44803 10.8458 25.2248 9.86957C49.2136 8.62234 73.5295 6.28546 97.5684 5.90297C146.166 5.12971 194.761 5.00185 243.365 4.52532C254.575 4.41541 265.8 4.20438 277.013 4.2801"
                stroke="#83D915"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>{" "}
          Service
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get professional healthcare services from our expert medical team
        </p>
      </div>

      {/* Services Grid or Loading/Empty States */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : services.length > 0 ? (
        <ServiceGrid
          services={services}
          onBookService={bookHandler}
          showBookButton={showBookButton}
        />
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Services Available
          </h3>
          <p className="text-gray-600 mb-4">
            We're working on adding more services for you
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicesSection;
