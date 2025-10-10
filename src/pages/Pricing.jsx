import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/navigation";
import { PageContainer, HeroSection } from "../components/layout";
import { Card, Button, FAQSection } from "../components/ui";
import { CTASection } from "../components/layout";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Basic Care",
      description: "Perfect for individuals and families",
      monthlyPrice: 299,
      yearlyPrice: 2999,
      features: [
        "Up to 5 medical consultations",
        "Basic health monitoring",
        "Standard appointment booking",
        "Mobile app access",
        "Health records storage",
        "Basic support",
      ],
      limitations: [
        "No home visits",
        "Limited specialist access",
        "Basic health analytics",
      ],
      popular: false,
      color: "blue",
    },
    {
      name: "Professional Care",
      description: "Ideal for comprehensive healthcare needs",
      monthlyPrice: 799,
      yearlyPrice: 7999,
      features: [
        "Unlimited medical consultations",
        "Priority support",
        "Home visits available",
        "Specialist doctor access",
        "Advanced health monitoring",
        "Family health management",
        "Emergency medical support",
        "Advanced health analytics",
        "Telehealth consultations",
      ],
      limitations: ["Limited international coverage", "Standard response time"],
      popular: true,
      color: "purple",
    },
    {
      name: "Enterprise Care",
      description: "For organizations and large families",
      monthlyPrice: 1999,
      yearlyPrice: 19999,
      features: [
        "Unlimited medical services",
        "24/7 dedicated medical support",
        "Premium healthcare facilities",
        "Corporate health solutions",
        "Advanced health & wellness tools",
        "Priority hospital admissions",
        "Multiple family members",
        "Real-time health monitoring",
        "All medical integrations",
        "Daily health checkups",
        "API access for businesses",
        "Multi-user family accounts",
      ],
      limitations: [],
      popular: false,
      color: "green",
    },
  ];

  const addOnServices = [
    {
      name: "Home Nursing Care",
      description: "Professional nursing services at home",
      price: 1500,
      features: [
        "Skilled nursing care",
        "Medication management",
        "Wound care",
        "Daily health monitoring",
      ],
    },
    {
      name: "Diagnostic Services",
      description: "Complete diagnostic testing at home",
      price: 2500,
      features: [
        "Blood tests",
        "ECG & X-ray",
        "Lab sample collection",
        "Report delivery",
      ],
    },
    {
      name: "Physical Therapy",
      description: "Professional physiotherapy services",
      price: 2000,
      features: [
        "Exercise therapy",
        "Pain management",
        "Rehabilitation programs",
        "Progress tracking",
      ],
    },
    {
      name: "Emergency Response",
      description: "24/7 emergency medical response",
      price: 5000,
      features: [
        "24/7 Emergency support",
        "Ambulance service",
        "Critical care transport",
        "Hospital coordination",
      ],
    },
  ];

  const faqs = [
    {
      question: "Can I change my healthcare plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
    {
      question: "How long is the free trial?",
      answer:
        "We offer a 7-day free trial for all healthcare plans. No credit card required.",
    },
    {
      question: "What is the cancellation policy?",
      answer:
        "You can cancel anytime. There are no cancellation fees. Remaining amount will be refunded.",
    },
    {
      question: "How do I get medical support?",
      answer:
        "We provide support through email, phone, live chat, and our mobile app. Enterprise customers get dedicated medical support.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept UPI, Credit/Debit Cards, Net Banking, and EMI options for healthcare services.",
    },
    {
      question: "Are your services available 24/7?",
      answer:
        "Yes, our emergency medical services are available 24/7. Regular consultations are available during business hours.",
    },
    {
      question: "Do you provide services across India?",
      answer:
        "Yes, our healthcare services are available in major cities across India. We are continuously expanding our coverage.",
    },
  ];

  const getPriceColor = (color) => {
    switch (color) {
      case "blue":
        return "from-blue-500 to-blue-600";
      case "purple":
        return "from-purple-500 to-purple-600";
      case "green":
        return "from-green-500 to-green-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getBorderColor = (color) => {
    switch (color) {
      case "blue":
        return "border-blue-200";
      case "purple":
        return "border-purple-200";
      case "green":
        return "border-green-200";
      default:
        return "border-gray-200";
    }
  };

  return (
    <>
      <PageContainer maxWidth="full" padding="none">
        {/* Hero Section */}
        <HeroSection
          title="Simple & Transparent Pricing"
          subtitle="Choose the perfect healthcare plan for you and your family. All plans include free trial and money-back guarantee."
          image="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop"
          imageAlt="Healthcare pricing illustration"
        />

        {/* Billing Toggle */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-center">
              <span
                className={`mr-3 ${
                  billingCycle === "monthly"
                    ? "text-gray-900 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() =>
                  setBillingCycle(
                    billingCycle === "monthly" ? "yearly" : "monthly"
                  )
                }
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === "yearly"
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`ml-3 ${
                  billingCycle === "yearly"
                    ? "text-gray-900 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Yearly
              </span>
              {billingCycle === "yearly" && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative p-8 ${
                    plan.popular
                      ? "ring-2 ring-purple-500 shadow-xl scale-105"
                      : ""
                  } ${getBorderColor(plan.color)}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-5xl font-bold text-gray-900">
                        ₹
                        {billingCycle === "monthly"
                          ? plan.monthlyPrice
                          : plan.yearlyPrice}
                      </span>
                      <span className="text-gray-600 ml-2">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    </div>

                    <Link
                      to="/register/user"
                      className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r ${getPriceColor(
                        plan.color
                      )} hover:opacity-90 transition-opacity duration-200`}
                    >
                      Get Started
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                      What's included:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Limitations:
                      </h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg
                              className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span className="text-gray-500 text-sm">
                              {limitation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Add-on Services */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Additional Services
              </h2>
              <p className="text-gray-600">
                Enhance your healthcare experience with these premium services
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOnServices.map((service, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {service.description}
                    </p>
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      ₹{service.price.toLocaleString()}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" variant="outline">
                    Add to Plan
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection
          title="Frequently Asked Questions"
          subtitle="Common questions about our healthcare pricing and plans"
          faqs={faqs}
        />

        <CTASection />
      </PageContainer>
      <Footer />
    </>
  );
};

export default Pricing;
