import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/navigation";
import { PageContainer, HeroSection, CTASection } from "../components/layout";
import { Card } from "../components/ui";
import {
  UserPlus,
  Calendar,
  Navigation,
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Member Onboarding & Registration",
      description:
        "Participants, carers, SIL providers, or families register online. Complete health and risk assessments once during onboarding. Receive login portal access to booking, invoicing, and service tracking.",
      icon: UserPlus,
      features: [
        "Online registration process",
        "Health and risk assessments",
        "Secure login portal access",
        "Service tracking capabilities",
      ],
    },
    {
      number: "02",
      title: "Online or App-Based Service Booking",
      description:
        "Members can request immediate call-out support. The system automatically allocates the nearest qualified staff (RN, EN, Paramedic, Support Worker, etc.) based on triage and GPS mapping.",
      icon: Calendar,
      features: [
        "24/7 online booking dashboard",
        "Automatic staff allocation",
        "GPS-integrated dispatch",
        "Real-time availability",
      ],
    },
    {
      number: "03",
      title: "Care Response & Job Completion",
      description:
        "MyCRT Mobile Unit responds to the participant's location. Staff complete the intervention and update the job record. The GPS indicator turns red → green when completed. The participant digitally signs off the service.",
      icon: Navigation,
      features: [
        "GPS tracking (red → green)",
        "Live job status updates",
        "Digital signature verification",
        "Real-time location tracking",
      ],
    },
    {
      number: "04",
      title: "Billing & Payment",
      description:
        "Invoices are automatically generated under the relevant NDIS Price Guide 2025–26 or My Aged Care item code. Payments can be made by credit card, NDIS plan manager, or aged care package claim.",
      icon: CreditCard,
      features: [
        "Automated invoice generation",
        "NDIS & My Aged Care aligned billing",
        "Multiple payment options",
        "Secure payment gateway",
      ],
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "24/7 Availability",
      description:
        "Round-the-clock care response service for emergency and after-hours support",
    },
    {
      icon: MapPin,
      title: "GPS-Integrated Dispatch",
      description:
        "Nearest qualified staff automatically allocated based on location and availability",
    },
    {
      icon: MessageSquare,
      title: "Live Tracking",
      description:
        "Real-time job tracking with color-coded status indicators (red → green)",
    },
    {
      icon: FileText,
      title: "Digital Signatures",
      description:
        "Secure e-signature verification for service completion and billing",
    },
    {
      icon: Phone,
      title: "Multiple Booking Methods",
      description:
        "Book through online dashboard, mobile app, or 24/7 call centre",
    },
    {
      icon: CheckCircle,
      title: "Automated Invoicing",
      description:
        "NDIS and My Aged Care aligned billing with automatic invoice generation",
    },
  ];

  return (
    <>
      <PageContainer maxWidth="full" padding="none">
        {/* Hero Section */}
        <HeroSection
          title="How MyCRT Works"
          subtitle="A seamless, technology-driven care response service that connects you with qualified health professionals whenever you need support - 24/7, anywhere in Australia."
          image="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=600&fit=crop"
          imageAlt="Care response team"
        />

        {/* Main Steps */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Simple 4-Step Process
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From registration to service completion, MyCRT makes care
                response accessible and efficient
              </p>
            </div>

            <div className="space-y-16">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={index}
                    className={`grid md:grid-cols-2 gap-12 items-center ${
                      index % 2 === 1 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
                      <Card className="p-8 h-full hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-start gap-6 mb-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                              {step.number}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <IconComponent className="w-8 h-8 text-primary" />
                              <h3 className="text-2xl font-bold text-gray-900">
                                {step.title}
                              </h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-6">
                              {step.description}
                            </p>
                            <ul className="space-y-3">
                              {step.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    </div>
                    <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                      <div className="relative">
                        <div className="aspect-video bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-24 h-24 text-white opacity-50" />
                        </div>
                        {index < steps.length - 1 && (
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                            <div className="w-1 h-16 bg-primary"></div>
                            <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                              <div className="w-4 h-4 bg-primary rounded-full"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technology Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Technology Integration
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The MyCRT app and web system feature advanced technology for
                seamless care delivery
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-shadow duration-300 text-center"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why MyCRT Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why MyCRT Exists
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                In many care environments, urgent or unplanned support needs can
                arise
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Common Scenarios Requiring Immediate Support
                </h3>
                <ul className="space-y-3">
                  {[
                    "Carer or staff illness or absence",
                    "Safety, behavioural, or security incidents",
                    "Medical or psychiatric emergencies",
                    "Homelessness or accommodation breakdowns",
                    "Medication or nursing care requirements after hours",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 bg-primary/5">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  MyCRT Solution
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  MyCRT provides the complete solution — an integrated care
                  response service that can be activated instantly through the
                  MyCRT Online Booking App or 24/7 call centre, connecting you
                  with qualified health professionals.
                </p>
                <Link
                  to="/membership"
                  className="inline-flex items-center text-primary font-semibold hover:underline"
                >
                  Learn about Membership →
                </Link>
              </Card>
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Experience MyCRT?"
          subtitle="Join the MyCRT Member Network today and get 24/7 priority access to qualified health professionals. Register now to get started."
          showServicesButton={false}
          showContactButton={true}
        />
      </PageContainer>
      <Footer />
    </>
  );
};

export default HowItWorks;
