import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { bookingsAPI } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useSocket } from "../../contexts/SocketContext";
import { useAuth } from "../../contexts/AuthContext";
import { bookingFormSchema } from "./bookingFormSchema";
import { useLocationService } from "./useLocationService";
import BookingFormHeader from "./BookingFormHeader";
import StepIndicator from "./StepIndicator";
import BookingFormFooter from "./BookingFormFooter";
import CustomerInformationStep from "./CustomerInformationStep";
import ScheduleStep from "./ScheduleStep";
import AdditionalInfoStep from "./AdditionalInfoStep";
import PaymentStep from "./PaymentStep";
import SavedAddressSelector from "./SavedAddressSelector";

const ServiceBookingForm = ({
  service,
  onBookingSuccess,
  onCancel,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationMethod, setLocationMethod] = useState("manual");
  const [useInsurance, setUseInsurance] = useState(false);
  const [insuranceVerified, setInsuranceVerified] = useState(false);
  const [isLoadingPreviousData, setIsLoadingPreviousData] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const { showSuccess, showError } = useToast();
  const { emitBookingCreated } = useSocket();
  const { user, userType } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    setValue,
    trigger,
    clearErrors,
  } = useForm({
    resolver: yupResolver(bookingFormSchema),
    mode: "onBlur", // Only validate after user leaves a field (onBlur)
    reValidateMode: "onChange", // Re-validate on change after initial validation
    criteriaMode: "firstError", // Show only first error per field
    shouldFocusError: true, // Focus first error field when validation fails
  });

  // Get fields that need validation for each step
  const getStepFields = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return [
          "customerName",
          "customerAge",
          "customerPhone",
          "emergencyContact",
          "houseDetails",
          "address",
          "city",
          "state",
          "pincode",
        ];
      case 2:
        return []; // Date and time validation is handled separately
      case 3:
        return ["serviceRequirements"];
      case 4:
        const fields = ["paymentMethod"];
        if (service?.insuranceAvailable && useInsurance) {
          fields.push(
            "insuranceProvider",
            "insurancePolicyNumber",
            "insuranceMemberId"
          );
        }
        return fields;
      default:
        return [];
    }
  };

  // Validation will only trigger:
  // 1. When user leaves a field (onBlur) - handled by form mode
  // 2. When user clicks "Next" button - handled by nextStep function
  // 3. When form is submitted - handled by handleFormSubmit

  // Use location service hook
  const { isGettingLocation, locationError, gpsLocation, getCurrentLocation } =
    useLocationService(setValue);

  // Fetch and prepare saved addresses from previous bookings
  useEffect(() => {
    const fetchSavedAddresses = async () => {
      // Only fetch for logged-in users (not providers/admins booking on behalf)
      if (!user || userType !== "user") {
        return;
      }

      setIsLoadingPreviousData(true);
      try {
        const response = await bookingsAPI.getUserBookings();

        if (
          response.success &&
          response.bookings &&
          response.bookings.length > 0
        ) {
          // Extract unique addresses from all bookings
          const addressMap = new Map();

          response.bookings.forEach((booking, index) => {
            const customerInfo = booking.customerInfo || booking.patientInfo;
            const address = booking.address;

            if (address && (address.city || address.state)) {
              // Create a unique key based on address components
              const addressKey = `${address.street || ""}_${
                address.city || ""
              }_${address.state || ""}_${address.pincode || ""}`.trim();

              // Only add if we don't have this address already
              if (!addressMap.has(addressKey)) {
                addressMap.set(addressKey, {
                  id: `addr_${index}`,
                  label: `Saved Address ${addressMap.size + 1}`,
                  name: customerInfo?.name || "",
                  age: customerInfo?.age || "",
                  phone: customerInfo?.phone || "",
                  emergencyContact: customerInfo?.emergencyContact || "",
                  address: address.street || "",
                  city: address.city || "",
                  state: address.state || "",
                  pincode: address.pincode || "",
                  houseDetails: address.houseDetails || "", // Now stored in booking model
                  isDefault: index === 0, // First booking address is default
                  bookingDate: booking.createdAt || booking.scheduledDate,
                });
              }
            }
          });

          // Convert Map to Array and sort by date (most recent first)
          const addressesArray = Array.from(addressMap.values()).sort(
            (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
          );

          // Mark the most recent as default
          if (addressesArray.length > 0) {
            addressesArray[0].isDefault = true;
          }

          setSavedAddresses(addressesArray);

          // Auto-fill with the most recent address (default)
          if (addressesArray.length > 0) {
            handleAddressSelect(addressesArray[0], addressesArray[0].id);
          }
        }
      } catch (error) {
        // Silently fail - user can still fill the form manually
        console.log("Could not fetch previous booking data:", error);
      } finally {
        setIsLoadingPreviousData(false);
      }
    };

    fetchSavedAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userType]); // Only run when user or userType changes

  // Handle address selection
  const handleAddressSelect = async (address, addressId) => {
    setSelectedAddressId(addressId);

    // Fill customer information with validation
    if (address.name) {
      setValue("customerName", address.name, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (address.age) {
      setValue("customerAge", Number(address.age), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (address.phone) {
      setValue("customerPhone", address.phone, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (address.emergencyContact) {
      setValue("emergencyContact", address.emergencyContact, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    // Fill address information with validation
    if (address.houseDetails) {
      setValue("houseDetails", address.houseDetails, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (address.address) {
      setValue("address", address.address, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (address.city) {
      setValue("city", address.city, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (address.state) {
      setValue("state", address.state, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (address.pincode) {
      setValue("pincode", address.pincode, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    // Small delay to ensure all setValue calls complete, then trigger validation
    setTimeout(async () => {
      const step1Fields = getStepFields(1);
      await trigger(step1Fields);
    }, 100);

    showSuccess("Address selected and form filled!");
  };

  // Handle adding new address
  const handleAddNewAddress = () => {
    setSelectedAddressId(null);
    // Clear all form fields to allow new address entry
    setValue("customerName", "");
    setValue("customerAge", "");
    setValue("customerPhone", "");
    setValue("emergencyContact", "");
    setValue("houseDetails", "");
    setValue("address", "");
    setValue("city", "");
    setValue("state", "");
    setValue("pincode", "");
  };

  // Mock available slots - in real app, this would come from API
  const availableSlots = [
    "2024-01-15-09:00",
    "2024-01-15-10:00",
    "2024-01-15-11:00",
    "2024-01-15-14:00",
    "2024-01-15-15:00",
    "2024-01-15-16:00",
    "2024-01-16-09:00",
    "2024-01-16-10:00",
    "2024-01-16-11:00",
    "2024-01-16-13:00",
    "2024-01-16-14:00",
    "2024-01-16-15:00",
    "2024-01-17-09:00",
    "2024-01-17-10:00",
    "2024-01-17-14:00",
    "2024-01-17-15:00",
    "2024-01-17-16:00",
    "2024-01-17-17:00",
  ];

  const handleFormSubmit = async (data) => {
    console.log("Form submission started:", {
      user,
      selectedDate,
      selectedTime,
    });

    if (!user) {
      showError("Please login to book a service");
      return;
    }

    // Check if all steps are valid before submission
    const firstInvalidStep = [1, 2, 3, 4].find(
      (stepNum) => !isStepValid(stepNum)
    );
    if (firstInvalidStep) {
      setStep(firstInvalidStep);
      showError(
        `Please complete step ${firstInvalidStep} before submitting the form.`
      );
      return;
    }

    if (!selectedDate || !selectedTime) {
      setStep(2); // Navigate to schedule step
      showError("Please select date and time");
      return;
    }

    // Validate service selection - either pre-selected service or dropdown selection required
    const finalServiceId = data.selectedServiceFromDropdown || service?.id;
    if (!finalServiceId) {
      setStep(3); // Navigate to additional info step (service selection step)
      showError("Please select a service to continue");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        serviceId: finalServiceId,
        selectedCategory: data.selectedCategory || null,
        selectedServiceFromDropdown: data.selectedServiceFromDropdown || null,
        selectedDate: format(selectedDate, "yyyy-MM-dd"),
        selectedTimeSlot: selectedTime,
        customerName: data.customerName,
        customerAge: data.customerAge,
        customerPhone: data.customerPhone,
        emergencyContact: data.emergencyContact,
        houseDetails: data.houseDetails,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        serviceRequirements: data.serviceRequirements,
        notes: data.notes,
        paymentMethod: data.paymentMethod,
        useInsurance: data.useInsurance || false,
        insuranceInfo: data.useInsurance
          ? {
              provider: data.insuranceProvider,
              policyNumber: data.insurancePolicyNumber,
              memberId: data.insuranceMemberId,
              groupNumber: data.insuranceGroupNumber,
              verified: insuranceVerified,
            }
          : null,
      };

      console.log("Sending booking data:", bookingData);
      console.log("Service data:", service);
      console.log("User data:", user);

      const response = await bookingsAPI.createBooking(bookingData);
      console.log("Booking response:", response);

      if (response.success) {
        showSuccess(
          "Booking created successfully! You will receive a confirmation shortly."
        );

        // Emit booking created event for real-time notifications
        emitBookingCreated({
          bookingId: response.booking.id,
          bookingNumber: response.booking.bookingNumber,
          service: service?.title || "Service",
          customerName: data.customerName,
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          address: `${data.address}, ${data.city}`,
          serviceRequirements: data.serviceRequirements,
        });

        // Call success callback with full response
        if (onBookingSuccess) {
          onBookingSuccess({
            success: true,
            booking: response.booking,
            message: "Booking created successfully!",
          });
        }

        // Redirect to appropriate dashboard after successful booking
        const dashboardPath =
          userType === "provider"
            ? "/provider/dashboard"
            : userType === "admin"
            ? "/admin/dashboard"
            : "/user/dashboard";
        navigate(dashboardPath);
      } else {
        showError(response.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Booking error:", error);

      // Show user-friendly error messages
      let errorMessage = "Failed to create booking. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (
        error.response?.data?.isNetworkError ||
        error.response?.data?.isCorsError
      ) {
        errorMessage = error.response.data.message;
      } else if (
        error.message?.includes("Network Error") ||
        error.code === "ERR_NETWORK"
      ) {
        errorMessage =
          "Cannot connect to server. Please ensure the backend server is running on http://localhost:5000";
      } else if (error.message?.includes("CORS")) {
        errorMessage =
          "CORS Error: Please ensure the backend server is running and CORS is properly configured.";
      }

      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    // Validate current step before proceeding
    const currentStepFields = getStepFields(step);
    let isValid = true;

    // Validate form fields for current step
    if (currentStepFields.length > 0) {
      isValid = await trigger(currentStepFields);

      // If validation fails, find which fields have errors
      if (!isValid) {
        const fieldsWithErrors = currentStepFields.filter(
          (field) => errors[field]
        );
        if (fieldsWithErrors.length > 0) {
          const firstErrorField = fieldsWithErrors[0];
          const errorMessage =
            errors[firstErrorField]?.message || "Invalid value";
          showError(`${errorMessage}`);
          return;
        }
      }
    }

    // Additional validation for step 2 (date/time selection)
    if (step === 2) {
      if (!selectedDate) {
        showError("Please select a date for your appointment.");
        return;
      }
      if (!selectedTime) {
        showError("Please select a time slot for your appointment.");
        return;
      }
    }

    // Double check with isStepValid before proceeding
    if (isValid && isStepValid(step)) {
      setStep(step + 1);
    } else {
      // Show error message for current step
      const fieldsWithErrors = currentStepFields.filter((field) => {
        const formData = watch();
        const fieldValue = formData[field];
        const isEmpty = !fieldValue || fieldValue === "";
        return errors[field] || isEmpty;
      });

      if (fieldsWithErrors.length > 0) {
        showError(
          `Please complete all required fields: ${fieldsWithErrors.join(", ")}`
        );
      } else {
        showError(
          `Please complete all required fields in step ${step} before proceeding.`
        );
      }
    }
  };

  // Check if a step is valid
  const isStepValid = (stepNumber) => {
    const stepFields = getStepFields(stepNumber);
    const formData = watch();

    // Check form field validation
    if (stepFields.length > 0) {
      // Check if there are any validation errors
      const hasValidationErrors = stepFields.some((field) => {
        return !!errors[field]; // Check if error exists
      });

      if (hasValidationErrors) {
        return false;
      }

      // For step 1, also verify values are present (React Hook Form may not trigger on empty fields immediately)
      if (stepNumber === 1) {
        const allFieldsFilled = stepFields.every((field) => {
          const value = formData[field];
          // For age, check it's a valid positive number
          if (field === "customerAge") {
            return (
              value !== undefined &&
              value !== null &&
              value !== "" &&
              !isNaN(Number(value)) &&
              Number(value) > 0
            );
          }
          // For other fields, check not empty
          return (
            value !== undefined && value !== null && String(value).trim() !== ""
          );
        });

        return allFieldsFilled;
      }
    }

    // Additional validation for step 2
    if (stepNumber === 2) {
      return selectedDate && selectedTime;
    }

    // Additional validation for step 4 (insurance verification)
    if (stepNumber === 4) {
      if (service?.insuranceAvailable && formData.useInsurance) {
        return insuranceVerified;
      }
      return true;
    }

    return true;
  };

  // Check if service is a health service with insurance
  const isHealthServiceWithInsurance = service?.insuranceAvailable === true;

  // Calculate subtotal
  const calculateSubtotal = () => {
    const basePrice = service?.basePrice || 0;
    // In future, can add taxes, fees, etc.
    return basePrice;
  };

  // Get step validation status
  const getStepStatus = (stepNumber) => {
    if (stepNumber < step) {
      return isStepValid(stepNumber) ? "completed" : "error";
    } else if (stepNumber === step) {
      return "current";
    } else {
      return "pending";
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Early return if service is not provided
  if (!service) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Service Selected
          </h2>
          <p className="text-gray-600">Please select a service to book.</p>
        </div>
      </div>
    );
  }

  // Insurance toggle handler
  const handleInsuranceToggle = (e) => {
    setUseInsurance(e.target.checked);
    setInsuranceVerified(false);
    if (!e.target.checked) {
      setValue("useInsurance", false);
      setValue("insuranceProvider", "");
      setValue("insurancePolicyNumber", "");
      setValue("insuranceMemberId", "");
      setValue("insuranceGroupNumber", "");
    } else {
      setValue("useInsurance", true);
    }
  };

  // Insurance verification handler
  const handleVerifyInsurance = async () => {
    setInsuranceVerified(false);
    showSuccess("Verifying insurance details...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setInsuranceVerified(true);
    showSuccess("Insurance verified successfully! Your coverage is active.");
    setValue("useInsurance", true);
  };

  // Handle cancel/back
  const handleBack = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/services");
    }
  };

  const TOTAL_STEPS = 4;
  const paymentMethod = watch("paymentMethod");

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <BookingFormHeader service={service} onCancel={handleBack} />

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="p-4">
          {step === 1 && (
            <div>
              <SavedAddressSelector
                savedAddresses={savedAddresses}
                onSelectAddress={handleAddressSelect}
                selectedAddressId={selectedAddressId}
                onAddNew={handleAddNewAddress}
                isLoading={isLoadingPreviousData}
              />
              <CustomerInformationStep
                register={register}
                errors={errors}
                locationMethod={locationMethod}
                onLocationMethodChange={setLocationMethod}
                onGetLocation={getCurrentLocation}
                isGettingLocation={isGettingLocation}
                locationError={locationError}
                gpsLocation={gpsLocation}
                setValue={setValue}
              />
            </div>
          )}

          {step === 2 && (
            <ScheduleStep
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              selectedTime={selectedTime}
              onTimeChange={setSelectedTime}
              serviceId={service?.id}
              availableSlots={availableSlots}
            />
          )}

          {step === 3 && (
            <AdditionalInfoStep
              register={register}
              errors={errors}
              service={service}
              setValue={setValue}
              watch={watch}
            />
          )}

          {step === 4 && (
            <PaymentStep
              service={service}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              subtotal={calculateSubtotal()}
              isHealthServiceWithInsurance={isHealthServiceWithInsurance}
              useInsurance={useInsurance}
              onInsuranceToggle={handleInsuranceToggle}
              register={register}
              errors={errors}
              insuranceVerified={insuranceVerified}
              onVerifyInsurance={handleVerifyInsurance}
              setValue={setValue}
              paymentMethod={paymentMethod}
              onPaymentMethodSelect={(value) =>
                setValue("paymentMethod", value)
              }
            />
          )}
        </div>

        <StepIndicator
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          getStepStatus={getStepStatus}
        />

        <BookingFormFooter
          step={step}
          totalSteps={TOTAL_STEPS}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          isLoading={isLoading}
          isStepValid={isStepValid(step)}
          isSubmitting={isSubmitting}
          canSubmit={
            !isSubmitting &&
            selectedDate &&
            selectedTime &&
            (!isHealthServiceWithInsurance ||
              !useInsurance ||
              insuranceVerified)
          }
        />
      </form>
    </div>
  );
};

export default ServiceBookingForm;
