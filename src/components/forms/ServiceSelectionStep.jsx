import React, { useEffect, useMemo, useState } from "react";
import { FileText, Filter, Loader2, CheckCircle, Plus, X } from "lucide-react";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { servicesAPI } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

const ServiceSelectionStep = ({
  register,
  errors,
  service,
  setValue,
  watch,
  selectedServices = [],
  onServicesChange,
  touchedFields = {},
  isSubmitted = false,
}) => {
  // Helper to check if error should be shown
  const shouldShowError = (fieldName) => {
    return (touchedFields[fieldName] || isSubmitted) && errors[fieldName];
  };
  const { showError, showSuccess } = useToast();
  const [uniqueServiceIds, setUniqueServiceIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
  const [multipleServices, setMultipleServices] = useState(
    selectedServices || []
  );

  const selectedCategory = watch("selectedCategory");
  const selectedServiceId = watch("selectedServiceId");

  // Load unique Service IDs on component mount
  useEffect(() => {
    const loadUniqueServiceIds = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching unique service IDs from API...");

        const response = await servicesAPI.getUniqueServiceIds();

        console.log("✅ API Response received:", {
          success: response.success,
          servicesCount: response.services?.length,
          count: response.count,
          hasServices: !!response.services,
          isArray: Array.isArray(response.services),
        });

        if (
          response.success &&
          response.services &&
          Array.isArray(response.services)
        ) {
          // Ensure all services have required fields
          const validServices = response.services.filter(
            (s) => s && s.serviceId && s.name
          );
          console.log("✅ Valid services loaded:", validServices.length);
          console.log("📋 Sample service:", validServices[0]);

          if (validServices.length === 0) {
            console.warn("⚠️ No valid services found after filtering");
            showError("No valid services found. Please check backend data.");
          } else {
            setUniqueServiceIds(validServices);
          }
        } else {
          console.error("❌ API response not successful or invalid:", response);
          showError("Failed to load services. Invalid response from server.");
          setUniqueServiceIds([]);
        }
      } catch (error) {
        console.error("❌ Error loading unique service IDs:", error);
        console.error("📋 Error details:", {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            method: error.config?.method,
          },
        });

        let errorMessage =
          "Failed to load services. Please check your connection and try again.";
        if (
          error.response?.status === 0 ||
          error.code === "ERR_NETWORK" ||
          error.message?.includes("Network Error")
        ) {
          errorMessage =
            "Cannot connect to backend server. Please ensure the server is running on http://localhost:5000 and try again.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status) {
          errorMessage = `Server error (${error.response.status}). Please try again.`;
        }

        showError(errorMessage);
        setUniqueServiceIds([]);
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
      if (s && s.category) {
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
        (s) => s && s.category === selectedCategory
      );
    }
    return filtered
      .filter((service) => service && service.serviceId)
      .map((service) => ({
        value: String(service.serviceId),
        label: `${service.serviceId} - ${service.name || "Service"}`,
        category: service.category,
        service: service,
      }));
  }, [selectedCategory, uniqueServiceIds]);

  // Get all Service ID options for the dropdown
  const allServiceIdOptions = useMemo(() => {
    const options = uniqueServiceIds
      .filter((service) => service && service.serviceId)
      .map((service) => ({
        value: String(service.serviceId),
        label: `${service.serviceId} - ${service.name || "Service"}`,
        category: service.category,
        service: service,
      }));

    console.log("📋 Service ID Options generated:", options.length);
    if (options.length > 0) {
      console.log("📋 First option:", options[0]);
    }

    return options;
  }, [uniqueServiceIds]);

  // Reset service selection when category changes
  useEffect(() => {
    if (selectedCategory && setValue) {
      setValue("selectedServiceId", "");
      setSelectedServiceDetails(null);
    }
  }, [selectedCategory, setValue]);

  // When Service ID is selected, show basic info
  useEffect(() => {
    if (selectedServiceId && uniqueServiceIds.length > 0) {
      // Convert both to string for comparison
      const selectedService = uniqueServiceIds.find(
        (s) => s && String(s.serviceId) === String(selectedServiceId)
      );
      if (selectedService) {
        setSelectedServiceDetails({
          serviceId: selectedService.serviceId,
          name: selectedService.name,
          category: selectedService.category,
          unit: selectedService.unit,
          quote: selectedService.quote,
          type: selectedService.type,
          registrationGroup: selectedService.registrationGroup,
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
  }, [selectedServiceId, uniqueServiceIds, setValue]);

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
  }, [service, uniqueServiceIds, selectedCategory, setValue]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Select Service</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading services...</span>
          </div>
        ) : uniqueServiceIds.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-2 font-semibold">
              No services available
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Please check your connection or contact support.
            </p>
            <p className="text-xs text-gray-500">
              Make sure backend server is running on http://localhost:5000
            </p>
          </div>
        ) : (
          <>
            {/* Category Selection */}
            <div className="mb-4">
              <Select
                label="Service Category (Optional)"
                name="selectedCategory"
                options={allCategories}
                placeholder="Select 'All Categories' or choose a specific category"
                error={errors.selectedCategory?.message}
                {...register("selectedCategory")}
              />
              {allCategories.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {allCategories.length - 1} categories available
                </p>
              )}
            </div>

            {/* Service ID Selection */}
            <div className="mb-4">
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
                    : allServiceIdOptions.length > 0
                    ? `Choose a Service ID (${allServiceIdOptions.length} services available)`
                    : "No services available"
                }
                error={
                  shouldShowError("selectedServiceId")
                    ? errors.selectedServiceId?.message
                    : undefined
                }
                disabled={
                  loading ||
                  allServiceIdOptions.length === 0 ||
                  (selectedCategory &&
                    selectedCategory !== "all" &&
                    filteredServiceIdOptions.length === 0)
                }
                {...register("selectedServiceId", {
                  required: "Please select a Service ID",
                })}
              />
              {allServiceIdOptions.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {allServiceIdOptions.length} unique service(s) available.
                  After selecting Service ID, proceed to select date and time to
                  see exact price and Support Item Number.
                </p>
              )}
              {allServiceIdOptions.length === 0 && !loading && (
                <p className="text-xs text-red-500 mt-2">
                  No services available. Please check your connection or contact
                  support.
                </p>
              )}
            </div>

            {/* Multiple Services Selection */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Add Multiple Services (Optional)
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const currentServiceId = watch("selectedServiceId");
                    if (
                      currentServiceId &&
                      !multipleServices.find(
                        (s) => s.serviceId === currentServiceId
                      )
                    ) {
                      const service = uniqueServiceIds.find(
                        (s) => String(s.serviceId) === String(currentServiceId)
                      );
                      if (service) {
                        const newService = {
                          serviceId: service.serviceId,
                          name: service.name,
                          category: service.category,
                        };
                        const updated = [...multipleServices, newService];
                        setMultipleServices(updated);
                        if (onServicesChange) {
                          onServicesChange(updated);
                        }
                        showSuccess("Service added to list");
                      }
                    }
                  }}
                  disabled={
                    !selectedServiceId ||
                    multipleServices.find(
                      (s) => s.serviceId === watch("selectedServiceId")
                    )
                  }
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Service
                </Button>
              </div>

              {multipleServices.length > 0 && (
                <div className="space-y-2 mt-2">
                  {multipleServices.map((svc, index) => (
                    <div
                      key={`${svc.serviceId}-${index}`}
                      className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {svc.serviceId} - {svc.name}
                        </span>
                        {svc.category && (
                          <span className="ml-2 text-xs text-gray-600">
                            ({svc.category})
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = multipleServices.filter(
                            (_, i) => i !== index
                          );
                          setMultipleServices(updated);
                          if (onServicesChange) {
                            onServicesChange(updated);
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-2">
                    {multipleServices.length} service(s) added. You can add more
                    services or remove them.
                  </p>
                </div>
              )}
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 text-base mb-2">
                Selected Service
              </h4>
              <div className="space-y-2 text-sm text-green-800">
                <div>
                  <strong>Service ID:</strong>{" "}
                  {selectedServiceDetails.serviceId}
                </div>
                <div>
                  <strong>Service Name:</strong> {selectedServiceDetails.name}
                </div>
                {selectedServiceDetails.category && (
                  <div>
                    <strong>Category:</strong> {selectedServiceDetails.category}
                  </div>
                )}
                {selectedServiceDetails.registrationGroup && (
                  <div>
                    <strong>Registration Group:</strong>{" "}
                    {selectedServiceDetails.registrationGroup}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
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
              </div>
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-xs text-green-700">
                  <strong>Next Step:</strong> Please proceed to select date and
                  time to see the exact price and Support Item Number for this
                  service.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelectionStep;
