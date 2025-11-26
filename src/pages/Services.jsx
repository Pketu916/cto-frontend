import React, { useState, useEffect } from "react";
import { HeroSection, PageContainer, CTASection } from "../components/layout";
import { ServicesSection } from "../components/sections";
import { Footer } from "../components/ui";
import { servicesAPI } from "../services/api";
import { useToast } from "../contexts/ToastContext";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  // Fetch unique service IDs from backend
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const response = await servicesAPI.getUniqueServiceIds();

        if (
          response.success &&
          response.services &&
          Array.isArray(response.services)
        ) {
          // Convert backend service format to frontend card format
          const formattedServices = response.services.map((service) => ({
            id: service.serviceId,
            title: service.name,
            name: service.name,
            category: service.category,
            description: `${service.name} - ${service.category || "Service"}`,
            shortDescription: service.name,
            image:
              "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
            estimatedPriceRange: "Price varies by condition",
            serviceId: service.serviceId,
            unit: service.unit,
            quote: service.quote,
            type: service.type,
          }));

          setServices(formattedServices);
        } else {
          showError("Failed to load services");
          setServices([]);
        }
      } catch (error) {
        console.error("Error loading services:", error);
        showError("Failed to load services. Please check your connection.");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [showError]);

  const handleGetStarted = () => {
    console.log("Get Started clicked");
    // You can add navigation logic here
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroSection
        title={
          <>
            Our{" "}
            <span className="relative inline-block">
              Services
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
          </>
        }
        subtitle="Complete care solutions for you and your family"
        backgroundImage="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&h=800&fit=crop"
      />

      <PageContainer>
        <ServicesSection
          services={services}
          loading={loading}
          showBookButton={true}
          showBookingForm={false}
        />
      </PageContainer>

      <CTASection
        title="Ready to Get Started?"
        subtitle="Join thousands of participants who trust CTO India for their care needs. Book your service today and experience world-class care."
        showServicesButton={false}
        showContactButton={true}
      />

      <Footer />
    </div>
  );
};

export default Services;
