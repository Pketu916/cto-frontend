import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { membershipFormSchema } from "./membershipFormSchema";
import { useToast } from "../../contexts/ToastContext";
import { membershipAPI } from "../../services/api";
import StepIndicator from "./StepIndicator";
import { STEP_LABELS as MEMBERSHIP_STEP_LABELS } from "./membershipFormConstants";
import PersonalDetailsStep from "./membershipSteps/PersonalDetailsStep";
import ReferrerGuardianStep from "./membershipSteps/ReferrerGuardianStep";
import IncomeFundingStep from "./membershipSteps/IncomeFundingStep";
import LivingSupportStep from "./membershipSteps/LivingSupportStep";
import MedicalCareStep from "./membershipSteps/MedicalCareStep";
import EquipmentPreferencesStep from "./membershipSteps/EquipmentPreferencesStep";
import ConsentDocumentationStep from "./membershipSteps/ConsentDocumentationStep";
import { Button } from "../ui";

const TOTAL_STEPS = 7;

const MembershipForm = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(membershipFormSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "firstError",
    shouldFocusError: true,
    defaultValues: {
      highIntensityCareSupport: [],
      respiratoryEquipment: [],
    },
  });

  const formValues = watch();

  // Get fields that need validation for each step
  const getStepFields = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return [
          "firstName",
          "lastName",
          "dateOfBirth",
          "age",
          "gender",
          "homeAddressStreet",
          "homeAddressSuburb",
          "homeAddressState",
          "homeAddressPostcode",
          "mobileNumber",
          "email",
        ];
      case 2:
        return [];
      case 3:
        return ["currentResidence"];
      case 4:
        return [];
      case 5:
        return [];
      case 6:
        return [];
      case 7:
        return ["consentType"];
      default:
        return [];
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

      const allFieldsFilled = stepFields.every((field) => {
        const value = formData[field];
        if (field === "age") {
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

      return allFieldsFilled;
    }

    return true;
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

    if (isValid && isStepValid(step)) {
      if (step < TOTAL_STEPS) {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
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

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await membershipAPI.submitMembership(data);

      if (response.success) {
        showSuccess("Membership form submitted successfully!");

        if (onSuccess) {
          onSuccess(response);
        } else {
          navigate("/membership");
        }
      } else {
        showError(response.message || "Failed to submit membership form.");
      }
    } catch (error) {
      console.error("Membership submission error:", error);
      showError(
        error.response?.data?.message ||
          "Failed to submit membership form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">
          Membership Registration Form
        </h2>
        <p className="text-gray-600 mt-1">
          Please fill out all required fields to complete your membership
          registration.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="p-6">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <PersonalDetailsStep
              register={register}
              errors={errors}
              touchedFields={touchedFields}
              isSubmitted={isSubmitted}
              watch={watch}
              setValue={setValue}
            />
          )}

          {/* Step 2: Referrer & Guardian */}
          {step === 2 && (
            <ReferrerGuardianStep
              register={register}
              errors={errors}
              touchedFields={touchedFields}
              isSubmitted={isSubmitted}
              watch={watch}
              setValue={setValue}
            />
          )}

          {/* Step 3: Income & Funding */}
          {step === 3 && (
            <IncomeFundingStep
              register={register}
              errors={errors}
              touchedFields={touchedFields}
              isSubmitted={isSubmitted}
              watch={watch}
              setValue={setValue}
            />
          )}

          {/* Step 4: Living & Support */}
          {step === 4 && (
            <LivingSupportStep
              register={register}
              errors={errors}
              touchedFields={touchedFields}
              isSubmitted={isSubmitted}
              watch={watch}
              setValue={setValue}
            />
          )}

          {/* Step 5: Medical & Care */}
          {step === 5 && (
            <MedicalCareStep
              register={register}
              errors={errors}
              touchedFields={touchedFields}
              isSubmitted={isSubmitted}
              watch={watch}
              setValue={setValue}
            />
          )}

          {/* Step 6: Equipment & Preferences */}
          {step === 6 && (
            <EquipmentPreferencesStep
              register={register}
              errors={errors}
              touchedFields={touchedFields}
              isSubmitted={isSubmitted}
              watch={watch}
              setValue={setValue}
            />
          )}

          {/* Step 7: Consent & Documentation */}
          {step === 7 && (
            <ConsentDocumentationStep
              register={register}
              errors={errors}
              touchedFields={touchedFields}
              isSubmitted={isSubmitted}
              watch={watch}
              setValue={setValue}
            />
          )}
        </div>

        <StepIndicator
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          stepLabels={MEMBERSHIP_STEP_LABELS}
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

        {/* Form Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <div>
            {step > 1 && (
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting || !isStepValid(step)}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !isStepValid(step)}
                loading={isSubmitting}
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default MembershipForm;
