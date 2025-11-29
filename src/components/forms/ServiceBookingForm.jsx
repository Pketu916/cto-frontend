import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { bookingsAPI, servicesAPI } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useSocket } from "../../contexts/SocketContext";
import { useAuth } from "../../contexts/AuthContext";
import { bookingFormSchema } from "./bookingFormSchema";
import { useLocationService } from "./useLocationService";
import { formatAUD } from "../../utils/pricingUtils";
import BookingFormHeader from "./BookingFormHeader";
import StepIndicator from "./StepIndicator";
import BookingFormFooter from "./BookingFormFooter";
import ServiceSelectionStep from "./ServiceSelectionStep";
import ScheduleStep from "./ScheduleStep";
import CustomerInformationStep from "./CustomerInformationStep";
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
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [exactService, setExactService] = useState(null);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]); // Multiple services
  // New state for booking type and date range
  const [bookingType, setBookingType] = useState("oneTime"); // "oneTime" or "dateRange"
  const [serviceHours, setServiceHours] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [calculatedRangePrice, setCalculatedRangePrice] = useState(null);
  const { showSuccess, showError } = useToast();
  const { emitBookingCreated } = useSocket();
  const { user, userType } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields, isSubmitted },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(bookingFormSchema),
    mode: "onBlur", // Only validate on blur (when user leaves field)
    reValidateMode: "onBlur", // Re-validate on blur
    criteriaMode: "firstError",
    shouldFocusError: true,
  });

  // Watch form values to trigger validation updates
  const formValues = watch();

  // Get fields that need validation for each step
  const getStepFields = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return ["selectedServiceId"]; // Service Selection
      case 2:
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
          "serviceRequirements",
        ]; // Customer Information (Address)
      case 3:
        return []; // Date and time validation is handled separately
      case 4:
        const fields = ["paymentMethod"];
        if (useInsurance) {
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

  // Use location service hook
  const { isGettingLocation, locationError, gpsLocation, getCurrentLocation } =
    useLocationService(setValue);

  // Fetch and prepare saved addresses from previous bookings
  useEffect(() => {
    const fetchSavedAddresses = async () => {
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
          const addressMap = new Map();

          response.bookings.forEach((booking, index) => {
            const customerInfo = booking.customerInfo || booking.patientInfo;
            const address = booking.address;

            if (address && (address.city || address.state)) {
              const addressKey = `${address.street || ""}_${
                address.city || ""
              }_${address.state || ""}_${address.pincode || ""}`.trim();

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
                  houseDetails: address.houseDetails || "",
                  isDefault: index === 0,
                  bookingDate: booking.createdAt || booking.scheduledDate,
                });
              }
            }
          });

          const addressesArray = Array.from(addressMap.values()).sort(
            (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
          );

          if (addressesArray.length > 0) {
            addressesArray[0].isDefault = true;
          }

          setSavedAddresses(addressesArray);
        }
      } catch (error) {
        console.log("Could not fetch previous booking data:", error);
      } finally {
        setIsLoadingPreviousData(false);
      }
    };

    fetchSavedAddresses();
  }, [user, userType]);

  // Handle address selection
  const handleAddressSelect = async (address, addressId) => {
    setSelectedAddressId(addressId);

    // Set all values without triggering validation (validation will happen on blur)
    if (address.name) {
      setValue("customerName", address.name, {
        shouldValidate: false, // Don't validate immediately
        shouldDirty: true,
      });
    }
    if (address.age) {
      setValue("customerAge", Number(address.age), {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
    if (address.phone) {
      setValue("customerPhone", address.phone, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
    if (address.emergencyContact) {
      setValue("emergencyContact", address.emergencyContact, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
    if (address.houseDetails) {
      setValue("houseDetails", address.houseDetails, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
    if (address.address) {
      setValue("address", address.address, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
    if (address.city) {
      setValue("city", address.city, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
    if (address.state) {
      setValue("state", address.state, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
    if (address.pincode) {
      setValue("pincode", address.pincode, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }

    showSuccess("Address selected and form filled!");
  };

  // Note: Validation now happens on blur (when user leaves field) or on submit/next step
  // Removed auto-validation on form value changes to prevent errors showing before user interaction

  // Handle adding new address
  const handleAddNewAddress = () => {
    setSelectedAddressId(null);
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

  // Handle deleting saved address
  const handleDeleteAddress = (addressId) => {
    setSavedAddresses((prev) => {
      const filtered = prev.filter((addr, index) => {
        const addrId = addr.id || `addr_${index}`;
        return addrId !== addressId;
      });
      return filtered;
    });
    if (selectedAddressId === addressId) {
      setSelectedAddressId(null);
      handleAddNewAddress(); // Clear form
    }
    showSuccess("Address deleted successfully!");
  };

  // Calculate total selected days in date range
  const calculateTotalSelectedDays = () => {
    if (!startDate || !endDate || selectedDays.length === 0) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (selectedDays.includes(dayOfWeek)) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  };

  // Manual function to calculate pricing when user clicks button
  const calculatePricing = async () => {
    const formState = watch();
    const selectedServiceId = formState.selectedServiceId;
    const state = formState.state;

    // Validate required fields
    if (!selectedServiceId) {
      showError("Please select a Service ID first");
      return;
    }

    if (!state) {
      showError(
        "Please select state in Step 2 (Customer Information) to calculate pricing."
      );
      return;
    }

    // Validate based on booking type
    if (bookingType === "oneTime") {
      if (!selectedDate) {
        showError("Please select a date first");
        return;
      }

      if (!selectedTime) {
        showError("Please select a time first");
        return;
      }

      if (!serviceHours || parseFloat(serviceHours) <= 0) {
        showError("Please enter service hours");
        return;
      }
    } else if (bookingType === "dateRange") {
      if (!startDate) {
        showError("Please select start date first");
        return;
      }

      if (!endDate) {
        showError("Please select end date first");
        return;
      }

      if (selectedDays.length === 0) {
        showError("Please select at least one service day");
        return;
      }

      if (!selectedTime) {
        showError("Please select a time first");
        return;
      }

      if (!serviceHours || parseFloat(serviceHours) <= 0) {
        showError("Please enter service hours per day");
        return;
      }
    }

    setIsCalculatingPrice(true);
    try {
      // For one-time booking, use selectedDate; for date range, use startDate
      const dateToUse = bookingType === "oneTime" ? selectedDate : startDate;

      const response = await servicesAPI.findServiceById(
        selectedServiceId,
        format(dateToUse, "yyyy-MM-dd"),
        selectedTime,
        state
      );

      if (response.success && response.service) {
        setExactService(response.service);
        const price = response.service.price;

        if (
          price !== null &&
          price !== undefined &&
          price !== "" &&
          !isNaN(parseFloat(price))
        ) {
          const hourlyPrice = parseFloat(price);

          if (bookingType === "oneTime") {
            // One-time: hourly price × service hours
            const totalPrice = hourlyPrice * parseFloat(serviceHours);
            setCalculatedPrice(totalPrice);
            setCalculatedRangePrice(null);
            showSuccess("Pricing calculated successfully!");
          } else {
            // Date range: total days × hourly price × service hours per day
            const totalDays = calculateTotalSelectedDays();
            const totalPrice =
              totalDays * hourlyPrice * parseFloat(serviceHours);
            setCalculatedRangePrice(totalPrice);
            setCalculatedPrice(null);
            showSuccess(`Pricing calculated for ${totalDays} service days!`);
          }
        } else {
          setCalculatedPrice(null);
          setCalculatedRangePrice(null);
          showError(
            "Price not available for this service. Quotation required."
          );
        }
      } else {
        setExactService(null);
        setCalculatedPrice(null);
        setCalculatedRangePrice(null);
        showError("Service not found. Please check your selections.");
      }
    } catch (error) {
      console.error("Error finding exact service:", error);
      setExactService(null);
      setCalculatedPrice(null);
      setCalculatedRangePrice(null);

      if (error.response?.status === 429) {
        showError("Too many requests. Please wait a moment and try again.");
      } else {
        showError("Failed to calculate pricing. Please try again.");
      }
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  const handleFormSubmit = async (data) => {
    if (!user) {
      showError("Please login to book a service");
      return;
    }

    // Validate all steps before submitting
    const allStepFields = [
      ...getStepFields(1),
      ...getStepFields(2),
      ...getStepFields(4),
    ];

    // Trigger validation for all form fields
    const isFormValid = await trigger(allStepFields);

    // Check each step validity
    const step1Valid = isStepValid(1);
    const step2Valid = isStepValid(2);
    const step3Valid = isStepValid(3);
    const step4Valid = isStepValid(4);

    if (!step1Valid) {
      setStep(1);
      showError(
        "Please complete step 1 (Service Selection) before submitting."
      );
      return;
    }

    if (!step2Valid) {
      setStep(2);
      showError(
        "Please complete step 2 (Customer Information) before submitting."
      );
      return;
    }

    if (!step3Valid) {
      setStep(3);
      showError("Please complete step 3 (Date & Time) before submitting.");
      return;
    }

    if (!step4Valid) {
      setStep(4);
      showError("Please complete step 4 (Payment) before submitting.");
      return;
    }

    if (!isFormValid) {
      const fieldsWithErrors = allStepFields.filter((field) => errors[field]);
      if (fieldsWithErrors.length > 0) {
        showError(`Please fix errors in: ${fieldsWithErrors.join(", ")}`);
        return;
      }
    }

    // Validate step 3 based on booking type
    if (bookingType === "oneTime") {
      if (!selectedDate || !selectedTime || !serviceHours) {
        setStep(3);
        showError("Please complete date, time, and service hours");
        return;
      }
    } else if (bookingType === "dateRange") {
      if (
        !startDate ||
        !endDate ||
        selectedDays.length === 0 ||
        !selectedTime ||
        !serviceHours
      ) {
        setStep(3);
        showError(
          "Please complete date range, service days, time, and service hours"
        );
        return;
      }
    }

    const finalServiceId = data.selectedServiceId;
    if (!finalServiceId) {
      setStep(1);
      showError("Please select a Service ID to continue");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate final price based on booking type
      let finalPrice = null;
      if (bookingType === "oneTime") {
        finalPrice =
          calculatedPrice ??
          (exactService?.price
            ? exactService.price * parseFloat(serviceHours)
            : null);
      } else if (bookingType === "dateRange") {
        finalPrice = calculatedRangePrice;
      }

      const bookingData = {
        serviceId: finalServiceId,
        supportItemNumber: exactService?.supportItemNumber || null,
        selectedCategory: data.selectedCategory || null,
        bookingType: bookingType,
        // One-time booking fields
        selectedDate:
          bookingType === "oneTime" ? format(selectedDate, "yyyy-MM-dd") : null,
        selectedTimeSlot: selectedTime,
        serviceHours: serviceHours ? parseFloat(serviceHours) : null,
        // Date range booking fields
        startDate:
          bookingType === "dateRange" ? format(startDate, "yyyy-MM-dd") : null,
        endDate:
          bookingType === "dateRange" ? format(endDate, "yyyy-MM-dd") : null,
        selectedDays: bookingType === "dateRange" ? selectedDays : [],
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
        serviceDetails: exactService
          ? {
              serviceId: exactService.serviceId || finalServiceId,
              serviceName:
                exactService.supportItemName ||
                service?.name ||
                service?.title ||
                null,
              supportItemNumber: exactService.supportItemNumber || null,
              price: finalPrice,
              priceType: exactService.priceType || null,
              condition:
                exactService.determinedCondition ||
                exactService.condition ||
                null,
              unit: exactService.unit || null,
              quote: exactService.quote || null,
              registrationGroup: exactService.registrationGroup || null,
              category:
                exactService.category ||
                service?.category ||
                data.selectedCategory ||
                null,
            }
          : null,
      };

      const response = await bookingsAPI.createBooking(bookingData);

      if (response.success) {
        // Check if quotation was created instead of booking
        if (response.requiresQuotation && response.quotation) {
          showSuccess(
            "Service pricing not available. Quotation request created. Admin will review and provide pricing shortly. You will receive an email notification once the quotation is ready."
          );

          if (onBookingSuccess) {
            onBookingSuccess({
              success: true,
              quotation: response.quotation,
              message: "Quotation request created successfully!",
              requiresQuotation: true,
            });
          }

          const dashboardPath =
            userType === "provider"
              ? "/provider/dashboard"
              : userType === "admin"
              ? "/admin/dashboard"
              : "/user/dashboard";
          navigate(dashboardPath);
        } else {
          // Normal booking created
          showSuccess(
            "Booking created successfully! You will receive a confirmation shortly."
          );

          emitBookingCreated({
            bookingId: response.booking.id,
            bookingNumber: response.booking.bookingNumber,
            service: exactService?.supportItemName || "Service",
            customerName: data.customerName,
            scheduledDate: selectedDate,
            scheduledTime: selectedTime,
            address: `${data.address}, ${data.city}`,
            serviceRequirements: data.serviceRequirements,
          });

          if (onBookingSuccess) {
            onBookingSuccess({
              success: true,
              booking: response.booking,
              message: "Booking created successfully!",
            });
          }

          const dashboardPath =
            userType === "provider"
              ? "/provider/dashboard"
              : userType === "admin"
              ? "/admin/dashboard"
              : "/user/dashboard";
          navigate(dashboardPath);
        }
      } else {
        showError(response.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
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
    const currentStepFields = getStepFields(step);
    let isValid = true;

    if (currentStepFields.length > 0) {
      isValid = await trigger(currentStepFields);

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

    // Additional validation for step 3 (date/time selection)
    if (step === 3) {
      if (bookingType === "oneTime") {
        if (!selectedDate) {
          showError("Please select a date for your appointment.");
          return;
        }
        if (!selectedTime) {
          showError("Please enter hour and minute for your appointment time.");
          return;
        }
        if (!serviceHours || parseFloat(serviceHours) <= 0) {
          showError("Please enter service hours.");
          return;
        }
      } else if (bookingType === "dateRange") {
        if (!startDate) {
          showError("Please select start date.");
          return;
        }
        if (!endDate) {
          showError("Please select end date.");
          return;
        }
        if (selectedDays.length === 0) {
          showError("Please select at least one service day.");
          return;
        }
        if (!selectedTime) {
          showError("Please enter hour and minute for your appointment time.");
          return;
        }
        if (!serviceHours || parseFloat(serviceHours) <= 0) {
          showError("Please enter service hours per day.");
          return;
        }
      }
      // Check if state is selected (needed for exact service finding)
      const state = watch("state");
      if (!state) {
        showError(
          "Please select state in step 2 first, or we'll use default pricing."
        );
      }
    }

    if (isValid && isStepValid(step)) {
      setStep(step + 1);
    } else {
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

  const isStepValid = (stepNumber) => {
    const stepFields = getStepFields(stepNumber);
    const formData = watch();

    if (stepFields.length > 0) {
      const hasValidationErrors = stepFields.some((field) => {
        return !!errors[field];
      });

      if (hasValidationErrors) {
        return false;
      }

      if (stepNumber === 1) {
        return !!formData.selectedServiceId;
      }

      if (stepNumber === 2) {
        const allFieldsFilled = stepFields.every((field) => {
          const value = formData[field];
          if (field === "customerAge") {
            return (
              value !== undefined &&
              value !== null &&
              value !== "" &&
              !isNaN(Number(value)) &&
              Number(value) > 0
            );
          }
          return (
            value !== undefined && value !== null && String(value).trim() !== ""
          );
        });
        // Also check if there are no errors for these fields
        const hasNoErrors = stepFields.every((field) => !errors[field]);
        return allFieldsFilled && hasNoErrors;
      }
    }

    if (stepNumber === 3) {
      if (bookingType === "oneTime") {
        return (
          selectedDate &&
          selectedTime &&
          serviceHours &&
          parseFloat(serviceHours) > 0
        );
      } else if (bookingType === "dateRange") {
        return (
          startDate &&
          endDate &&
          selectedDays.length > 0 &&
          selectedTime &&
          serviceHours &&
          parseFloat(serviceHours) > 0
        );
      }
      return false;
    }

    if (stepNumber === 4) {
      const formData = watch();
      // Check if payment method is selected
      if (!formData.paymentMethod) {
        return false;
      }
      // If insurance is required, check if it's verified
      if (useInsurance) {
        return insuranceVerified;
      }
      return true;
    }

    return true;
  };

  const isHealthServiceWithInsurance = exactService?.quote === "Yes";

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

  const handleVerifyInsurance = async () => {
    setInsuranceVerified(false);
    showSuccess("Verifying insurance details...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setInsuranceVerified(true);
    showSuccess("Insurance verified successfully! Your coverage is active.");
    setValue("useInsurance", true);
  };

  // Handle slot blocking/unblocking
  const handleSlotBlock = (time) => {
    if (!blockedSlots.includes(time)) {
      setBlockedSlots([...blockedSlots, time]);
      showSuccess(`Time slot ${time} has been blocked`);
    }
  };

  const handleSlotUnblock = (time) => {
    setBlockedSlots(blockedSlots.filter((slot) => slot !== time));
    showSuccess(`Time slot ${time} has been unblocked`);
  };

  const handleBack = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/services");
    }
  };

  const TOTAL_STEPS = 4;
  const paymentMethod = watch("paymentMethod");
  const calculateSubtotal = () => {
    if (bookingType === "oneTime") {
      // One-time: use calculatedPrice or calculate from hourly price × service hours
      if (calculatedPrice !== null && calculatedPrice !== undefined) {
        return calculatedPrice;
      }
      if (
        exactService?.price !== null &&
        exactService?.price !== undefined &&
        serviceHours
      ) {
        return exactService.price * parseFloat(serviceHours);
      }
    } else if (bookingType === "dateRange") {
      // Date range: use calculatedRangePrice
      if (calculatedRangePrice !== null && calculatedRangePrice !== undefined) {
        return calculatedRangePrice;
      }
      // Fallback calculation
      if (
        exactService?.price !== null &&
        exactService?.price !== undefined &&
        serviceHours &&
        startDate &&
        endDate &&
        selectedDays.length > 0
      ) {
        const totalDays = calculateTotalSelectedDays();
        return exactService.price * totalDays * parseFloat(serviceHours);
      }
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <BookingFormHeader
        service={exactService || service}
        onCancel={handleBack}
      />

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="p-4">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <ServiceSelectionStep
              register={register}
              errors={errors}
              service={service}
              setValue={setValue}
              watch={watch}
              selectedServices={selectedServices}
              onServicesChange={setSelectedServices}
            />
          )}

          {/* Step 2: Customer Information (Address) */}
          {step === 2 && (
            <div
              className="swipe-container"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                e.currentTarget.dataset.touchStartX = touch.clientX.toString();
              }}
              onTouchEnd={(e) => {
                const touchStartX = parseFloat(
                  e.currentTarget.dataset.touchStartX || "0"
                );
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;

                // Swipe left (next step) - threshold 50px
                if (diff > 50 && step < 4) {
                  nextStep();
                }
                // Swipe right (previous step) - threshold 50px
                else if (diff < -50 && step > 1) {
                  setStep(step - 1);
                }
              }}
            >
              <SavedAddressSelector
                savedAddresses={savedAddresses}
                onSelectAddress={handleAddressSelect}
                selectedAddressId={selectedAddressId}
                onAddNew={handleAddNewAddress}
                onDeleteAddress={handleDeleteAddress}
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
                setValue={(field, value, options) => {
                  setValue(field, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    ...options,
                  });
                  // Trigger validation for step 2 fields when any field changes
                  if (step === 2) {
                    setTimeout(async () => {
                      const step2Fields = getStepFields(2);
                      await trigger(step2Fields);
                    }, 100);
                  }
                }}
              />
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("serviceRequirements")}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    (touchedFields.serviceRequirements || isSubmitted) &&
                    errors.serviceRequirements
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Describe the service requirements or details needed"
                />
                {(touchedFields.serviceRequirements || isSubmitted) &&
                  errors.serviceRequirements && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.serviceRequirements.message}
                    </p>
                  )}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional information or special instructions"
                />
              </div>
            </div>
          )}

          {/* Step 3: Schedule (Date/Time) */}
          {step === 3 && (
            <div
              className="swipe-container"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                e.currentTarget.dataset.touchStartX = touch.clientX.toString();
              }}
              onTouchEnd={(e) => {
                const touchStartX = parseFloat(
                  e.currentTarget.dataset.touchStartX || "0"
                );
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;

                // Swipe left (next step) - threshold 50px
                if (diff > 50 && step < 4) {
                  nextStep();
                }
                // Swipe right (previous step) - threshold 50px
                else if (diff < -50 && step > 1) {
                  setStep(step - 1);
                }
              }}
            >
              <ScheduleStep
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                selectedTime={selectedTime}
                onTimeChange={setSelectedTime}
                serviceId={watch("selectedServiceId")}
                availableSlots={[]}
                estimatedPrice={calculatedPrice}
                isCalculatingPrice={isCalculatingPrice}
                exactService={exactService}
                state={watch("state")}
                blockedSlots={blockedSlots}
                onSlotBlock={handleSlotBlock}
                onSlotUnblock={handleSlotUnblock}
                onCalculatePricing={calculatePricing}
                bookingType={bookingType}
                onBookingTypeChange={setBookingType}
                serviceHours={serviceHours}
                onServiceHoursChange={setServiceHours}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
                selectedDays={selectedDays}
                onSelectedDaysChange={setSelectedDays}
                calculatedRangePrice={calculatedRangePrice}
              />
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <PaymentStep
              service={exactService || service}
              selectedDate={
                bookingType === "oneTime" ? selectedDate : startDate
              }
              selectedTime={selectedTime}
              subtotal={calculateSubtotal()}
              isHealthServiceWithInsurance={isHealthServiceWithInsurance}
              useInsurance={useInsurance}
              onInsuranceToggle={handleInsuranceToggle}
              register={register}
              errors={errors}
              touchedFields={touchedFields}
              isSubmitted={isSubmitted}
              insuranceVerified={insuranceVerified}
              onVerifyInsurance={handleVerifyInsurance}
              setValue={setValue}
              paymentMethod={paymentMethod}
              onPaymentMethodSelect={(value) =>
                setValue("paymentMethod", value, {
                  shouldValidate: false, // Don't validate immediately
                  shouldDirty: true,
                })
              }
              isCalculatingPrice={isCalculatingPrice}
              state={watch("state")}
              exactService={exactService}
              bookingType={bookingType}
              startDate={startDate}
              endDate={endDate}
              selectedDays={selectedDays}
              serviceHours={serviceHours}
            />
          )}
        </div>

        <StepIndicator
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          getStepStatus={(stepNum) => {
            if (stepNum < step) {
              return isStepValid(stepNum) ? "completed" : "error";
            } else if (stepNum === step) {
              return "current";
            } else {
              return "pending";
            }
          }}
        />

        <BookingFormFooter
          step={step}
          totalSteps={TOTAL_STEPS}
          onPrevStep={() => setStep(step - 1)}
          onNextStep={nextStep}
          isLoading={isLoading}
          isStepValid={isStepValid(step)}
          isSubmitting={isSubmitting}
          canSubmit={
            !isSubmitting &&
            ((bookingType === "oneTime" &&
              selectedDate &&
              selectedTime &&
              serviceHours) ||
              (bookingType === "dateRange" &&
                startDate &&
                endDate &&
                selectedDays.length > 0 &&
                selectedTime &&
                serviceHours)) &&
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
