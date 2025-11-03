import * as yup from "yup";

export const bookingFormSchema = yup.object({
  customerName: yup.string().required("Please enter the customer's name"),
  customerAge: yup
    .number()
    .typeError("Please enter a valid age (numbers only)")
    .min(1, "Age must be at least 1 year")
    .max(120, "Please enter a valid age")
    .required("Please enter the customer's age"),
  customerPhone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number")
    .required("Please enter the customer's phone number"),
  houseDetails: yup
    .string()
    .required("Please enter house/flat number and name"),
  address: yup.string().required("Please enter the complete address"),
  city: yup.string().required("Please enter the city name"),
  state: yup.string().required("Please select the state"),
  pincode: yup.string().required("Please enter the pincode"),
  // Service selection fields (optional if service is pre-selected)
  selectedCategory: yup.string(),
  selectedServiceFromDropdown: yup.string(),
  serviceRequirements: yup
    .string()
    .required("Please describe the service requirements or details"),
  emergencyContact: yup
    .string()
    .matches(
      /^[0-9]{10}$/,
      "Please enter a valid 10-digit emergency contact number"
    )
    .required("Please enter an emergency contact number"),
  notes: yup.string(),
  // Payment fields
  paymentMethod: yup.string().required("Please select a payment method"),
  // Insurance fields (conditional - only if insurance is available and selected)
  useInsurance: yup.boolean(),
  insuranceProvider: yup.string().when("useInsurance", {
    is: true,
    then: (schema) => schema.required("Insurance provider is required"),
  }),
  insurancePolicyNumber: yup.string().when("useInsurance", {
    is: true,
    then: (schema) => schema.required("Insurance policy number is required"),
  }),
  insuranceMemberId: yup.string().when("useInsurance", {
    is: true,
    then: (schema) => schema.required("Insurance member ID is required"),
  }),
  insuranceGroupNumber: yup.string(),
});
