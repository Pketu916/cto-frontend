import React, { useEffect, useMemo } from "react";
import { FileText, Filter } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { servicesData } from "../../data/servicesData";

const AdditionalInfoStep = ({ register, errors, service, setValue, watch }) => {
  // Get the selected category and service from the form
  const selectedCategory = watch("selectedCategory");
  const selectedServiceFromDropdown = watch("selectedServiceFromDropdown");

  // Get all unique categories from services (including services without categories)
  const allCategories = useMemo(() => {
    const categories = new Set();
    servicesData.forEach((s) => {
      if (s.category) {
        categories.add(s.category);
      }
    });
    return [
      { value: "all", label: "All Categories" },
      ...Array.from(categories)
        .sort()
        .map((cat) => ({ value: cat, label: cat })),
    ];
  }, []);

  // Filter services by selected category
  const filteredServiceOptions = useMemo(() => {
    let filtered = servicesData;
    if (selectedCategory && selectedCategory !== "all") {
      filtered = servicesData.filter((s) => s.category === selectedCategory);
    }
    return filtered.map((service) => ({
      value: service.id,
      label: service.title,
    }));
  }, [selectedCategory]);

  // Get all service options for the dropdown (always available)
  const allServiceOptions = useMemo(() => {
    return servicesData.map((service) => ({
      value: service.id,
      label: service.title,
    }));
  }, []);

  // Reset service selection when category changes
  useEffect(() => {
    if (selectedCategory && setValue) {
      setValue("selectedServiceFromDropdown", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Auto-fill service requirements when a service is selected
  useEffect(() => {
    if (selectedServiceFromDropdown && setValue) {
      const selectedService = servicesData.find(
        (s) => s.id === selectedServiceFromDropdown
      );
      if (selectedService) {
        // Auto-fill service requirements with a helpful description
        setValue(
          "serviceRequirements",
          `Requesting ${selectedService.title}: ${selectedService.shortDescription}`,
          { shouldValidate: true }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceFromDropdown]);

  // If a service is pre-selected, initialize the category and service dropdown
  useEffect(() => {
    if (
      service &&
      service.id &&
      service.category &&
      setValue &&
      !selectedCategory
    ) {
      setValue("selectedCategory", service.category);
      setValue("selectedServiceFromDropdown", service.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 flex items-center">
        <FileText className="w-4 h-4 mr-2 text-blue-600" />
        Service Selection & Additional Information
      </h3>

      {/* Service Selection Section - Always visible so users can select or change service */}
      <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
        {/* <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-900">
            Select Service Category & Service
          </h4>
        </div> */}

        {/* Show pre-selected service info if exists */}
        {/* {service && service.id && service.id !== "general-booking" && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 mb-1">
              <span className="font-semibold">Pre-selected Service:</span>{" "}
              {service.title}
            </p>
            <p className="text-xs text-blue-600">
              You can change this selection using the dropdowns below
            </p>
          </div>
        )} */}

        {/* Category Selection */}
        <div className="mb-3">
          <Select
            label="Select Service Category (Optional)"
            name="selectedCategory"
            options={allCategories}
            placeholder="Select 'All Categories' or choose a specific category"
            error={errors.selectedCategory?.message}
            {...register("selectedCategory")}
          />
        </div>

        {/* Service Selection - Always visible with all services by default */}
        <div className="mb-3">
          <Select
            label="Select Service"
            name="selectedServiceFromDropdown"
            required
            options={
              selectedCategory && selectedCategory !== "all"
                ? filteredServiceOptions
                : allServiceOptions
            }
            placeholder={
              selectedCategory && selectedCategory !== "all"
                ? filteredServiceOptions.length === 0
                  ? "No services available in this category"
                  : `Choose a service from ${selectedCategory}`
                : `Choose a service (${allServiceOptions.length} services available including all myCRT services)`
            }
            error={errors.selectedServiceFromDropdown?.message}
            disabled={
              selectedCategory &&
              selectedCategory !== "all" &&
              filteredServiceOptions.length === 0
            }
            {...register("selectedServiceFromDropdown", {
              required: "Please select a service",
            })}
          />
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-gray-500 mt-1">
              Services loaded: {allServiceOptions.length} | Filtered:{" "}
              {selectedCategory && selectedCategory !== "all"
                ? filteredServiceOptions.length
                : allServiceOptions.length}
            </p>
          )}
        </div>

        {selectedCategory &&
          selectedCategory !== "all" &&
          filteredServiceOptions.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              No services available in this category. Please select "All
              Categories" or choose a different category.
            </p>
          )}
      </div>

      {/* Show selected service details if service is selected */}
      {selectedServiceFromDropdown && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          {(() => {
            const selectedService = servicesData.find(
              (s) => s.id === selectedServiceFromDropdown
            );
            return selectedService ? (
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 text-base mb-1">
                      {selectedService.title}
                    </h4>
                    <p className="text-xs text-blue-700 mb-2">
                      {selectedService.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {selectedService.category && (
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-blue-800 border border-blue-200">
                      📁 {selectedService.category}
                    </span>
                  )}
                  {(selectedService.basePrice ||
                    selectedService.estimatedPriceRange) && (
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-green-700 border border-green-200">
                      💰{" "}
                      {selectedService.estimatedPriceRange ||
                        (selectedService.basePrice
                          ? `₹${selectedService.basePrice.toLocaleString(
                              "en-IN"
                            )}${
                              selectedService.priceUnit
                                ? ` ${selectedService.priceUnit}`
                                : ""
                            }`
                          : "Contact for pricing")}
                    </span>
                  )}
                  {selectedService.insuranceAvailable && (
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-purple-700 border border-purple-200">
                      🛡️ Insurance Available
                    </span>
                  )}
                </div>

                {selectedService.features &&
                  selectedService.features.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs font-semibold text-blue-800 mb-2">
                        Key Features:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.features
                          .slice(0, 4)
                          .map((feature, idx) => (
                            <span
                              key={idx}
                              className="bg-white px-2 py-1 rounded text-xs text-blue-700 border border-blue-200"
                            >
                              ✓ {feature}
                            </span>
                          ))}
                        {selectedService.features.length > 4 && (
                          <span className="bg-white px-2 py-1 rounded text-xs text-blue-600 border border-blue-200">
                            +{selectedService.features.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ) : null;
          })()}
        </div>
      )}

      <Input
        label="Service Requirements"
        name="serviceRequirements"
        placeholder="Describe the service requirements or details needed"
        error={errors.serviceRequirements?.message}
        required
        {...register("serviceRequirements")}
      />

      <Input
        label="Additional Notes (Optional)"
        name="notes"
        placeholder="Any additional information or special instructions"
        error={errors.notes?.message}
        {...register("notes")}
      />
    </div>
  );
};

export default AdditionalInfoStep;
