import React from "react";
import { Shield } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const InsuranceSection = ({
  useInsurance,
  onInsuranceToggle,
  register,
  errors,
  insuranceVerified,
  onVerifyInsurance,
  setValue,
}) => {
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <Shield className="w-5 h-5 mr-2 text-blue-600" />
        <h4 className="text-lg font-semibold text-gray-900">
          Insurance Coverage Available
        </h4>
      </div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="useInsurance"
          checked={useInsurance}
          onChange={onInsuranceToggle}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          htmlFor="useInsurance"
          className="ml-2 text-sm font-medium text-gray-700"
        >
          I want to use insurance for this service
        </label>
      </div>

      {useInsurance && (
        <div className="space-y-4 bg-white rounded-lg p-4 border border-blue-200">
          <Input
            label="Insurance Provider"
            name="insuranceProvider"
            placeholder="Enter insurance company name"
            error={errors.insuranceProvider?.message}
            required
            {...register("insuranceProvider")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Policy Number"
              name="insurancePolicyNumber"
              placeholder="Enter policy number"
              error={errors.insurancePolicyNumber?.message}
              required
              {...register("insurancePolicyNumber")}
            />

            <Input
              label="Member ID"
              name="insuranceMemberId"
              placeholder="Enter member ID"
              error={errors.insuranceMemberId?.message}
              required
              {...register("insuranceMemberId")}
            />
          </div>

          <Input
            label="Group Number (Optional)"
            name="insuranceGroupNumber"
            placeholder="Enter group number if applicable"
            error={errors.insuranceGroupNumber?.message}
            {...register("insuranceGroupNumber")}
          />

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onVerifyInsurance}
              disabled={insuranceVerified}
              className="flex items-center"
            >
              <Shield className="w-4 h-4 mr-2" />
              {insuranceVerified ? "Insurance Verified ✓" : "Verify Insurance"}
            </Button>
            {insuranceVerified && (
              <div className="text-sm text-green-600 font-medium">
                ✓ Insurance Verified
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceSection;
