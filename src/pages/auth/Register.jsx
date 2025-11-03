import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { User, Shield } from "lucide-react";

const getSchema = (userType) => {
  const baseSchema = {
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Valid email required")
      .required("Email is required"),
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  };

  if (userType === "provider") {
    baseSchema.serviceType = yup.string().required("Service type is required");
    baseSchema.experience = yup
      .string()
      .required("Years of experience is required");
    baseSchema.certificationNumber = yup.string(); // Optional - only if provider has certifications
    baseSchema.qualifications = yup.string(); // Optional - skills and qualifications
    baseSchema.workplace = yup.string(); // Optional
    baseSchema.serviceFee = yup
      .number()
      .min(0, "Service fee must be positive")
      .required("Service fee is required");
    // Address fields
    baseSchema.street = yup.string().required("Street address is required");
    baseSchema.city = yup.string().required("City is required");
    baseSchema.state = yup.string().required("State is required");
    baseSchema.pincode = yup
      .string()
      .matches(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit pincode")
      .required("Pincode is required");
  }

  return yup.object(baseSchema);
};

const Register = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  // Get user type from URL
  const pathParts = window.location.pathname.split("/");
  const userType = pathParts[pathParts.length - 1];

  const schema = getSchema(userType);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setRegisterError(""); // Clear previous errors

    try {
      const result = await registerUser(data, userType);

      if (result.success) {
        showSuccess("Registration successful! Welcome to CTO India.");

        // Redirect based on user type
        const dashboardPath =
          userType === "admin"
            ? "/admin/dashboard"
            : userType === "provider"
            ? "/provider/dashboard"
            : "/user/dashboard";

        setTimeout(() => {
          navigate(dashboardPath, { replace: true });
        }, 2000);
      } else {
        // Display the error message
        const errorMsg =
          result.message || "Registration failed. Please try again.";
        setRegisterError(errorMsg);
        showError(errorMsg);

        // Set field-specific errors if available
        if (result.errors) {
          Object.keys(result.errors).forEach((field) => {
            // Set error for the specific field using react-hook-form
            setError(field, {
              type: "server",
              message: result.errors[field],
            });
          });
        }
      }
    } catch (err) {
      const errorMessage =
        err.message || "Registration failed. Please try again.";
      setRegisterError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const serviceTypeOptions = [
    { value: "home-cleaning", label: "Home Cleaning" },
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "carpentry", label: "Carpentry" },
    { value: "painting", label: "Painting" },
    { value: "gardening", label: "Gardening/Landscaping" },
    { value: "appliance-repair", label: "Appliance Repair" },
    { value: "home-maintenance", label: "Home Maintenance" },
    { value: "general-medicine", label: "General Medicine" },
    { value: "cardiology", label: "Cardiology" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "home-care", label: "Home Care/Nursing" },
    { value: "telehealth", label: "Telehealth Consultation" },
    { value: "beauty-services", label: "Beauty Services" },
    { value: "fitness-training", label: "Fitness Training" },
    { value: "tutoring", label: "Tutoring/Education" },
    { value: "cooking", label: "Cooking/Chef Services" },
    { value: "other", label: "Other Service" },
  ];

  const experienceOptions = [
    { value: "0-2", label: "0-2 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "6-10", label: "6-10 years" },
    { value: "11-15", label: "11-15 years" },
    { value: "16+", label: "16+ years" },
  ];

  const isProvider = userType === "provider";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center">
            {isProvider ? (
              <Shield className="w-12 h-12 text-blue-600" />
            ) : (
              <User className="w-12 h-12 text-blue-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-primary mt-4">CTO India</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isProvider
              ? "Join as a service provider"
              : "Create your customer account"}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {registerError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{registerError}</p>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              error={errors.name?.message}
              required
              {...register("name")}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              required
              {...register("email")}
            />

            <Input
              label="Phone Number"
              name="phone"
              placeholder="Enter your phone number"
              error={errors.phone?.message}
              required
              {...register("phone")}
            />

            {isProvider && (
              <>
                <Select
                  label="Service Type"
                  name="serviceType"
                  options={serviceTypeOptions}
                  placeholder="Select your service type"
                  error={errors.serviceType?.message}
                  required
                  {...register("serviceType")}
                />

                <Select
                  label="Years of Experience"
                  name="experience"
                  options={experienceOptions}
                  placeholder="Select your experience"
                  error={errors.experience?.message}
                  required
                  {...register("experience")}
                />

                <Input
                  label="Current Workplace/Company (Optional)"
                  name="workplace"
                  placeholder="Enter your current workplace or company name (optional)"
                  error={errors.workplace?.message}
                  {...register("workplace")}
                />

                <Input
                  label="Service Fee (₹)"
                  name="serviceFee"
                  type="number"
                  placeholder="Enter your service fee per hour/service"
                  error={errors.serviceFee?.message}
                  required
                  {...register("serviceFee")}
                />

                <Input
                  label="Skills/Qualifications (Optional)"
                  name="qualifications"
                  placeholder="Enter your skills, certifications, or qualifications"
                  error={errors.qualifications?.message}
                  {...register("qualifications")}
                />

                <Input
                  label="Certification/License Number (Optional)"
                  name="certificationNumber"
                  placeholder="Enter certification or license number if applicable"
                  error={errors.certificationNumber?.message}
                  {...register("certificationNumber")}
                />

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Location Information
                  </h3>
                  <Input
                    label="Street Address"
                    name="street"
                    placeholder="Enter your street address"
                    error={errors.street?.message}
                    required
                    {...register("street")}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="city"
                      placeholder="Enter your city"
                      error={errors.city?.message}
                      required
                      {...register("city")}
                    />
                    <Input
                      label="State"
                      name="state"
                      placeholder="Enter your state"
                      error={errors.state?.message}
                      required
                      {...register("state")}
                    />
                  </div>
                  <Input
                    label="Pincode"
                    name="pincode"
                    placeholder="Enter 6-digit pincode"
                    error={errors.pincode?.message}
                    required
                    {...register("pincode")}
                  />
                </div>
              </>
            )}

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
              error={errors.password?.message}
              required
              {...register("password")}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              required
              {...register("confirmPassword")}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
