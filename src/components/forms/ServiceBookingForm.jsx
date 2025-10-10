import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  User,
  FileText,
  Navigation,
  MapPinIcon,
  ArrowLeft,
} from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import TimeSlotPicker from "./TimeSlotPicker";
import { format } from "date-fns";
import { bookingsAPI } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useSocket } from "../../contexts/SocketContext";
import { useAuth } from "../../contexts/AuthContext";

// Indian states list
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const schema = yup.object({
  patientName: yup.string().required("Please enter the patient's name"),
  patientAge: yup
    .number()
    .typeError("Please enter a valid age (numbers only)")
    .min(1, "Age must be at least 1 year")
    .max(120, "Please enter a valid age")
    .required("Please enter the patient's age"),
  patientPhone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number")
    .required("Please enter the patient's phone number"),
  houseDetails: yup
    .string()
    .required("Please enter house/flat number and name"),
  address: yup.string().required("Please enter the complete address"),
  city: yup.string().required("Please enter the city name"),
  state: yup.string().required("Please select the state"),
  pincode: yup.string().required("Please enter the pincode"),
  symptoms: yup
    .string()
    .required("Please describe the patient's symptoms or requirements"),
  emergencyContact: yup
    .string()
    .matches(
      /^[0-9]{10}$/,
      "Please enter a valid 10-digit emergency contact number"
    )
    .required("Please enter an emergency contact number"),
  notes: yup.string(),
});

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
  const [locationMethod, setLocationMethod] = useState("manual"); // "gps" or "manual"
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [gpsLocation, setGpsLocation] = useState(null);
  const [stepErrors, setStepErrors] = useState({});
  const { showSuccess, showError } = useToast();
  const { emitBookingCreated } = useSocket();
  const { user, userType } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Debug logging (remove in production)
  // console.log("ServiceBookingForm service:", service);
  // console.log("ServiceBookingForm service ID:", service?.id);
  // console.log("Current errors:", errors);
  // console.log("Current step:", step);

  // Enhanced GPS Location functions with permission handling
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError(
        "Your browser doesn't support location detection. Please enter your address manually."
      );
      return;
    }

    setIsGettingLocation(true);
    setLocationError("");

    try {
      // Check if location permission is already granted
      const permission = await navigator.permissions?.query({
        name: "geolocation",
      });

      if (permission?.state === "denied") {
        setLocationError(
          "Location access is blocked. Please allow location access in your browser settings or enter your address manually."
        );
        setIsGettingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setGpsLocation({ latitude, longitude });

            // Reverse geocoding to get address details
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();

            if (data && data.localityInfo) {
              // Auto-fill form with GPS data
              setValue(
                "address",
                `${data.principalSubdivision || ""} ${
                  data.locality || ""
                }`.trim()
              );
              setValue("city", data.city || data.locality || "");
              setValue("state", data.principalSubdivision || "");
              setValue("pincode", data.postcode || "");

              showSuccess("Location detected and form filled automatically!");
            }
          } catch (error) {
            console.error("Error getting location details:", error);
            setLocationError(
              "Could not get address details from your location. Please enter your address manually."
            );
          } finally {
            setIsGettingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Unable to get your location. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                "Please allow location access and try again. Click the location icon in your browser's address bar to enable location access, or enter your address manually.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
              break;
          }
          setLocationError(errorMessage);
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000,
        }
      );
    } catch (error) {
      console.error("Permission check error:", error);
      // Fallback to direct geolocation call if permission API is not available
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setGpsLocation({ latitude, longitude });

            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();

            if (data && data.localityInfo) {
              setValue(
                "address",
                `${data.principalSubdivision || ""} ${
                  data.locality || ""
                }`.trim()
              );
              setValue("city", data.city || data.locality || "");
              setValue("state", data.principalSubdivision || "");
              setValue("pincode", data.postcode || "");

              showSuccess("Location detected and form filled automatically!");
            }
          } catch (error) {
            console.error("Error getting location details:", error);
            setLocationError(
              "Could not get address details from your location. Please enter your address manually."
            );
          } finally {
            setIsGettingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Unable to get your location. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                "Please allow location access and try again. Click the location icon in your browser's address bar to enable location access, or enter your address manually.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
              break;
          }
          setLocationError(errorMessage);
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000,
        }
      );
    }
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
    const firstInvalidStep = [1, 2, 3].find((stepNum) => !isStepValid(stepNum));
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

    setIsSubmitting(true);

    try {
      const bookingData = {
        serviceId: service?.id,
        selectedDate: format(selectedDate, "yyyy-MM-dd"),
        selectedTimeSlot: selectedTime,
        patientName: data.patientName,
        patientAge: data.patientAge,
        patientPhone: data.patientPhone,
        emergencyContact: data.emergencyContact,
        houseDetails: data.houseDetails,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        symptoms: data.symptoms,
        notes: data.notes,
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
          patientName: data.patientName,
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          address: `${data.address}, ${data.city}`,
          symptoms: data.symptoms,
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
      showError("Failed to create booking. Please try again.");
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

    if (isValid) {
      setStep(step + 1);
    } else {
      // Show error message for current step
      showError(
        `Please complete all required fields in step ${step} before proceeding.`
      );
    }
  };

  // Get fields that need validation for each step
  const getStepFields = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return [
          "patientName",
          "patientAge",
          "patientPhone",
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
        return ["symptoms"];
      default:
        return [];
    }
  };

  // Check if a step is valid
  const isStepValid = (stepNumber) => {
    const stepFields = getStepFields(stepNumber);
    const formData = watch();

    // Check form field validation
    if (stepFields.length > 0) {
      const hasFieldErrors = stepFields.some((field) => errors[field]);
      if (hasFieldErrors) {
        // Debug logging (remove in production)
        // console.log(
        //   `Step ${stepNumber} has field errors:`,
        //   stepFields.filter((field) => errors[field])
        // );
        return false;
      }
    }

    // Additional validation for step 2
    if (stepNumber === 2) {
      const isValid = selectedDate && selectedTime;
      if (!isValid) {
        // Debug logging (remove in production)
        // console.log(
        //   `Step 2 validation failed - Date: ${selectedDate}, Time: ${selectedTime}`
        // );
      }
      return isValid;
    }

    return true;
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

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#A0F92D] ">Book Service</h2>
            <p className="text-blue-100 mt-1">{service?.title || "Service"}</p>
            <div className="flex items-center mt-3 text-blue-100">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">Home Service Available</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                navigate("/services");
              }
            }}
            className="flex items-center text-blue-100 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </button>
        </div>
      </div>

      {/* Progress Steps */}

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="p-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Patient Information
              </h3>

              {/* Step 1 Error Summary */}
              {(() => {
                const step1Errors = getStepFields(1).filter(
                  (field) => errors[field]
                );
                // Debug logging (remove in production)
                // console.log("Step 1 errors check:", {
                //   step1Errors,
                //   allErrors: errors,
                //   step1Fields: getStepFields(1),
                // });
                return (
                  step1Errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <svg
                          className="w-5 h-5 text-red-400 mt-0.5 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-red-800">
                            Please fix the following errors:
                          </h4>
                          <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                            {step1Errors.map((field) => (
                              <li key={field}>{errors[field].message}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                );
              })()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Patient Name"
                  name="patientName"
                  placeholder="Enter patient's full name"
                  error={errors.patientName?.message}
                  required
                  {...register("patientName")}
                />

                <Input
                  label="Patient Age"
                  name="patientAge"
                  type="number"
                  placeholder="Enter patient's age"
                  error={errors.patientAge?.message}
                  required
                  {...register("patientAge")}
                />

                <Input
                  label="Patient Phone"
                  name="patientPhone"
                  placeholder="Enter patient's phone number"
                  error={errors.patientPhone?.message}
                  required
                  {...register("patientPhone")}
                />

                <Input
                  label="Emergency Contact"
                  name="emergencyContact"
                  placeholder="Enter emergency contact number"
                  error={errors.emergencyContact?.message}
                  required
                  {...register("emergencyContact")}
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 flex items-center mt-8">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Service Address
              </h3>

              {/* Location Method Selection */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setLocationMethod("gps");
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                      locationMethod === "gps"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Use GPS Location
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocationMethod("manual");
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                      locationMethod === "manual"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Enter Manually
                  </button>
                </div>

                {locationMethod === "gps" && (
                  <div className="mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="flex items-center bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {isGettingLocation
                        ? "Getting Location..."
                        : "Get My Location"}
                    </Button>

                    {locationError && (
                      <div className="mt-2 text-sm text-red-600">
                        ⚠️ {locationError}
                      </div>
                    )}

                    {gpsLocation && (
                      <div className="mt-2 text-sm text-green-600">
                        ✓ Location detected and address filled automatically
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <Input
                    label="House/Flat Number and Name"
                    name="houseDetails"
                    placeholder="e.g., Flat 201, ABC Society or House No. 123, XYZ Building"
                    error={errors.houseDetails?.message}
                    required
                    {...register("houseDetails")}
                  />
                </div>

                <div>
                  <Input
                    label="Address"
                    name="address"
                    placeholder="Enter complete address (society, building name, street, area, etc.)"
                    error={errors.address?.message}
                    required
                    {...register("address")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="City"
                    name="city"
                    placeholder="Enter city"
                    error={errors.city?.message}
                    required
                    {...register("city")}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("state")}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <Input
                    label="Pincode"
                    name="pincode"
                    placeholder="Enter pincode"
                    error={errors.pincode?.message}
                    required
                    {...register("pincode")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Schedule Your Service
              </h3>

              {/* Step 2 Error Summary */}
              {(!selectedDate || !selectedTime) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-400 mt-0.5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-red-800">
                        Please complete the following:
                      </h4>
                      <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                        {!selectedDate && (
                          <li>Select a date for your appointment</li>
                        )}
                        {!selectedTime && (
                          <li>Select a time slot for your appointment</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <TimeSlotPicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                selectedTime={selectedTime}
                onTimeChange={setSelectedTime}
                serviceId={service?.id}
                availableSlots={availableSlots}
              />
            </div>
          )}

          {/* Step 3: Additional Info & Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Additional Information
              </h3>

              {/* Step 3 Error Summary */}
              {errors.symptoms && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-400 mt-0.5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-red-800">
                        Please fix the following error:
                      </h4>
                      <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                        <li>{errors.symptoms.message}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <Input
                label="Symptoms / Requirements"
                name="symptoms"
                placeholder="Describe symptoms or specific requirements"
                error={errors.symptoms?.message}
                required
                {...register("symptoms")}
              />

              <Input
                label="Additional Notes (Optional)"
                name="notes"
                placeholder="Any additional information or special instructions"
                error={errors.notes?.message}
                {...register("notes")}
              />

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Booking Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">
                      {service?.title || "Service"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {selectedDate
                        ? format(selectedDate, "EEEE, MMMM d, yyyy")
                        : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {selectedTime || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Price:</span>
                    <span className="font-medium text-green-600">
                      {service?.estimatedPriceRange || "Contact for pricing"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step Progress Indicator - Top */}
        <div className="px-6 py-4 bg-blue-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => {
                const status = getStepStatus(stepNumber);
                const isCompleted = status === "completed";
                const isCurrent = status === "current";
                const hasError = status === "error";

                return (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        hasError
                          ? "bg-red-500 text-white"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {hasError ? (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : isCompleted ? (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        stepNumber
                      )}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium transition-colors ${
                        hasError
                          ? "text-red-600"
                          : isCompleted
                          ? "text-green-600"
                          : isCurrent
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      {stepNumber === 1
                        ? "Basic Info"
                        : stepNumber === 2
                        ? "Schedule"
                        : "Confirm"}
                    </span>
                    {stepNumber < 3 && (
                      <div
                        className={`w-8 h-0.5 ml-4 transition-colors ${
                          isCompleted ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-sm text-gray-600">Step {step} of 3</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
          <div>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
          </div>

          <div>
            {step < 3 ? (
              <Button
                type="button"
                variant="outline"
                onClick={nextStep}
                disabled={isLoading || !isStepValid(step)}
                className={
                  !isStepValid(step) ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                Next
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !selectedDate || !selectedTime}
                loading={isSubmitting}
              >
                {isSubmitting ? "Creating Booking..." : "Confirm Booking"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceBookingForm;
