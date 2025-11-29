import React from "react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";

const MedicalCareStep = ({
  register,
  errors,
  touchedFields,
  isSubmitted,
  watch,
  setValue,
}) => {
  const mobilityStatus = watch("mobilityStatus");
  const highIntensityCare = watch("highIntensityCareSupport") || [];

  const highIntensityOptions = [
    "Tracheotomy Care",
    "Diabetic Care Management",
    "Stoma Care Management",
    "Wound Care Management",
    "Dementia Care",
    "Peg Feed",
    "NG feed",
    "Bowl Management Care",
    "Medication Management Care",
    "Pressure Area Care Management",
    "Urinary Catheter Management",
    "Respiratory Care",
    "Renal Dialysis",
    "Cardiac Care Management",
    "Weight Loss Management / Obesity Care",
    "Behavior Care",
    "Palliative Care Management",
    "Neurological Care",
    "Brain Injury Care",
    "Spinal Injury Care",
    "Multiple Sclerosis",
    "Other",
  ];

  const handleHighIntensityChange = (option) => {
    const current = highIntensityCare;
    if (current.includes(option)) {
      setValue(
        "highIntensityCareSupport",
        current.filter((item) => item !== option)
      );
    } else {
      setValue("highIntensityCareSupport", [...current, option]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Medical & Care Requirements
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Please provide medical diagnosis and care support information.
        </p>
      </div>

      {/* Medical Diagnosis */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Medical Diagnosis</h4>
        <Select
          label="Medical Diagnosis"
          name="medicalDiagnosis"
          {...register("medicalDiagnosis")}
          options={[
            { value: "", label: "Select..." },
            { value: "Primary", label: "Primary" },
            { value: "Secondary", label: "Secondary" },
          ]}
        />
        <Textarea
          label="Co-morbid Condition"
          name="comorbidCondition"
          {...register("comorbidCondition")}
          rows={4}
        />
        <Textarea
          label="Allergies"
          name="allergies"
          {...register("allergies")}
          rows={4}
        />
      </div>

      {/* Type of Care Support */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Type of Care Support</h4>
        <Select
          label="Type of Care Support"
          name="typeOfCareSupport"
          {...register("typeOfCareSupport")}
          options={[
            { value: "", label: "Select..." },
            { value: "24/7 Support Care", label: "24/7 Support Care" },
            { value: "Sleepover Night Staff", label: "Sleepover Night Staff" },
            { value: "Active Night Staff", label: "Active Night Staff" },
            { value: "Drop In Support Staff", label: "Drop In Support Staff" },
          ]}
        />
      </div>

      {/* High Intensity Care Support */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">
          High Intensity Care Support Needs
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {highIntensityOptions.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={highIntensityCare.includes(option)}
                onChange={() => handleHighIntensityChange(option)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        {highIntensityCare.includes("Urinary Catheter Management") && (
          <Select
            label="If Urinary Catheter Care required please specify"
            name="urinaryCatheterType"
            {...register("urinaryCatheterType")}
            options={[
              { value: "", label: "Select..." },
              { value: "IDC", label: "IDC" },
              { value: "SPC", label: "SPC" },
            ]}
            error={
              (touchedFields.urinaryCatheterType || isSubmitted) &&
              errors.urinaryCatheterType
                ? errors.urinaryCatheterType.message
                : null
            }
            required
          />
        )}
      </div>

      {/* Mobility */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Mobility</h4>
        <Select
          label="Participants mobility status"
          name="mobilityStatus"
          {...register("mobilityStatus")}
          options={[
            { value: "", label: "Select..." },
            { value: "Ambulant", label: "Ambulant" },
            { value: "Non Ambulant", label: "Non Ambulant" },
          ]}
        />
        {mobilityStatus === "Non Ambulant" && (
          <Select
            label="If Non Ambulant what Mobility Aid are you using"
            name="mobilityAid"
            {...register("mobilityAid")}
            options={[
              { value: "", label: "Select..." },
              { value: "Wheelchair", label: "Wheelchair" },
              { value: "Electric Wheelchair", label: "Electric Wheelchair" },
              { value: "4 Wheel Walker", label: "4 Wheel Walker" },
              {
                value: "Walking with Assistance",
                label: "Walking with Assistance",
              },
              { value: "Other", label: "Other" },
            ]}
            error={
              (touchedFields.mobilityAid || isSubmitted) && errors.mobilityAid
                ? errors.mobilityAid.message
                : null
            }
            required
          />
        )}
      </div>
    </div>
  );
};

export default MedicalCareStep;



