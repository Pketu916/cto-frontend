import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";

export const useLocationService = (setValue) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [gpsLocation, setGpsLocation] = useState(null);
  const { showSuccess } = useToast();

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError(
        "Your browser doesn't support location detection. Please enter your address manually."
      );
      return;
    }

    setIsGettingLocation(true);
    setLocationError("");

    const handleSuccess = async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        setGpsLocation({ latitude, longitude });

        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();

        if (data && data.localityInfo) {
          setValue(
            "address",
            `${data.principalSubdivision || ""} ${data.locality || ""}`.trim()
          );
          setValue("city", data.city || data.locality || "");
          setValue("state", data.principalSubdivision || "");
          setValue("pincode", data.postcode || "");
          showSuccess("Location detected and form filled automatically!");
        }
      } catch (error) {
        console.error("Error getting location details:", error);
        setLocationError(
          "Could not get address details from your location. Please enter your address manually."
        );
      } finally {
        setIsGettingLocation(false);
      }
    };

    const handleError = (error) => {
      console.error("Error getting location:", error);
      let errorMessage = "Unable to get your location. ";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage +=
            "Please allow location access and try again. Click the location icon in your browser's address bar to enable location access, or enter your address manually.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage += "Location request timed out.";
          break;
        default:
          errorMessage += "An unknown error occurred.";
          break;
      }
      setLocationError(errorMessage);
      setIsGettingLocation(false);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000,
    };

    try {
      const permission = await navigator.permissions?.query({
        name: "geolocation",
      });

      if (permission?.state === "denied") {
        setLocationError(
          "Location access is blocked. Please allow location access in your browser settings or enter your address manually."
        );
        setIsGettingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        options
      );
    } catch (error) {
      console.error("Permission check error:", error);
      // Fallback to direct geolocation call
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        options
      );
    }
  };

  return {
    isGettingLocation,
    locationError,
    gpsLocation,
    getCurrentLocation,
  };
};
