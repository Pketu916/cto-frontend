import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/navigation";
import { PageContainer, HeroSection, CTASection } from "../components/layout";
import { Card } from "../components/ui";
import {
  User,
  Heart,
  Building2,
  Shield,
  CheckCircle,
  FileText,
} from "lucide-react";

const Eligibility = () => {
  const eligibilityGroups = [
    {
      title: "NDIS Participants",
      description: "Self, plan, or agency-managed NDIS participants",
      icon: User,
      details: [
        "Self-managed NDIS participants",
        "Plan-managed NDIS participants",
        "Agency-managed NDIS participants",
        "All NDIS funding categories supported",
      ],
    },
    {
      title: "My Aged Care Recipients",
      description: "Home Care Package (HCP) recipients",
      icon: Heart,
      details: [
        "Level 1-4 Home Care Packages",
        "After-hours support needs",
        "Emergency care response",
        "Medication management support",
      ],
    },
    {
      title: "Private Members",
      description: "Private members and carers",
      icon: Shield,
      details: [
        "Private health insurance members",
        "Self-funded individuals",
        "Families and carers",
        "Private care arrangements",
      ],
    },
    {
      title: "SIL Providers & Participants",
      description: "Supported Independent Living providers and participants",
      icon: Building2,
      details: [
        "SIL provider organizations",
        "SIL participant individuals",
        "Group home residents",
        "Shared accommodation settings",
      ],
    },
    {
      title: "Government Programs",
      description: "Government and funded programs",
      icon: FileText,
      details: [
        "Medicare recipients",
        "WorkCover participants",
        "Department of Veterans' Affairs (DVA)",
        "Other government-funded programs",
      ],
    },
  ];

  const benefits = [
    "24/7 priority access to qualified health professionals",
    "Emergency and after-hours clinical support",
    "Psychosocial support services",
    "NDIS and My Aged Care aligned billing",
    "GPS-integrated staff dispatch",
    "Automated invoicing and reporting",
    "Digital service tracking",
    "Secure health information management",
  ];

  return (
    <>
      <PageContainer maxWidth="full" padding="none">
        <HeroSection
          title="MyCRT Eligibility"
          subtitle="MyCRT membership is available to a wide range of individuals and organizations seeking 24/7 care response services. Find out if you're eligible to join."
          image="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=600&fit=crop"
          imageAlt="Eligibility for care services"
        />

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Who Can Join MyCRT?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                MyCRT membership is designed to support various groups and
                individuals across Australia
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eligibilityGroups.map((group, index) => {
                const IconComponent = group.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {group.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {group.description}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {group.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Membership Benefits
              </h2>
              <p className="text-xl text-gray-600">
                All eligible members receive comprehensive benefits
              </p>
            </div>

            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <Card className="p-8 bg-primary/5">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-700 mb-6">
                If you're eligible for MyCRT membership, registration is simple
                and straightforward. Complete the online registration form,
                provide your care readiness information, and start accessing
                24/7 care response services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/membership"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  View Membership Options
                </Link>
                <Link
                  to="/register/user"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
                >
                  Register Now
                </Link>
              </div>
            </Card>
          </div>
        </section>

        <CTASection
          title="Questions About Eligibility?"
          subtitle="Our team is here to help you determine if MyCRT membership is right for you. Contact us today for more information."
          showServicesButton={false}
          showContactButton={true}
        />
      </PageContainer>
      <Footer />
    </>
  );
};

export default Eligibility;
