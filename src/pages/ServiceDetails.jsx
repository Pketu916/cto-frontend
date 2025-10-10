import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Icon, Badge, FAQSection } from "../components/ui";
import { HeroSection, CTASection } from "../components/layout";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { ServiceBookingForm } from "../components/forms";
import { bookingsAPI } from "../services/api";

const ServiceDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { showSuccess, showError } = useToast();

  // Import services data
  useEffect(() => {
    import("../data/servicesData")
      .then(({ servicesData }) => {
        const foundService = servicesData.find((s) => s.slug === slug);
        if (foundService) {
          setService(foundService);
        } else {
          // Service not found, redirect to services page
          navigate("/services");
          return;
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback - redirect to services page if import fails
        navigate("/services");
      });
  }, [slug, navigate]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      showError("Please login to book this service");
      navigate("/login");
      return;
    }
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      console.log("Booking submit data:", bookingData);

      if (bookingData.success) {
        showSuccess(bookingData.message || "Service booked successfully!");
        setShowBookingForm(false);

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

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  // If booking form is open, show booking page
  if (showBookingForm && service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ServiceBookingForm
            service={service}
            onBookingSuccess={handleBookingSubmit}
            onCancel={handleCloseBookingForm}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Service Not Found
          </h1>
          <Button onClick={() => navigate("/services")}>
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Book Now Button */}
      <HeroSection
        title={service.title}
        subtitle={service.description}
        backgroundImage={service.image}
        buttonText="Book Now"
        buttonVariant="primary"
        buttonSize="lg"
        onButtonClick={handleBookNow}
        imageAlt={service.title}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Service Overview */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About This Service
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                {service.longDescription &&
                  service.longDescription
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={`${service.id}-paragraph-${index}`}
                        className="mb-6 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                {!service.longDescription && (
                  <p className="mb-6 leading-relaxed">
                    {service.description ||
                      "No detailed description available."}
                  </p>
                )}
              </div>
            </div>
            <div className="relative">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        {service.features && service.features.length > 0 && (
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Key Features
                </h2>
                <p className="text-lg text-gray-600">
                  Discover what makes our service stand out
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.features.map((feature, index) => (
                  <div
                    key={`${service.id}-feature-${index}`}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                  >
                    <div className="w-8 h-8 bg-[#83D915] bg-opacity-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Icon name="check" size="sm" className="text-[#83D915]" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing Information */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pricing Information
              </h2>
              <p className="text-lg text-gray-600">
                Transparent pricing with no hidden fees
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#012939]/80 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4 text-[#a0f92d]">
                  Standard Pricing
                </h3>
                <div className="text-4xl font-bold mb-4">
                  {service.estimatedPriceRange}
                </div>
                <p className="text-lg mb-6 opacity-90 text-white">
                  Contact us for detailed pricing based on your specific
                  requirements.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Icon name="check" size="sm" className="mr-3" />
                    No setup fees
                  </li>
                  <li className="flex items-center">
                    <Icon name="check" size="sm" className="mr-3" />
                    Flexible payment options
                  </li>
                  <li className="flex items-center">
                    <Icon name="check" size="sm" className="mr-3" />
                    Insurance accepted
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Get Custom Quote
                </h3>
                <p className="text-gray-600 mb-6">
                  Need a personalized quote? Our team will work with you to
                  create a pricing plan that fits your specific needs and
                  budget.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleBookNow}
                >
                  Request Custom Quote
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {service.faq && service.faq.length > 0 && (
          <FAQSection
            title="Frequently Asked Questions"
            subtitle="Get answers to common questions about this service"
            faqs={service.faq.map((item) => ({
              question: item.q,
              answer: item.a,
            }))}
            className="mb-16"
          />
        )}
      </div>

      {/* CTA Section */}
      <CTASection
        title="Ready to Get Started?"
        subtitle="Contact us today to book this service and experience world-class healthcare."
        buttonText="Book This Service"
        onButtonClick={handleBookNow}
      />
    </div>
  );
};

export default ServiceDetails;
