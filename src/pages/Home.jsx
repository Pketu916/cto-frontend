import React from "react";
import {
  homeHero as HomeHero,
  BusinessSection,
  BlueprintSection,
  ServicesSection,
} from "../components/sections";
import { Footer } from "../components/navigation";
import { CTASection } from "../components/layout";
import { servicesData } from "../data/servicesData";

const Home = () => {
  return (
    <>
      <main>
        <HomeHero />
        {/* Services Section */}
        <section className="bg-gray-50 px-4">
          <div className="max-w-7xl mx-auto">
            <ServicesSection
              services={servicesData.slice(0, 6)}
              loading={false}
              showBookButton={true}
              showBookingForm={true}
            />
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
