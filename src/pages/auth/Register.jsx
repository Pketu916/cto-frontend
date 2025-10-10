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
    baseSchema.specialization = yup
      .string()
      .required("Specialization is required");
    baseSchema.experience = yup
      .string()
      .required("Years of experience is required");
    baseSchema.licenseNumber = yup
      .string()
      .required("License number is required");
    baseSchema.qualification = yup
      .string()
      .required("Qualification is required");
    baseSchema.hospital = yup
      .string()
      .required("Current hospital/clinic is required");
    baseSchema.consultationFee = yup
      .number()
      .min(0, "Consultation fee must be positive")
      .required("Consultation fee is required");
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
        setRegisterError(result.message);
        showError(result.message);
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

  const specializationOptions = [
    { value: "general-medicine", label: "General Medicine" },
    { value: "cardiology", label: "Cardiology" },
    { value: "neurology", label: "Neurology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "dermatology", label: "Dermatology" },
    { value: "psychiatry", label: "Psychiatry" },
    { value: "emergency-medicine", label: "Emergency Medicine" },
    { value: "home-care", label: "Home Care" },
    { value: "telehealth", label: "Telehealth" },
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
                  label="Specialization"
                  name="specialization"
                  options={specializationOptions}
                  placeholder="Select your specialization"
                  error={errors.specialization?.message}
                  required
                  {...register("specialization")}
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
                  label="License Number"
                  name="licenseNumber"
                  placeholder="Enter your medical license number"
                  error={errors.licenseNumber?.message}
                  required
                  {...register("licenseNumber")}
                />

                <Input
                  label="Qualification"
                  name="qualification"
                  placeholder="Enter your qualification (e.g., MBBS, MD)"
                  error={errors.qualification?.message}
                  required
                  {...register("qualification")}
                />

                <Input
                  label="Current Hospital/Clinic"
                  name="hospital"
                  placeholder="Enter your current hospital or clinic name"
                  error={errors.hospital?.message}
                  required
                  {...register("hospital")}
                />

                <Input
                  label="Consultation Fee (₹)"
                  name="consultationFee"
                  type="number"
                  placeholder="Enter consultation fee in rupees"
                  error={errors.consultationFee?.message}
                  required
                  {...register("consultationFee")}
                />
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
