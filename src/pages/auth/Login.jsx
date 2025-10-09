import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { User, Shield, Settings } from "lucide-react";

const schema = yup.object({
  email: yup
    .string()
    .email("Valid email address required")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  userType: yup
    .string()
    .oneOf(["user", "provider", "admin"], "Invalid user type")
    .required("User type is required"),
});

const userTypeOptions = [
  { value: "user", label: "Patient", icon: User },
  { value: "provider", label: "Healthcare Provider", icon: Shield },
  { value: "admin", label: "Administrator", icon: Settings },
];

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedUserType = watch("userType");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError(""); // Clear previous errors

    console.log("📝 Login form submitted:", {
      email: data.email,
      userType: data.userType,
      hasPassword: !!data.password,
    });

    try {
      const result = await login(
        {
          email: data.email,
          password: data.password,
        },
        data.userType
      );

      console.log("🔄 Login result:", result);

      if (result.success) {
        console.log("✅ Login successful, redirecting...");
        showSuccess("Login successful! Welcome back.");

        // Redirect to last visited route or dashboard
        const redirectPath =
          from ||
          (data.userType === "admin"
            ? "/admin/dashboard"
            : data.userType === "provider"
            ? "/provider/dashboard"
            : "/user/dashboard");

        console.log("🚀 Redirecting to:", redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        console.log("❌ Login failed:", result.message);
        setLoginError(result.message);
        showError(result.message);
      }
    } catch (err) {
      console.error("💥 Login error:", err);
      const errorMessage = err.message || "Login failed. Please try again.";
      setLoginError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CTO India</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your account type and sign in
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {loginError && (
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
                    <p className="text-sm font-medium">{loginError}</p>
                  </div>
                </div>
              </div>
            )}

            <Select
              label="Account Type"
              name="userType"
              options={userTypeOptions.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              placeholder="Select your account type"
              error={errors.userType?.message}
              required
              {...register("userType")}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email address"
              error={errors.email?.message}
              required
              {...register("email")}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              required
              {...register("password")}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot your password?
              </Link>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <Link
                to="/register/user"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              >
                Register as Patient
              </Link>
              <Link
                to="/register/provider"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              >
                Register as Healthcare Provider
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
