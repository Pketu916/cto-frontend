import React, { useEffect, useMemo, useState } from "react";
import { FileText, Filter, Loader2 } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { servicesAPI } from "../../services/api";
import { formatAUD, formatPriceRange } from "../../utils/pricingUtils";
import { useToast } from "../../contexts/ToastContext";

const AdditionalInfoStep = ({ register, errors, service, setValue, watch }) => {
  const { showError } = useToast();
  const [servicesList, setServicesList] = useState([]);
  const [uniqueServiceIds, setUniqueServiceIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
  const [loadingServiceDetails, setLoadingServiceDetails] = useState(false);

  // Get the selected category and service from the form
  const selectedCategory = watch("selectedCategory");
  const selectedServiceId = watch("selectedServiceId");

  // Load unique Service IDs on component mount
  useEffect(() => {
    const loadUniqueServiceIds = async () => {
      try {
        setLoading(true);
        const response = await servicesAPI.getUniqueServiceIds();
        if (response.success) {
          setUniqueServiceIds(response.services || []);
        } else {
          showError("Failed to load services. Please try again.");
        }
      } catch (error) {
        console.error("Error loading unique service IDs:", error);
        showError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUniqueServiceIds();
  }, [showError]);

  // Get all unique categories for dropdown
  const allCategories = useMemo(() => {
    const categorySet = new Set();
    uniqueServiceIds.forEach((s) => {
      if (s.category) {
        categorySet.add(s.category);
      }
    });
    return [
      { value: "all", label: "All Categories" },
      ...Array.from(categorySet).map((cat) => ({ value: cat, label: cat })),
    ];
  }, [uniqueServiceIds]);

  // Filter unique Service IDs by selected category
  const filteredServiceIdOptions = useMemo(() => {
    let filtered = uniqueServiceIds;
    if (selectedCategory && selectedCategory !== "all") {
      filtered = uniqueServiceIds.filter(
        (s) => s.category === selectedCategory
      );
    }
    return filtered.map((service) => ({
      value: service.serviceId,
      label: `${service.serviceId} - ${service.name}`,
      category: service.category,
      service: service,
    }));
  }, [selectedCategory, uniqueServiceIds]);

  // Get all Service ID options for the dropdown (always available)
  const allServiceIdOptions = useMemo(() => {
    return uniqueServiceIds.map((service) => ({
      value: service.serviceId,
      label: `${service.serviceId} - ${service.name}`,
      category: service.category,
      service: service,
    }));
  }, [uniqueServiceIds]);

  // Reset service selection when category changes
  useEffect(() => {
    if (selectedCategory && setValue) {
      setValue("selectedServiceId", "");
      setSelectedServiceDetails(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // When Service ID is selected, show basic info
  useEffect(() => {
    if (selectedServiceId && uniqueServiceIds.length > 0) {
      const selectedService = uniqueServiceIds.find(
        (s) => s.serviceId === selectedServiceId
      );
      if (selectedService) {
        setSelectedServiceDetails({
          serviceId: selectedService.serviceId,
          name: selectedService.name,
          category: selectedService.category,
          unit: selectedService.unit,
          quote: selectedService.quote,
          type: selectedService.type,
        });

        // Auto-fill service requirements
        setValue(
          "serviceRequirements",
          `Requesting ${selectedService.name}${
            selectedService.category ? ` (${selectedService.category})` : ""
          }`,
          { shouldValidate: true }
        );
      }
    } else {
      setSelectedServiceDetails(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceId, uniqueServiceIds]);

  // If a service is pre-selected, initialize the category and service dropdown
  useEffect(() => {
    if (
      service &&
      service.serviceId &&
      service.category &&
      setValue &&
      !selectedCategory &&
      uniqueServiceIds.length > 0
    ) {
      setValue("selectedCategory", service.category);
      setValue("selectedServiceId", service.serviceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, uniqueServiceIds]);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 flex items-center">
        <FileText className="w-4 h-4 mr-2 text-blue-600" />
        Service Selection & Additional Information
      </h3>

      {/* Service Selection Section */}
      <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-900">
            Select Service Category & Service
          </h4>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading services...</span>
          </div>
        ) : (
          <>
            {/* Category Selection */}
            <div className="mb-3">
              <Select
                label="Select Service Category"
                name="selectedCategory"
                options={allCategories}
                placeholder="Select 'All Categories' or choose a specific category"
                error={errors.selectedCategory?.message}
                {...register("selectedCategory")}
              />
              {categories.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {categories.length} categories available
                </p>
              )}
            </div>

            {/* Service ID Selection */}
            <div className="mb-3">
              <Select
                label="Select Service ID"
                name="selectedServiceId"
                required
                options={
                  selectedCategory && selectedCategory !== "all"
                    ? filteredServiceIdOptions
                    : allServiceIdOptions
                }
                placeholder={
                  selectedCategory && selectedCategory !== "all"
                    ? filteredServiceIdOptions.length === 0
                      ? "No services available in this category"
                      : `Choose a Service ID from ${selectedCategory} (${filteredServiceIdOptions.length} available)`
                    : `Choose a Service ID (${allServiceIdOptions.length} services available)`
                }
                error={errors.selectedServiceId?.message}
                disabled={
                  loading ||
                  (selectedCategory &&
                    selectedCategory !== "all" &&
                    filteredServiceIdOptions.length === 0)
                }
                {...register("selectedServiceId", {
                  required: "Please select a Service ID",
                })}
              />
              {selectedCategory && selectedCategory !== "all" && (
                <p className="text-xs text-gray-500 mt-1">
                  {filteredServiceIdOptions.length} service(s) in this category
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Note: After selecting Service ID, please proceed to select date
                and time to see exact price and Support Item Number.
              </p>
            </div>

            {selectedCategory &&
              selectedCategory !== "all" &&
              filteredServiceIdOptions.length === 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    No services available in this category. Please select "All
                    Categories" or choose a different category.
                  </p>
                </div>
              )}
          </>
        )}
      </div>

      {/* Show selected Service ID details */}
      {selectedServiceId && selectedServiceDetails && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-blue-900 text-base mb-1">
                Service ID: {selectedServiceDetails.serviceId}
              </h4>
              <p className="text-sm text-blue-700 font-medium">
                {selectedServiceDetails.name}
              </p>
              {selectedServiceDetails.category && (
                <p className="text-sm text-blue-700">
                  Category: {selectedServiceDetails.category}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {selectedServiceDetails.category && (
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-blue-800 border border-blue-200">
                  📁 {selectedServiceDetails.category}
                </span>
              )}
              {selectedServiceDetails.unit && (
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                  Unit: {selectedServiceDetails.unit}
                </span>
              )}
              {selectedServiceDetails.quote && (
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-orange-700 border border-orange-200">
                  Quote: {selectedServiceDetails.quote}
                </span>
              )}
              {selectedServiceDetails.type && (
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-purple-700 border border-purple-200">
                  Type: {selectedServiceDetails.type}
                </span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> Please proceed to select date and time in
                the next step to see the exact price and Support Item Number for
                this service.
              </p>
            </div>
          </div>
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
