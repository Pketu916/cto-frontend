import React from "react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";

const yesNoOptions = [
  { value: "", label: "Select..." },
  { value: "YES", label: "YES" },
  { value: "NO", label: "NO" },
  { value: "Not Applicable", label: "Not Applicable" },
];

const EquipmentPreferencesStep = ({
  register,
  errors,
  touchedFields,
  isSubmitted,
  watch,
  setValue,
}) => {
  const needInterpreter = watch("needInterpreter");
  const respiratoryEquipment = watch("respiratoryEquipment") || [];

  const respiratoryOptions = [
    "CPAP",
    "Ventilator",
    "Oxygen Concentrator",
    "Oxygen",
  ];

  const handleRespiratoryChange = (option) => {
    const current = respiratoryEquipment;
    if (current.includes(option)) {
      setValue(
        "respiratoryEquipment",
        current.filter((item) => item !== option)
      );
    } else {
      setValue("respiratoryEquipment", [...current, option]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Equipment & Preferences
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Please provide information about equipment needs and preferences.
        </p>
      </div>

      {/* Equipment */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Equipment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Monkey Bar"
            name="monkeyBar"
            {...register("monkeyBar")}
            options={yesNoOptions}
          />
          <Select
            label="Sliding Table"
            name="slidingTable"
            {...register("slidingTable")}
            options={yesNoOptions}
          />
          <Select
            label="Bedside Table"
            name="bedsideTable"
            {...register("bedsideTable")}
            options={yesNoOptions}
          />
          <Select
            label="Electric Height Adjustment Table"
            name="electricHeightTable"
            {...register("electricHeightTable")}
            options={yesNoOptions}
          />
          <Select
            label="Automatic Door Opening"
            name="automaticDoorOpening"
            {...register("automaticDoorOpening")}
            options={yesNoOptions}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Respiratory Equipments
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {respiratoryOptions.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={respiratoryEquipment.includes(option)}
                  onChange={() => handleRespiratoryChange(option)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Telehealth Device"
            name="telehealthDevice"
            {...register("telehealthDevice")}
            options={yesNoOptions}
          />
          <Select
            label="Self Dispensing Medication Device"
            name="selfDispensingMedication"
            {...register("selfDispensingMedication")}
            options={yesNoOptions}
          />
          <Select
            label="Special Gown"
            name="specialGown"
            {...register("specialGown")}
            options={yesNoOptions}
          />
          <Select
            label="Personal Protective Equipment"
            name="personalProtectiveEquipment"
            {...register("personalProtectiveEquipment")}
            options={yesNoOptions}
          />
          <Select
            label="Communication Devices"
            name="communicationDevices"
            {...register("communicationDevices")}
            options={yesNoOptions}
          />
          <Select
            label="Telehealth System"
            name="telehealthSystem"
            {...register("telehealthSystem")}
            options={yesNoOptions}
          />
          <Select
            label="Urgent / Vital Call System"
            name="urgentCallSystem"
            {...register("urgentCallSystem")}
            options={yesNoOptions}
          />
          <Select
            label="Software Application Assistance"
            name="softwareApplicationAssistance"
            {...register("softwareApplicationAssistance")}
            options={yesNoOptions}
          />
          <Select
            label="Bedai Toilet Assistance System"
            name="bedaiToiletAssistance"
            {...register("bedaiToiletAssistance")}
            options={yesNoOptions}
          />
          <Select
            label="Air Condition"
            name="airCondition"
            {...register("airCondition")}
            options={yesNoOptions}
          />
        </div>
      </div>

      {/* Section 5 */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Section 5</h4>
        <Select
          label="Bed Care (Section 5)"
          name="bedCareSection5"
          {...register("bedCareSection5")}
          options={[
            { value: "", label: "Select..." },
            { value: "Independent", label: "Independent" },
            { value: "Assistance", label: "Assistance" },
            { value: "Supervision", label: "Supervision" },
            { value: "Dependent", label: "Dependent" },
          ]}
        />
        <Select
          label="Bowel Management (Section 5)"
          name="bowelManagementSection5"
          {...register("bowelManagementSection5")}
          options={[
            { value: "", label: "Select..." },
            { value: "Bed Pan", label: "Bed Pan" },
            { value: "Commode Chair", label: "Commode Chair" },
            { value: "Bariatric Commode", label: "Bariatric Commode" },
            { value: "Not Applicable", label: "Not Applicable" },
          ]}
        />
        <Select
          label="Incontinence Management (Section 5)"
          name="incontinenceManagementSection5"
          {...register("incontinenceManagementSection5")}
          options={yesNoOptions}
        />
        <Select
          label="Skill Development Education Program"
          name="skillDevelopmentEducation"
          {...register("skillDevelopmentEducation")}
          options={yesNoOptions}
        />
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Preferences</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="LGA of Preference 1"
            name="lgaPreference1"
            {...register("lgaPreference1")}
          />
          <Input
            label="LGA of Preference 2"
            name="lgaPreference2"
            {...register("lgaPreference2")}
          />
          <Input
            label="LGA of Preference 3"
            name="lgaPreference3"
            {...register("lgaPreference3")}
          />
        </div>
        <Textarea
          label="Cultural Specific"
          name="culturalSpecific"
          {...register("culturalSpecific")}
          rows={3}
        />
        <Textarea
          label="Gender Specific"
          name="genderSpecific"
          {...register("genderSpecific")}
          rows={3}
        />
        <Textarea
          label="Aged Specific"
          name="agedSpecific"
          {...register("agedSpecific")}
          rows={3}
        />
        <Textarea
          label="Religion"
          name="religion"
          {...register("religion")}
          rows={3}
        />
      </div>

      {/* Language & Cultural */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Language & Cultural</h4>
        <Select
          label="Do you need Interpreter"
          name="needInterpreter"
          {...register("needInterpreter")}
          options={[
            { value: "", label: "Select..." },
            { value: "YES", label: "YES" },
            { value: "NO", label: "NO" },
          ]}
        />
        {needInterpreter === "YES" && (
          <Input
            label="If YES what language do you speak at home"
            name="homeLanguage"
            {...register("homeLanguage")}
            error={
              (touchedFields.homeLanguage || isSubmitted) && errors.homeLanguage
                ? errors.homeLanguage.message
                : null
            }
            required
          />
        )}
        <Select
          label="English Language"
          name="englishLanguage"
          {...register("englishLanguage")}
          options={[
            { value: "", label: "Select..." },
            { value: "Can't speak", label: "Can't speak" },
            { value: "Can't Understand", label: "Can't Understand" },
            { value: "Manage", label: "Manage" },
            { value: "Good", label: "Good" },
            { value: "Excellent", label: "Excellent" },
          ]}
        />
        <Select
          label="Are you Aboriginal and Torres Strait Islander"
          name="aboriginalTorresStrait"
          {...register("aboriginalTorresStrait")}
          options={[
            { value: "", label: "Select..." },
            { value: "YES", label: "YES" },
            { value: "NO", label: "NO" },
          ]}
        />
        <Select
          label="Staff Care to Participant Ratio"
          name="staffCareRatio"
          {...register("staffCareRatio")}
          options={[
            { value: "", label: "Select..." },
            { value: "1:1", label: "1:1" },
            { value: "1:2", label: "1:2" },
            { value: "2:1", label: "2:1" },
            { value: "2:2", label: "2:2" },
            { value: "3:2", label: "3:2" },
          ]}
        />
      </div>
    </div>
  );
};

export default EquipmentPreferencesStep;



