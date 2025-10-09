import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "../../contexts/ToastContext";
import FormStep from "../../components/auth/ForgotPasswordSteps/FormStep";
import ConfirmationStep from "../../components/auth/ForgotPasswordSteps/ConfirmationStep";

const schema = yup.object({
  email: yup
    .string()
    .email("Valid email address required")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const email = watch("email");

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showSuccess("Password reset instructions have been sent to your email.");
      setIsSubmitted(true);
    } catch (err) {
      showError("Failed to send reset instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showSuccess("Reset instructions have been sent again.");
    } catch (err) {
      showError("Failed to resend email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {isSubmitted ? (
          <ConfirmationStep
            email={email}
            onResend={handleResendEmail}
            isLoading={isLoading}
          />
        ) : (
          <FormStep
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
