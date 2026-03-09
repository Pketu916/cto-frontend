import React, { useEffect, useMemo, useState } from "react";
import { FileText, Loader2, CheckCircle } from "lucide-react";
import Select from "../ui/Select";
import { servicesAPI } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

const ServiceSelectionStep = ({
  register,
  errors,
  service,
  setValue,
  watch,
  touchedFields = {},
  isSubmitted = false,
}) => {
  // Helper to check if error should be shown - show on change/input
  const shouldShowError = (fieldName) => {
    // Show error if field has been touched, submitted, or has an error (onChange mode)
    return errors[fieldName];
  };
  const { showError } = useToast();
  const [uniqueServiceIds, setUniqueServiceIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);

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

  // If a service is pre-selected, initialize the service dropdown
  useEffect(() => {
    if (
      service &&
      service.serviceId &&
      setValue &&
      uniqueServiceIds.length > 0
    ) {
      setValue("selectedServiceId", service.serviceId);
    }
  }, [service, uniqueServiceIds, setValue]);

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
            {/* Service ID Selection */}
            <div className="mb-4">
              <Select
                label="Select Service ID"
                name="selectedServiceId"
                required
                options={allServiceIdOptions}
                placeholder={
                  allServiceIdOptions.length > 0
                    ? `Choose a Service ID (${allServiceIdOptions.length} services available)`
                    : "No services available"
                }
                error={
                  shouldShowError("selectedServiceId")
                    ? errors.selectedServiceId?.message
                    : undefined
                }
                disabled={loading || allServiceIdOptions.length === 0}
                {...register("selectedServiceId", {
                  required: "Please select a Service ID",
                })}
              />
            </div>
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
