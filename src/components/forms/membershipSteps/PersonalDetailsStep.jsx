import React from "react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";

const PersonalDetailsStep = ({
  register,
  errors,
  touchedFields,
  isSubmitted,
  watch,
  setValue,
}) => {
  const ndisOrAgedCare = watch("ndisOrAgedCare");
  const centerlinkPension = watch("centerlinkPension");
  const medicareNo = watch("medicareNo");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Personal Details
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Please provide your personal information below.
        </p>
      </div>

      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          {...register("firstName")}
          error={
            (touchedFields.firstName || isSubmitted) && errors.firstName
              ? errors.firstName.message
              : null
          }
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          {...register("lastName")}
          error={
            (touchedFields.lastName || isSubmitted) && errors.lastName
              ? errors.lastName.message
              : null
          }
          required
        />
      </div>

      {/* NSW Hospital CRN */}
      <Input
        label="NSW Hospital CRN"
        name="nswHospitalCRN"
        {...register("nswHospitalCRN")}
        error={
          (touchedFields.nswHospitalCRN || isSubmitted) && errors.nswHospitalCRN
            ? errors.nswHospitalCRN.message
            : null
        }
      />

      {/* Centerlink Pension */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Centerlink Pension"
          name="centerlinkPension"
          {...register("centerlinkPension")}
          options={[
            { value: "", label: "Select..." },
            { value: "Disability", label: "Disability" },
            { value: "Senior", label: "Senior" },
            { value: "Other", label: "Other" },
            { value: "Not Applicable", label: "Not Applicable" },
          ]}
          error={
            (touchedFields.centerlinkPension || isSubmitted) &&
            errors.centerlinkPension
              ? errors.centerlinkPension.message
              : null
          }
        />
        {centerlinkPension && centerlinkPension !== "Not Applicable" && (
          <Input
            label="Expiry Date (DD-MM-YYYY)"
            name="centerlinkPensionExpiry"
            {...register("centerlinkPensionExpiry")}
            placeholder="DD-MM-YYYY"
            error={
              (touchedFields.centerlinkPensionExpiry || isSubmitted) &&
              errors.centerlinkPensionExpiry
                ? errors.centerlinkPensionExpiry.message
                : null
            }
            required
          />
        )}
      </div>

      {/* Medicare */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Medicare No"
          name="medicareNo"
          {...register("medicareNo")}
          error={
            (touchedFields.medicareNo || isSubmitted) && errors.medicareNo
              ? errors.medicareNo.message
              : null
          }
        />
        {medicareNo && (
          <>
            <Input
              label="Reference Number"
              name="medicareRefNo"
              {...register("medicareRefNo")}
              error={
                (touchedFields.medicareRefNo || isSubmitted) &&
                errors.medicareRefNo
                  ? errors.medicareRefNo.message
                  : null
              }
            />
            <Input
              label="Expiry Date (DD-MM-YYYY)"
              name="medicareExpiry"
              {...register("medicareExpiry")}
              placeholder="DD-MM-YYYY"
              error={
                (touchedFields.medicareExpiry || isSubmitted) &&
                errors.medicareExpiry
                  ? errors.medicareExpiry.message
                  : null
              }
              required
            />
          </>
        )}
      </div>

      {/* NDIS or Aged Care */}
      <Select
        label="NDIS participant or Aged Care participant"
        name="ndisOrAgedCare"
        {...register("ndisOrAgedCare")}
        options={[
          { value: "", label: "Select..." },
          { value: "NDIS", label: "NDIS" },
          { value: "Aged Care", label: "Aged Care" },
        ]}
        error={
          (touchedFields.ndisOrAgedCare || isSubmitted) && errors.ndisOrAgedCare
            ? errors.ndisOrAgedCare.message
            : null
        }
      />

      {ndisOrAgedCare === "NDIS" && (
        <Input
          label="NDIS Participant ID"
          name="ndisParticipantId"
          {...register("ndisParticipantId")}
          error={
            (touchedFields.ndisParticipantId || isSubmitted) &&
            errors.ndisParticipantId
              ? errors.ndisParticipantId.message
              : null
          }
          required
        />
      )}

      {ndisOrAgedCare === "Aged Care" && (
        <Input
          label="Aged Care ID"
          name="agedCareId"
          {...register("agedCareId")}
          error={
            (touchedFields.agedCareId || isSubmitted) && errors.agedCareId
              ? errors.agedCareId.message
              : null
          }
          required
        />
      )}

      {/* Date of Birth & Age */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date of Birth (DD-MM-YYYY)"
          name="dateOfBirth"
          {...register("dateOfBirth")}
          placeholder="DD-MM-YYYY"
          error={
            (touchedFields.dateOfBirth || isSubmitted) && errors.dateOfBirth
              ? errors.dateOfBirth.message
              : null
          }
          required
        />
        <Input
          label="Age"
          name="age"
          type="number"
          {...register("age", { valueAsNumber: true })}
          error={
            (touchedFields.age || isSubmitted) && errors.age
              ? errors.age.message
              : null
          }
          required
        />
      </div>

      {/* Gender */}
      <Select
        label="Gender"
        name="gender"
        {...register("gender")}
        options={[
          { value: "", label: "Select..." },
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ]}
        error={
          (touchedFields.gender || isSubmitted) && errors.gender
            ? errors.gender.message
            : null
        }
        required
      />

      {/* Home Address */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Home Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Door/Apt No"
            name="homeAddressDoor"
            {...register("homeAddressDoor")}
          />
          <Input
            label="Street Name"
            name="homeAddressStreet"
            {...register("homeAddressStreet")}
            error={
              (touchedFields.homeAddressStreet || isSubmitted) &&
              errors.homeAddressStreet
                ? errors.homeAddressStreet.message
                : null
            }
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Suburb"
            name="homeAddressSuburb"
            {...register("homeAddressSuburb")}
            error={
              (touchedFields.homeAddressSuburb || isSubmitted) &&
              errors.homeAddressSuburb
                ? errors.homeAddressSuburb.message
                : null
            }
            required
          />
          <Select
            label="State"
            name="homeAddressState"
            {...register("homeAddressState")}
            options={[
              { value: "", label: "Select..." },
              { value: "ACT", label: "ACT" },
              { value: "NSW", label: "NSW" },
              { value: "NT", label: "NT" },
              { value: "QLD", label: "QLD" },
              { value: "SA", label: "SA" },
              { value: "TAS", label: "TAS" },
              { value: "VIC", label: "VIC" },
              { value: "WA", label: "WA" },
            ]}
            error={
              (touchedFields.homeAddressState || isSubmitted) &&
              errors.homeAddressState
                ? errors.homeAddressState.message
                : null
            }
            required
          />
          <Input
            label="Post Code"
            name="homeAddressPostcode"
            {...register("homeAddressPostcode")}
            error={
              (touchedFields.homeAddressPostcode || isSubmitted) &&
              errors.homeAddressPostcode
                ? errors.homeAddressPostcode.message
                : null
            }
            required
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Landline Number"
            name="landlineNumber"
            {...register("landlineNumber")}
            placeholder="(00) 0000-0000"
            error={
              (touchedFields.landlineNumber || isSubmitted) &&
              errors.landlineNumber
                ? errors.landlineNumber.message
                : null
            }
          />
          <Input
            label="Mobile Number"
            name="mobileNumber"
            {...register("mobileNumber")}
            placeholder="0000-000-000"
            error={
              (touchedFields.mobileNumber || isSubmitted) && errors.mobileNumber
                ? errors.mobileNumber.message
                : null
            }
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            {...register("email")}
            placeholder="email@example.com"
            error={
              (touchedFields.email || isSubmitted) && errors.email
                ? errors.email.message
                : null
            }
            required
          />
          <Input
            label="Carer Mobile"
            name="carerMobile"
            {...register("carerMobile")}
            placeholder="0000-000-000"
            error={
              (touchedFields.carerMobile || isSubmitted) && errors.carerMobile
                ? errors.carerMobile.message
                : null
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsStep;
