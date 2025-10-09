import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Badge from "../ui/Badge";

const ServiceTabs = ({ service, activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab service={service} />;
      case "features":
        return <FeaturesTab service={service} />;
      case "pricing":
        return <PricingTab service={service} />;
      case "faq":
        return <FaqTab service={service} />;
      default:
        return <OverviewTab service={service} />;
    }
  };

  return (
    <>
      {/* Tabs Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderTabContent()}
      </div>
    </>
  );
};

// Overview Tab Component
const OverviewTab = ({ service }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2">
      <Card padding="lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Service Overview
        </h2>
        <div className="prose prose-lg max-w-none">
          {service.longDescription &&
            service.longDescription.split("\n\n").map((paragraph, index) => (
              <p
                key={`${service.id}-paragraph-${index}`}
                className="text-gray-600 mb-4 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          {!service.longDescription && (
            <p className="text-gray-600 mb-4 leading-relaxed">
              {service.description || "No detailed description available."}
            </p>
          )}
        </div>
      </Card>
    </div>

    <div className="space-y-6">
      {/* Contact Card */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Get Started
        </h3>

        <Button variant="primary" size="md" className="w-full mt-6">
          Contact Us Now
        </Button>
      </Card>

      {/* Quick Info */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Info</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Price Range:</span>
            <span className="font-semibold text-green-600">
              {service.estimatedPriceRange}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Availability:</span>
            <span className="font-semibold text-green-600">24/7</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Response Time:</span>
            <span className="font-semibold text-blue-600">Immediate</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

// Features Tab Component
const FeaturesTab = ({ service }) => (
  <Card padding="lg">
    <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {service.features.map((feature, index) => (
        <div
          key={`${service.id}-feature-${index}`}
          className="flex items-start"
        >
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="check" size="sm" className="text-blue-600" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-gray-700 font-medium">{feature}</p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Pricing Tab Component
const PricingTab = ({ service }) => (
  <Card padding="lg">
    <h2 className="text-2xl font-bold text-gray-900 mb-8">
      Pricing Information
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Standard Pricing
        </h3>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {service.estimatedPriceRange}
        </div>
        <p className="text-gray-600 mb-4">
          Transparent pricing with no hidden fees. Contact us for detailed
          pricing based on your specific requirements.
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center">
            <Icon name="check" size="sm" className="text-green-500 mr-2" />
            No setup fees
          </li>
          <li className="flex items-center">
            <Icon name="check" size="sm" className="text-green-500 mr-2" />
            Flexible payment options
          </li>
          <li className="flex items-center">
            <Icon name="check" size="sm" className="text-green-500 mr-2" />
            Insurance accepted
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Get Custom Quote
        </h3>
        <p className="text-gray-600 mb-4">
          Need a personalized quote? Our team will work with you to create a
          pricing plan that fits your specific needs and budget.
        </p>
        <Button variant="primary" size="md" className="w-full">
          Request Custom Quote
        </Button>
      </div>
    </div>
  </Card>
);

// FAQ Tab Component
const FaqTab = ({ service }) => (
  <Card padding="lg">
    <h2 className="text-2xl font-bold text-gray-900 mb-8">
      Frequently Asked Questions
    </h2>
    <div className="space-y-6">
      {service.faq.map((item, index) => (
        <div
          key={`${service.id}-faq-${index}`}
          className="border-b border-gray-200 pb-6 last:border-b-0"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.q}</h3>
          <p className="text-gray-600 leading-relaxed">{item.a}</p>
        </div>
      ))}
    </div>
  </Card>
);

export default ServiceTabs;
