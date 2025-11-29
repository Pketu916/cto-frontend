import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/navigation";
import { PageContainer, HeroSection, CTASection } from "../components/layout";
import { Card, Button, FAQSection } from "../components/ui";
import { CheckCircle, Users, Home, Building2, Heart } from "lucide-react";
import MembershipForm from "../components/forms/MembershipForm";

const Membership = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const membershipPlans = [
    {
      name: "Individual",
      description: "Perfect for individuals seeking 24/7 care response access",
      annualFee: 1500,
      icon: Users,
      color: "blue",
      features: [
        "1 free call-out per month (1 hr max)",
        "24/7 priority response access",
        "Discounted rates on extra call-outs",
        "Online booking dashboard access",
        "Live job tracking",
        "Automated invoicing",
        "NDIS & My Aged Care aligned billing",
        "Digital service sign-off",
      ],
      popular: false,
    },
    {
      name: "Household",
      description: "Ideal for families and households (up to 4 people)",
      annualFee: 2500,
      icon: Home,
      color: "purple",
      features: [
        "1 free call-out per month per household",
        "Coverage for up to 4 family members",
        "24/7 priority response access",
        "Discounted rates on extra call-outs",
        "Shared booking dashboard",
        "Family health records tracking",
        "Priority support during emergencies",
        "Automated invoicing",
      ],
      popular: true,
    },
    {
      name: "SIL Provider",
      description:
        "Comprehensive access for all residents in Supported Independent Living",
      annualFee: 5000,
      icon: Building2,
      color: "green",
      features: [
        "Access for all residents",
        "Unlimited call-outs (per NDIS pricing)",
        "24/7 priority response access",
        "Bulk booking capabilities",
        "Provider dashboard access",
        "Automated invoicing per resident",
        "Priority dispatch during crises",
        "Provider support portal",
      ],
      popular: false,
    },
    {
      name: "SIL Participant",
      description: "Individual access through provider membership",
      annualFee: 1000,
      icon: Heart,
      color: "orange",
      features: [
        "Access through provider membership",
        "1 free call-out per month",
        "24/7 priority response access",
        "Personal booking dashboard",
        "Live job tracking",
        "Automated invoicing",
        "NDIS aligned billing",
        "Digital service sign-off",
      ],
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "What is included in the free call-out?",
      answer:
        "Each membership includes 1 free call-out per month (up to 1 hour maximum). Additional hours or call-outs are billed according to the NDIS Price Guide 2025–26 or My Aged Care item codes at discounted member rates.",
    },
    {
      question: "Can I change my membership plan later?",
      answer:
        "Yes, you can upgrade or downgrade your membership plan at any time. Changes take effect immediately, and any prorated amounts will be adjusted accordingly.",
    },
    {
      question: "What happens if I exceed my free call-out?",
      answer:
        "Extra call-outs or extended hours beyond your free monthly allocation are billed per the NDIS Price Guide 2025–26 or My Aged Care price guide at discounted member rates. All charges are transparent and automated.",
    },
    {
      question: "Is membership refundable?",
      answer:
        "Membership fees are annual and non-refundable, but you can cancel anytime. Access continues until the end of your current membership period.",
    },
    {
      question: "How quickly can I access services after joining?",
      answer:
        "Once your membership is activated and health assessments are completed, you can immediately start booking services through our 24/7 online dashboard or call centre.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept credit card payments, NDIS plan manager claims, and My Aged Care package claims. All billing is automated and aligned with relevant funding guidelines.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "No hidden fees. Your annual membership includes everything listed. Additional services beyond your free monthly call-out are billed transparently according to NDIS or My Aged Care pricing guides.",
    },
    {
      question: "Can I use MyCRT services outside business hours?",
      answer:
        "Yes! MyCRT is a 24/7 service. Members get priority access to emergency and after-hours care response services whenever support staff are unavailable or urgent assistance is required.",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        gradient: "from-blue-500 to-blue-600",
        border: "border-blue-200",
        bg: "bg-blue-50",
      },
      purple: {
        gradient: "from-purple-500 to-purple-600",
        border: "border-purple-200",
        bg: "bg-purple-50",
      },
      green: {
        gradient: "from-green-500 to-green-600",
        border: "border-green-200",
        bg: "bg-green-50",
      },
      orange: {
        gradient: "from-orange-500 to-orange-600",
        border: "border-orange-200",
        bg: "bg-orange-50",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      <PageContainer maxWidth="full" padding="none">
        {/* Hero Section */}
        <HeroSection
          title="MyCRT Membership Options"
          subtitle="Choose the membership plan that best fits your needs. All plans include 24/7 priority response access, discounted rates, and seamless billing aligned with NDIS and My Aged Care guidelines."
          image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
          imageAlt="Healthcare membership"
        />

        {/* Membership Plans */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your Membership Plan
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                All memberships include 24/7 priority response access and
                discounted rates on additional services
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {membershipPlans.map((plan, index) => {
                const IconComponent = plan.icon;
                const colorClasses = getColorClasses(plan.color);
                return (
                  <Card
                    key={index}
                    className={`relative p-8 ${
                      plan.popular
                        ? `ring-2 ring-${plan.color}-500 shadow-xl scale-105`
                        : ""
                    } ${colorClasses.border}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span
                          className={`bg-${plan.color}-500 text-white px-4 py-1 rounded-full text-sm font-semibold`}
                        >
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <div
                        className={`w-16 h-16 ${colorClasses.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <IconComponent
                          className={`w-8 h-8 text-${plan.color}-600`}
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6">
                        {plan.description}
                      </p>

                      <div className="mb-6">
                        <span className="text-5xl font-bold text-gray-900">
                          ${plan.annualFee.toLocaleString()}
                        </span>
                        <span className="text-gray-600 ml-2">/year</span>
                      </div>

                      <button
                        onClick={() => setShowForm(true)}
                        className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r ${colorClasses.gradient} hover:opacity-90 transition-opacity duration-200`}
                      >
                        Get Started
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        What's included:
                      </h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 text-center">
                <strong>Note:</strong> Extra call-outs or extended hours beyond
                your free monthly allocation are billed per the NDIS Price Guide
                2025–26 or My Aged Care price guide at discounted member rates.
                Membership provides 24/7 priority response access and discounted
                rates.
              </p>
            </div>
          </div>
        </section>

        {/* Membership Form */}
        {showForm && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <button
                  onClick={() => setShowForm(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to Membership Plans
                </button>
              </div>
              <MembershipForm
                onSuccess={(data) => {
                  console.log("Membership submitted:", data);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </section>
        )}

        {/* Registration Process */}
        {!showForm && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Membership Registration Process
                </h2>
                <p className="text-xl text-gray-600">
                  Simple steps to get started with MyCRT
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Step 1: Complete Online Registration
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Fill out our online registration form with your basic
                    information and membership plan selection.
                  </p>
                </Card>

                <Card className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Step 2: Provide Care Readiness Information
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Medical history and care needs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Consent for health information exchange</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Next of kin and emergency contact</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Home risk assessment and medication plan</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Participant ID (NDIS, My Aged Care, etc.)</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Step 3: Review & Sign Service Agreement
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Review and sign the MyCRT Service Agreement. All data is
                    securely stored and handled under our Privacy &
                    Confidentiality Policy in compliance with the Australian
                    Privacy Principles (APP).
                  </p>
                </Card>

                <Card className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Step 4: Receive Login Access
                  </h3>
                  <p className="text-gray-600">
                    Once your registration is complete and membership is
                    activated, you'll receive login access to track bookings,
                    invoices, and care reports through your personal dashboard.
                  </p>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {!showForm && (
          <>
            <FAQSection
              title="Membership Frequently Asked Questions"
              subtitle="Common questions about MyCRT membership plans and benefits"
              faqs={faqs}
            />

            <CTASection
              title="Ready to Join MyCRT?"
              subtitle="Become a member today and get 24/7 priority access to qualified health professionals. Register now and start your care response journey."
              showServicesButton={false}
              showContactButton={true}
            />
          </>
        )}
      </PageContainer>
      <Footer />
    </>
  );
};

export default Membership;
