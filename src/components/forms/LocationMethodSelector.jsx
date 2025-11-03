import React from "react";
import { Navigation, MapPinIcon } from "lucide-react";
import Button from "../ui/Button";

const LocationMethodSelector = ({
  locationMethod,
  onMethodChange,
  onGetLocation,
  isGettingLocation,
  locationError,
  gpsLocation,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          type="button"
          onClick={() => onMethodChange("gps")}
          className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
            locationMethod === "gps"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
          }`}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Use GPS Location
        </button>
        <button
          type="button"
          onClick={() => onMethodChange("manual")}
          className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
            locationMethod === "manual"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
          }`}
        >
          <MapPinIcon className="w-4 h-4 mr-2" />
          Enter Manually
        </button>
      </div>

      {locationMethod === "gps" && (
        <div className="mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={onGetLocation}
            disabled={isGettingLocation}
            className="flex items-center bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {isGettingLocation ? "Getting Location..." : "Get My Location"}
          </Button>

          {locationError && (
            <div className="mt-2 text-sm text-red-600">⚠️ {locationError}</div>
          )}

          {gpsLocation && (
            <div className="mt-2 text-sm text-green-600">
              ✓ Location detected and address filled automatically
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationMethodSelector;
