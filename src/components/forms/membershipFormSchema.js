import * as yup from "yup";

// Helper for date validation (DD-MM-YYYY)
const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;

// Helper for phone validation
const phoneRegex = /^[0-9\s()\-]+$/;

// Helper for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const membershipFormSchema = yup.object({
  // Personal Details (0-13)
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  nswHospitalCRN: yup.string(),
  centerlinkPension: yup.string(),
  centerlinkPensionExpiry: yup.string().when("centerlinkPension", {
    is: (val) => val && val !== "Not Applicable",
    then: (schema) => schema.required("Expiry date is required"),
  }),
  medicareNo: yup.string(),
  medicareRefNo: yup.string(),
  medicareExpiry: yup.string().when("medicareNo", {
    is: (val) => val && val !== "",
    then: (schema) => schema.required("Medicare expiry date is required"),
  }),
  ndisOrAgedCare: yup.string(),
  ndisParticipantId: yup.string().when("ndisOrAgedCare", {
    is: "NDIS",
    then: (schema) => schema.required("NDIS Participant ID is required"),
  }),
  agedCareId: yup.string().when("ndisOrAgedCare", {
    is: "Aged Care",
    then: (schema) => schema.required("Aged Care ID is required"),
  }),
  dateOfBirth: yup
    .string()
    .matches(dateRegex, "Date must be in DD-MM-YYYY format")
    .required("Date of birth is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .min(0, "Age must be positive")
    .max(150, "Please enter a valid age")
    .required("Age is required"),
  gender: yup.string().required("Gender is required"),
  homeAddressDoor: yup.string(),
  homeAddressStreet: yup.string().required("Street name is required"),
  homeAddressSuburb: yup.string().required("Suburb is required"),
  homeAddressState: yup
    .string()
    .oneOf(
      ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"],
      "Please select a valid Australian state"
    )
    .required("State is required"),
  homeAddressPostcode: yup
    .string()
    .matches(/^\d{4}$/, "Postcode must be 4 digits")
    .required("Postcode is required"),
  landlineNumber: yup.string().matches(phoneRegex, "Invalid phone format"),
  mobileNumber: yup
    .string()
    .matches(phoneRegex, "Invalid phone format")
    .required("Mobile number is required"),
  email: yup
    .string()
    .matches(emailRegex, "Invalid email format")
    .required("Email is required"),
  carerMobile: yup.string().matches(phoneRegex, "Invalid phone format"),

  // Referrer Information (14-20)
  referrerName: yup.string(),
  referrerContact: yup.string().matches(phoneRegex, "Invalid phone format"),
  referrerMobile: yup.string().matches(phoneRegex, "Invalid phone format"),
  referrerEmail: yup.string().matches(emailRegex, "Invalid email format"),
  referrerOrganisation: yup.string(),
  relationship: yup.string(),

  // Guardian/Next of Kin (21-24)
  guardianStatus: yup.string(),
  nextOfKinFirstName: yup.string(),
  nextOfKinLastName: yup.string(),
  nextOfKinStreet: yup.string(),
  nextOfKinStreet2: yup.string(),
  nextOfKinCity: yup.string(),
  nextOfKinState: yup.string(),
  nextOfKinPostcode: yup.string(),
  nextOfKinStatus: yup.string(),

  // Income & Funding (25-36)
  receiveIncome: yup.string(),
  incomeType: yup.string().when("receiveIncome", {
    is: "YES",
    then: (schema) => schema.required("Income type is required"),
  }),
  centerlinkRentalAllowance: yup.string(),
  ndiaParticipant: yup.string(),
  eligibleNdiaParticipant: yup.string().when("ndiaParticipant", {
    is: "NO",
    then: (schema) => schema.required("Please specify if eligible"),
  }),
  agedCareFunding: yup.string(),
  eligibleAgedCare: yup.string().when("agedCareFunding", {
    is: (val) => !val || val === "Self Funded",
    then: (schema) => schema.required("Please specify if eligible"),
  }),
  receivingNdiaFunding: yup.string(),
  coreSupport: yup.string(),
  capitalSupport: yup.string(),
  capacityBuilding: yup.string(),
  ndiaFundManagement: yup.string(),

  // Living Situation & Transport (37-38)
  currentResidence: yup.string().required("Current residence is required"),
  communityTransportVoucher: yup.string(),

  // Support Needs Assessment (39-56)
  personalCareSupport: yup.string(),
  domesticSupport: yup.string(),
  shoppingSupport: yup.string(),
  medicationManagement: yup.string(),
  transport: yup.string(),
  mobilitySupport: yup.string(),
  socialCommunityParticipation: yup.string(),
  supportedEmployment: yup.string(),
  medicalSpecialistsAppointment: yup.string(),
  mealPreparation: yup.string(),
  feedingSupport: yup.string(),
  groomingSupport: yup.string(),
  communication: yup.string(),
  bedToChairTransfers: yup.string(),
  bedCare: yup.string(),
  bowelManagement: yup.string(),
  incontinenceManagement: yup.string(),
  financialManagement: yup.string(),
  lifestyleDayToDayDecisions: yup.string(),

  // Medical & Care (57-65)
  medicalDiagnosis: yup.string(),
  comorbidCondition: yup.string(),
  allergies: yup.string(),
  typeOfCareSupport: yup.string(),
  highIntensityCareSupport: yup.array(),
  urinaryCatheterType: yup.string().when("highIntensityCareSupport", {
    is: (val) =>
      Array.isArray(val) && val.includes("Urinary Catheter Management"),
    then: (schema) => schema.required("Please specify catheter type"),
  }),
  mobilityStatus: yup.string(),
  mobilityAid: yup.string().when("mobilityStatus", {
    is: "Non Ambulant",
    then: (schema) => schema.required("Please specify mobility aid"),
  }),

  // Equipment & Assistive Technology (66-80)
  monkeyBar: yup.string(),
  slidingTable: yup.string(),
  bedsideTable: yup.string(),
  electricHeightTable: yup.string(),
  automaticDoorOpening: yup.string(),
  respiratoryEquipment: yup.array(),
  telehealthDevice: yup.string(),
  selfDispensingMedication: yup.string(),
  specialGown: yup.string(),
  personalProtectiveEquipment: yup.string(),
  communicationDevices: yup.string(),
  telehealthSystem: yup.string(),
  urgentCallSystem: yup.string(),
  softwareApplicationAssistance: yup.string(),
  bedaiToiletAssistance: yup.string(),
  bedCareSection5: yup.string(),
  bowelManagementSection5: yup.string(),
  incontinenceManagementSection5: yup.string(),
  skillDevelopmentEducation: yup.string(),
  airCondition: yup.string(),

  // Preferences & Cultural (81-96)
  lgaPreference1: yup.string(),
  lgaPreference2: yup.string(),
  lgaPreference3: yup.string(),
  culturalSpecific: yup.string(),
  genderSpecific: yup.string(),
  agedSpecific: yup.string(),
  religion: yup.string(),
  needInterpreter: yup.string(),
  homeLanguage: yup.string().when("needInterpreter", {
    is: "YES",
    then: (schema) => schema.required("Please specify language"),
  }),
  englishLanguage: yup.string(),
  aboriginalTorresStrait: yup.string(),
  staffCareRatio: yup.string(),

  // Consent & Documentation (97-110)
  consentType: yup.string().required("Consent type is required"),
  consentReferrerName: yup.string(),
  position: yup.string(),
  consentContactNumber: yup.string(),
  consentEmail: yup.string(),
  organisationName: yup.string(),
  consentRelationship: yup.string(),
  signature: yup.string().when("consentType", {
    is: (val) => val === "Written Consent",
    then: (schema) => schema.required("Signature is required"),
  }),
  hasNdiaPlan: yup.string(),
  hasClinicalCarePlan: yup.string(),
  hasHospitalDischargeReport: yup.string(),
  hasAgedCarePackagePlan: yup.string(),
  otherDocument: yup.string(),
});



