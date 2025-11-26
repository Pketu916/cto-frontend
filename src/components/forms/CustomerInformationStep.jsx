import React from "react";
import { User, MapPin } from "lucide-react";
import Input from "../ui/Input";
import { AUSTRALIAN_STATES } from "../../utils/pricingUtils";
import LocationMethodSelector from "./LocationMethodSelector";

const CustomerInformationStep = ({
  register,
  errors,
  touchedFields = {},
  isSubmitted = false,
  locationMethod,
  onLocationMethodChange,
  onGetLocation,
  isGettingLocation,
  locationError,
  gpsLocation,
  setValue,
}) => {
  // Helper to check if error should be shown
  const shouldShowError = (fieldName) => {
    return (touchedFields[fieldName] || isSubmitted) && errors[fieldName];
  };
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 flex items-center">
        <User className="w-4 h-4 mr-2 text-blue-600" />
        Customer Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Customer Name"
          name="customerName"
          placeholder="Enter customer's full name"
          error={
            shouldShowError("customerName")
              ? errors.customerName?.message
              : undefined
          }
          required
          {...register("customerName")}
        />

        <Input
          label="Customer Age"
          name="customerAge"
          type="number"
          placeholder="Enter customer's age"
          error={
            shouldShowError("customerAge")
              ? errors.customerAge?.message
              : undefined
          }
          required
          {...register("customerAge", {
            valueAsNumber: true, // Ensure it's treated as number
          })}
        />

        <Input
          label="Customer Phone"
          name="customerPhone"
          placeholder="Enter customer's phone number"
          error={
            shouldShowError("customerPhone")
              ? errors.customerPhone?.message
              : undefined
          }
          required
          {...register("customerPhone")}
        />

        <Input
          label="Emergency Contact"
          name="emergencyContact"
          placeholder="Enter emergency contact number"
          error={
            shouldShowError("emergencyContact")
              ? errors.emergencyContact?.message
              : undefined
          }
          required
          {...register("emergencyContact")}
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 flex items-center mt-8">
        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
        Service Address
      </h3>

      <LocationMethodSelector
        locationMethod={locationMethod}
        onMethodChange={onLocationMethodChange}
        onGetLocation={onGetLocation}
        isGettingLocation={isGettingLocation}
        locationError={locationError}
        gpsLocation={gpsLocation}
      />

      <div className="space-y-6">
        <Input
          label="House/Flat Number and Name"
          name="houseDetails"
          placeholder="e.g., Flat 201, ABC Society or House No. 123, XYZ Building"
          error={
            shouldShowError("houseDetails")
              ? errors.houseDetails?.message
              : undefined
          }
          required
          {...register("houseDetails")}
        />

        <Input
          label="Address"
          name="address"
          placeholder="Enter complete address (society, building name, street, area, etc.)"
          error={
            shouldShowError("address") ? errors.address?.message : undefined
          }
          required
          {...register("address")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="City"
            name="city"
            placeholder="Enter city"
            error={shouldShowError("city") ? errors.city?.message : undefined}
            required
            {...register("city")}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Australian State <span className="text-red-500">*</span>
            </label>
            <select
              {...register("state")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                shouldShowError("state") ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Australian State</option>
              {AUSTRALIAN_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
            {shouldShowError("state") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.state.message}
              </p>
            )}
          </div>

          <Input
            label="Pincode"
            name="pincode"
            placeholder="Enter pincode"
            error={
              shouldShowError("pincode") ? errors.pincode?.message : undefined
            }
            required
            {...register("pincode")}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerInformationStep;
