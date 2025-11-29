import React from "react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";

const IncomeFundingStep = ({
  register,
  errors,
  touchedFields,
  isSubmitted,
  watch,
  setValue,
}) => {
  const receiveIncome = watch("receiveIncome");
  const ndiaParticipant = watch("ndiaParticipant");
  const agedCareFunding = watch("agedCareFunding");
  const receivingNdiaFunding = watch("receivingNdiaFunding");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Income & Funding Information
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Please provide details about your income and funding sources.
        </p>
      </div>

      {/* Income */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Income</h4>
        <Select
          label="Do you receive Income?"
          name="receiveIncome"
          {...register("receiveIncome")}
          options={[
            { value: "", label: "Select..." },
            { value: "YES", label: "YES" },
            { value: "NO", label: "NO" },
          ]}
        />
        {receiveIncome === "YES" && (
          <Select
            label="If yes, what type of Income?"
            name="incomeType"
            {...register("incomeType")}
            options={[
              { value: "", label: "Select..." },
              { value: "Disability pension", label: "Disability pension" },
              { value: "Age Pension", label: "Age Pension" },
              { value: "New Start", label: "New Start" },
              { value: "Self funded", label: "Self funded" },
              { value: "ICARE", label: "ICARE" },
              { value: "Other", label: "Other" },
            ]}
            error={
              (touchedFields.incomeType || isSubmitted) && errors.incomeType
                ? errors.incomeType.message
                : null
            }
            required
          />
        )}
        <Select
          label="Do you receive Centerlink rental allowance?"
          name="centerlinkRentalAllowance"
          {...register("centerlinkRentalAllowance")}
          options={[
            { value: "", label: "Select..." },
            { value: "YES", label: "YES" },
            { value: "NO", label: "NO" },
          ]}
        />
      </div>

      {/* NDIA */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">NDIA</h4>
        <Select
          label="Are you an NDIA participant?"
          name="ndiaParticipant"
          {...register("ndiaParticipant")}
          options={[
            { value: "", label: "Select..." },
            { value: "YES", label: "YES" },
            { value: "NO", label: "NO" },
          ]}
        />
        {ndiaParticipant === "NO" && (
          <Select
            label="If NO, are you an eligible NDIA participant?"
            name="eligibleNdiaParticipant"
            {...register("eligibleNdiaParticipant")}
            options={[
              { value: "", label: "Select..." },
              { value: "YES", label: "YES" },
              { value: "NO", label: "NO" },
            ]}
            error={
              (touchedFields.eligibleNdiaParticipant || isSubmitted) &&
              errors.eligibleNdiaParticipant
                ? errors.eligibleNdiaParticipant.message
                : null
            }
            required
          />
        )}
        <Select
          label="Are you currently receiving NDIA Funding Support"
          name="receivingNdiaFunding"
          {...register("receivingNdiaFunding")}
          options={[
            { value: "", label: "Select..." },
            { value: "YES", label: "YES" },
            { value: "NO", label: "NO" },
          ]}
        />
        {receivingNdiaFunding === "YES" && (
          <>
            <Select
              label="Core Support"
              name="coreSupport"
              {...register("coreSupport")}
              options={[
                { value: "", label: "Select..." },
                {
                  value: "Short Term Accommodation STA",
                  label: "Short Term Accommodation STA",
                },
                {
                  value: "Medium Term Accommodation MTA",
                  label: "Medium Term Accommodation MTA",
                },
                {
                  value: "Support Independent Living SIL",
                  label: "Support Independent Living SIL",
                },
                {
                  value: "Independent Living Option ILO",
                  label: "Independent Living Option ILO",
                },
                {
                  value: "Respite/ flexible respite R",
                  label: "Respite/ flexible respite R",
                },
              ]}
            />
            <Select
              label="Capital Support"
              name="capitalSupport"
              {...register("capitalSupport")}
              options={[
                { value: "", label: "Select..." },
                {
                  value: "Specialised Disability Accommodation SDA",
                  label: "Specialised Disability Accommodation SDA",
                },
                {
                  value: "Assisted Technology and Equipments AT",
                  label: "Assisted Technology and Equipments AT",
                },
                {
                  value: "Home Modification HM",
                  label: "Home Modification HM",
                },
              ]}
            />
            <Select
              label="Capacity Building"
              name="capacityBuilding"
              {...register("capacityBuilding")}
              options={[
                { value: "", label: "Select..." },
                {
                  value: "Support Coordination SC",
                  label: "Support Coordination SC",
                },
                {
                  value: "Specialists Support Coordination SSC",
                  label: "Specialists Support Coordination SSC",
                },
                {
                  value: "Improved Daily Living IDL",
                  label: "Improved Daily Living IDL",
                },
                {
                  value: "Community Nursing CN",
                  label: "Community Nursing CN",
                },
                {
                  value: "Community Participation CP",
                  label: "Community Participation CP",
                },
              ]}
            />
            <Select
              label="NDIA Fund Management"
              name="ndiaFundManagement"
              {...register("ndiaFundManagement")}
              options={[
                { value: "", label: "Select..." },
                { value: "Plan Management PM", label: "Plan Management PM" },
                {
                  value: "NDIA Agencies Management AM",
                  label: "NDIA Agencies Management AM",
                },
                { value: "Self Management SM", label: "Self Management SM" },
              ]}
            />
          </>
        )}
      </div>

      {/* Aged Care Funding */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Aged Care Funding</h4>
        <Select
          label="Aged Care funding"
          name="agedCareFunding"
          {...register("agedCareFunding")}
          options={[
            { value: "", label: "Select..." },
            {
              value: "Homecare Package Level 1",
              label: "Homecare Package Level 1",
            },
            {
              value: "Homecare Package Level 2",
              label: "Homecare Package Level 2",
            },
            {
              value: "Homecare Package Level 3",
              label: "Homecare Package Level 3",
            },
            {
              value: "Homecare Package Level 4",
              label: "Homecare Package Level 4",
            },
            { value: "Flexible Respite", label: "Flexible Respite" },
            { value: "Self Funded", label: "Self Funded" },
            { value: "Other", label: "Other" },
          ]}
        />
        {(!agedCareFunding || agedCareFunding === "Self Funded") && (
          <Select
            label="If you don't have Aged Care Funding are you eligible?"
            name="eligibleAgedCare"
            {...register("eligibleAgedCare")}
            options={[
              { value: "", label: "Select..." },
              { value: "YES", label: "YES" },
              { value: "NO", label: "NO" },
            ]}
            error={
              (touchedFields.eligibleAgedCare || isSubmitted) &&
              errors.eligibleAgedCare
                ? errors.eligibleAgedCare.message
                : null
            }
            required
          />
        )}
      </div>

      {/* Current Residence */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Living Situation</h4>
        <Select
          label="At present where do you reside?"
          name="currentResidence"
          {...register("currentResidence")}
          options={[
            { value: "", label: "Select..." },
            { value: "Rental Home", label: "Rental Home" },
            { value: "Family Home", label: "Family Home" },
            { value: "Aged Care", label: "Aged Care" },
            { value: "Hospital", label: "Hospital" },
            { value: "Friends Place", label: "Friends Place" },
            { value: "Rehub Unit", label: "Rehub Unit" },
            { value: "Group Home", label: "Group Home" },
            { value: "Homeless", label: "Homeless" },
            { value: "Crisis Shelter", label: "Crisis Shelter" },
            { value: "Dept of Housing", label: "Dept of Housing" },
            { value: "Private Owned Home", label: "Private Owned Home" },
          ]}
          error={
            (touchedFields.currentResidence || isSubmitted) &&
            errors.currentResidence
              ? errors.currentResidence.message
              : null
          }
          required
        />
        <Select
          label="Community Transport / Taxi voucher"
          name="communityTransportVoucher"
          {...register("communityTransportVoucher")}
          options={[
            { value: "", label: "Select..." },
            { value: "YES", label: "YES" },
            { value: "NO", label: "NO" },
          ]}
        />
      </div>
    </div>
  );
};

export default IncomeFundingStep;



