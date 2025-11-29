import React from "react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";

const ReferrerGuardianStep = ({
  register,
  errors,
  touchedFields,
  isSubmitted,
  watch,
  setValue,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Referrer & Guardian Information
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Please provide referrer and guardian/next of kin details.
        </p>
      </div>

      {/* Referrer Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Referrer Information</h4>
        <Input
          label="Referrer Name"
          name="referrerName"
          {...register("referrerName")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Referrer Contact Number"
            name="referrerContact"
            {...register("referrerContact")}
            placeholder="(00) 0000-0000"
            error={
              (touchedFields.referrerContact || isSubmitted) &&
              errors.referrerContact
                ? errors.referrerContact.message
                : null
            }
          />
          <Input
            label="Referrer Mobile"
            name="referrerMobile"
            {...register("referrerMobile")}
            placeholder="0000-000-000"
            error={
              (touchedFields.referrerMobile || isSubmitted) &&
              errors.referrerMobile
                ? errors.referrerMobile.message
                : null
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Referrer Email"
            name="referrerEmail"
            type="email"
            {...register("referrerEmail")}
            placeholder="email@example.com"
            error={
              (touchedFields.referrerEmail || isSubmitted) &&
              errors.referrerEmail
                ? errors.referrerEmail.message
                : null
            }
          />
          <Input
            label="Referrer Organisation"
            name="referrerOrganisation"
            {...register("referrerOrganisation")}
          />
        </div>
        <Input
          label="Relationship"
          name="relationship"
          {...register("relationship")}
        />
      </div>

      {/* Guardian/POA Status */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Guardian/POA Status</h4>
        <Select
          label="Guardian/POA Status"
          name="guardianStatus"
          {...register("guardianStatus")}
          options={[
            { value: "", label: "Select..." },
            { value: "Legal Guardian", label: "Legal Guardian" },
            { value: "Trustee", label: "Trustee" },
            { value: "POA", label: "POA" },
            { value: "Not Applicable", label: "Not Applicable" },
          ]}
        />
      </div>

      {/* Next of Kin */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Next of Kin</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="nextOfKinFirstName"
            {...register("nextOfKinFirstName")}
          />
          <Input
            label="Last Name"
            name="nextOfKinLastName"
            {...register("nextOfKinLastName")}
          />
        </div>
        <div className="space-y-4">
          <Input
            label="Street Address"
            name="nextOfKinStreet"
            {...register("nextOfKinStreet")}
          />
          <Input
            label="Street Address Line 2"
            name="nextOfKinStreet2"
            {...register("nextOfKinStreet2")}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              name="nextOfKinCity"
              {...register("nextOfKinCity")}
            />
            <Input
              label="State / Province"
              name="nextOfKinState"
              {...register("nextOfKinState")}
            />
            <Input
              label="Postal / Zip Code"
              name="nextOfKinPostcode"
              {...register("nextOfKinPostcode")}
            />
          </div>
        </div>
        <Select
          label="Next of Kin Status"
          name="nextOfKinStatus"
          {...register("nextOfKinStatus")}
          options={[
            { value: "", label: "Select..." },
            { value: "Carer", label: "Carer" },
            { value: "Spouse", label: "Spouse" },
            { value: "Parent", label: "Parent" },
            { value: "Son", label: "Son" },
            { value: "Daughter", label: "Daughter" },
            { value: "Relative", label: "Relative" },
            { value: "Friend", label: "Friend" },
          ]}
        />
      </div>
    </div>
  );
};

export default ReferrerGuardianStep;



