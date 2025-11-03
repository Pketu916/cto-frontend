import React, { useState, useMemo, useEffect, useRef } from "react";
import { ServiceGrid } from "../services";
import { Button } from "../ui";
import { ServiceBookingForm } from "../forms";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { bookingsAPI } from "../../services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const sectionRef = useRef(null);
  const { isAuthenticated, user } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  // Get unique categories from services
  const availableCategories = useMemo(() => {
    const categories = new Set();
    services.forEach((service) => {
      if (service.category) {
        categories.add(service.category);
      }
    });
    return Array.from(categories).map((cat) => ({
      value: cat,
      label: cat,
    }));
  }, [services]);

  // Filter services by category
  const filteredServices = useMemo(() => {
    if (selectedCategory === "all") return services;
    return services.filter((service) => service.category === selectedCategory);
  }, [services, selectedCategory]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  // Scroll to section top
  const scrollToSectionTop = () => {
    if (sectionRef.current) {
      const offset = 100; // Offset from top for better visibility
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToSectionTop();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      scrollToSectionTop();
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    scrollToSectionTop();
  };

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

  const handleBookingSubmit = (bookingResponse) => {
    // ServiceBookingForm handles the booking internally and calls this callback with the response
    if (bookingResponse.success) {
      showSuccess(bookingResponse.message || "Service booked successfully!");
      setShowForm(false);
      setSelectedService(null);
    } else {
      showError(bookingResponse.message || "Failed to book service");
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
            onBookingSuccess={handleBookingSubmit}
            onCancel={handleCloseBookingForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className={`pt-16 ${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-bold relative inline-block ">
          Choose Your{" "}
          <span className="relative inline-block">
            Service
            {/* underline svg */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-0 -bottom-2 w-full"
              viewBox="0 0 340 12"
              fill="none"
            >
              <path
                d="M2.02157 6.67507C59.3392 4.51664 116.939 4.73302 174.328 3.84915C225.628 3.05906 276.93 2.75644 328.24 2.36882C330.362 2.35278 336.552 1.98241 334.603 2.56927C328.79 4.31962 317.08 3.46496 311.52 3.62073C234.971 5.76542 158.303 4.80472 81.7124 6.00586C62.8847 6.30113 6.44803 10.8458 25.2248 9.86957C49.2136 8.62234 73.5295 6.28546 97.5684 5.90297C146.166 5.12971 194.761 5.00185 243.365 4.52532C254.575 4.41541 265.8 4.20438 277.013 4.2801"
                stroke="#6C4BC0"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get professional care services from our expert team
        </p>
      </div>

      {/* Category Filter */}
      {availableCategories.length > 0 && (
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Services ({services.length})
            </button>
            {availableCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? "bg-primary text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.label} (
                {services.filter((s) => s.category === category.value).length})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Services Grid or Loading/Empty States */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredServices.length > 0 ? (
        <>
          <ServiceGrid
            services={paginatedServices}
            onBookService={bookHandler}
            showBookButton={showBookButton}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      if (!showPage) {
                        // Show ellipsis
                        if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageClick(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} -{" "}
                {Math.min(endIndex, filteredServices.length)} of{" "}
                {filteredServices.length} services
              </p>
            </div>
          )}
        </>
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
