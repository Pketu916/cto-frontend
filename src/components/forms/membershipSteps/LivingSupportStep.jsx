import React from "react";
import Select from "../../ui/Select";

const supportLevels = [
  { value: "", label: "Select..." },
  { value: "Independent", label: "Independent" },
  { value: "Assistance", label: "Assistance" },
  { value: "Supervision", label: "Supervision" },
  { value: "Dependent", label: "Dependent" },
];

const LivingSupportStep = ({
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
          Living Situation & Support Needs
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Please indicate your support needs for each area.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Personal Care Support"
          name="personalCareSupport"
          {...register("personalCareSupport")}
          options={supportLevels}
        />
        <Select
          label="Domestic Support"
          name="domesticSupport"
          {...register("domesticSupport")}
          options={supportLevels}
        />
        <Select
          label="Shopping Support"
          name="shoppingSupport"
          {...register("shoppingSupport")}
          options={supportLevels}
        />
        <Select
          label="Medication Management"
          name="medicationManagement"
          {...register("medicationManagement")}
          options={supportLevels}
        />
        <Select
          label="Transport"
          name="transport"
          {...register("transport")}
          options={supportLevels}
        />
        <Select
          label="Mobility Support"
          name="mobilitySupport"
          {...register("mobilitySupport")}
          options={supportLevels}
        />
        <Select
          label="Social and Community Participation"
          name="socialCommunityParticipation"
          {...register("socialCommunityParticipation")}
          options={supportLevels}
        />
        <Select
          label="Supported Employment"
          name="supportedEmployment"
          {...register("supportedEmployment")}
          options={supportLevels}
        />
        <Select
          label="Medical & Specialists Appointment"
          name="medicalSpecialistsAppointment"
          {...register("medicalSpecialistsAppointment")}
          options={supportLevels}
        />
        <Select
          label="Meal Preparation"
          name="mealPreparation"
          {...register("mealPreparation")}
          options={supportLevels}
        />
        <Select
          label="Feeding Support"
          name="feedingSupport"
          {...register("feedingSupport")}
          options={supportLevels}
        />
        <Select
          label="Grooming Support"
          name="groomingSupport"
          {...register("groomingSupport")}
          options={supportLevels}
        />
        <Select
          label="Communication"
          name="communication"
          {...register("communication")}
          options={supportLevels}
        />
        <Select
          label="Bed to Chair Transfers"
          name="bedToChairTransfers"
          {...register("bedToChairTransfers")}
          options={supportLevels}
        />
        <Select
          label="Bed Care"
          name="bedCare"
          {...register("bedCare")}
          options={supportLevels}
        />
        <Select
          label="Bowel Management"
          name="bowelManagement"
          {...register("bowelManagement")}
          options={supportLevels}
        />
        <Select
          label="Incontinence Management"
          name="incontinenceManagement"
          {...register("incontinenceManagement")}
          options={supportLevels}
        />
        <Select
          label="Financial Management"
          name="financialManagement"
          {...register("financialManagement")}
          options={supportLevels}
        />
      </div>

      <Select
        label="Lifestyle Day to Day Decisions"
        name="lifestyleDayToDayDecisions"
        {...register("lifestyleDayToDayDecisions")}
        options={[
          { value: "", label: "Select..." },
          { value: "Sound Mind", label: "Sound Mind" },
          { value: "Mild", label: "Mild" },
          { value: "Moderate", label: "Moderate" },
          { value: "Severe", label: "Severe" },
        ]}
      />
    </div>
  );
};

export default LivingSupportStep;



