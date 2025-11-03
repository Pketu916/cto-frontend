import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/navigation";
import {
  PageContainer,
  PageHeader,
  CTASection,
  HeroSection,
} from "../components/layout";
import { Card } from "../components/ui";
import { ScrollCar } from "../components/sections";

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Chief Technology Officer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "15+ years experience in healthcare technology",
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      description: "Expert in healthcare operations and patient care",
    },
    {
      name: "Amit Patel",
      role: "Lead Developer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Specialist in healthcare technology solutions",
    },
    {
      name: "Sunita Gupta",
      role: "UI/UX Designer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "Expert in user-friendly healthcare interfaces",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Patients Served" },
    { number: "200+", label: "Healthcare Providers" },
    { number: "5+", label: "Years of Experience" },
    { number: "24/7", label: "Medical Support" },
  ];

  return (
    <>
      <PageContainer maxWidth="full" padding="none">
        {/* Hero Section */}
        <HeroSection
          title="About MyCRT"
          subtitle="MyCRT (My Care Response Team) is an innovative 24/7 Care Response and Membership-Based Support Service, purpose-built for NDIS Participants, My Aged Care recipients, carers, and families."
          image="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=600&fit=crop"
          imageAlt="MyCRT care response team"
        />

        {/* Scroll Car Animation Section */}
        {/* <section className="py-8 bg-gray-50">
          <ScrollCar className="max-w-7xl mx-auto" />
        </section> */}

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Our Mission
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    To deliver fast, reliable, and clinically guided care
                    response services that bridge the gap between planned
                    supports and real-time needs — reducing risks during crises,
                    breakdowns, or changes in circumstances.
                  </p>
                </div>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Our Vision
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We work together to make a difference in the lives of
                    vulnerable people by ensuring care, compassion, respect, and
                    trust are always available — anytime, anywhere.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section - Replacing Achievements */}
        <CTASection
          title="Our Achievements & Impact"
          subtitle="Join thousands of patients who trust CTO India for their healthcare needs. Experience our proven track record of excellence and innovation in healthcare delivery."
          showServicesButton={true}
          showContactButton={true}
        />

        {/* Team Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Team
              </h2>
              <p className="text-gray-600">
                Experienced healthcare professionals dedicated to transforming
                patient care
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="text-center p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-gray-600">
                Principles that guide our work and define our culture
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Compassion", color: "red" },
                { name: "Respect", color: "blue" },
                { name: "Trust", color: "green" },
                { name: "Reliability", color: "purple" },
                { name: "Dignity", color: "orange" },
                { name: "Safety", color: "indigo" },
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-16 h-16 bg-${value.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <span
                      className={`text-2xl font-bold text-${value.color}-600`}
                    >
                      {value.name[0]}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.name}
                  </h3>
                  <p className="text-gray-600">
                    Core value that guides our care response service delivery
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PageContainer>
      <Footer />
    </>
  );
};

export default About;
