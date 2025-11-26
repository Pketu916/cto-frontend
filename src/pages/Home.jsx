import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  homeHero as HomeHero,
  BusinessSection,
  BlueprintSection,
  ServicesSection,
} from "../components/sections";
import { Footer } from "../components/navigation";
import { CTASection } from "../components/layout";
import { Button } from "../components/ui";
import { servicesAPI } from "../services/api";
import { useToast } from "../contexts/ToastContext";

const Home = () => {
  const navigate = useNavigate();
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
          const formattedServices = response.services
            .slice(0, 6)
            .map((service) => ({
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
          setServices([]);
        }
      } catch (error) {
        console.error("Error loading services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [showError]);

  return (
    <>
      <main>
        <HomeHero />
        {/* Services Section */}
        <section className="bg-gray-50 px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <ServicesSection
              services={services}
              loading={loading}
              showBookButton={true}
              showBookingForm={false}
            />
            {/* Explore All Services Button */}
            <div className="text-center mt-8 flex justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/services")}
                className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore All Services
                <svg
                  className="w-5 h-5 ml-2 inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </section>
        <section className="relative">
          <div className="max-w-6xl px-4 mx-auto pt-20">
            <BusinessSection />
          </div>
        </section>

        {/* <section className="bg-[#012939] py-16 px-6 lg:px-20">
          <JoinSection />
        </section> */}

        {/* CTA Section */}
        <CTASection
          title="Ready to Transform Your Healthcare Experience?"
          subtitle="Join thousands of patients who trust CTO India for their healthcare needs. Get started today with our comprehensive healthcare services."
          showServicesButton={true}
          showContactButton={true}
        />

        {/* <CollageSection /> */}
        {/* <CtaTestimonial /> */}
        <BlueprintSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
