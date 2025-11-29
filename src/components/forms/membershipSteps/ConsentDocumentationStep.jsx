import React from "react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";

const ConsentDocumentationStep = ({
  register,
  errors,
  touchedFields,
  isSubmitted,
  watch,
  setValue,
}) => {
  const consentType = watch("consentType");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Consent & Documentation
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Please provide consent information and documentation details.
        </p>
      </div>

      {/* Consent */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Consent</h4>
        <Select
          label="Type a question (Consent)"
          name="consentType"
          {...register("consentType")}
          options={[
            { value: "", label: "Select..." },
            { value: "YES", label: "YES" },
            { value: "NO", label: "NO" },
            { value: "Verbal Consent", label: "Verbal Consent" },
            { value: "Written Consent", label: "Written Consent" },
          ]}
          error={
            (touchedFields.consentType || isSubmitted) && errors.consentType
              ? errors.consentType.message
              : null
          }
          required
        />

        {consentType && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900">Consent Details</h5>
            <Input
              label="Referrer Name (Consent)"
              name="consentReferrerName"
              {...register("consentReferrerName")}
            />
            <Input label="Position" name="position" {...register("position")} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contact Number"
                name="consentContactNumber"
                {...register("consentContactNumber")}
              />
              <Input
                label="Email address"
                name="consentEmail"
                type="email"
                {...register("consentEmail")}
              />
            </div>
            <Input
              label="Organisation Name"
              name="organisationName"
              {...register("organisationName")}
            />
            <Input
              label="Relationship (Consent)"
              name="consentRelationship"
              {...register("consentRelationship")}
            />
            {consentType === "Written Consent" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("signature")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please provide your signature or type your name to confirm"
                  error={
                    (touchedFields.signature || isSubmitted) && errors.signature
                      ? errors.signature.message
                      : null
                  }
                />
                {(touchedFields.signature || isSubmitted) &&
                  errors.signature && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.signature.message}
                    </p>
                  )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Documentation */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Documentation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="1. NDIA PLAN"
            name="hasNdiaPlan"
            {...register("hasNdiaPlan")}
            options={[
              { value: "", label: "Select..." },
              { value: "YES", label: "YES" },
              { value: "NO", label: "NO" },
            ]}
          />
          <Select
            label="1. Clinical Care Plan"
            name="hasClinicalCarePlan"
            {...register("hasClinicalCarePlan")}
            options={[
              { value: "", label: "Select..." },
              { value: "YES", label: "YES" },
              { value: "NO", label: "NO" },
            ]}
          />
          <Select
            label="3. Hospital Discharge Report"
            name="hasHospitalDischargeReport"
            {...register("hasHospitalDischargeReport")}
            options={[
              { value: "", label: "Select..." },
              { value: "YES", label: "YES" },
              { value: "NO", label: "NO" },
            ]}
          />
          <Select
            label="Aged Care Package Support Plan"
            name="hasAgedCarePackagePlan"
            {...register("hasAgedCarePackagePlan")}
            options={[
              { value: "", label: "Select..." },
              { value: "YES", label: "YES" },
              { value: "NO", label: "NO" },
            ]}
          />
        </div>
        <Input
          label="Other Document"
          name="otherDocument"
          {...register("otherDocument")}
        />
      </div>
    </div>
  );
};

export default ConsentDocumentationStep;



