import React, { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";
import { MapPin, Navigation } from "lucide-react";

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

// Map container styles
const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "400px",
  borderRadius: "0.5rem",
};

// Default center (India)
const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

// Color mapping based on status
const getStatusColor = (status) => {
  switch (status) {
    case "provider-on-way":
    case "confirmed":
      return "#0b1f3b"; // Dark blue - en route
    case "work-started":
    case "in-progress":
    case "provider-started":
      return "#ff7a00"; // Orange - in progress
    case "completed":
      return "#0b1f3b"; // Dark blue - completed
    default:
      return "#6c4bc0"; // Purple - pending
  }
};

// Get marker icon URL based on status
const getMarkerIcon = (status) => {
  const color = getStatusColor(status).replace("#", "");
  // Check if Google Maps API is loaded (only available in browser)
  const google = typeof window !== "undefined" ? window.google : null;
  return {
    path:
      google?.maps?.SymbolPath?.CIRCLE ||
      google?.maps?.SymbolPath?.FORWARD_CLOSED_ARROW ||
      "circle",
    fillColor: getStatusColor(status),
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale: 10,
  };
};

const ProviderLocationMap = ({
  providerLocation,
  customerAddress,
  status,
  bookingId,
  providerName,
  className = "",
  showRoute = true,
  height = "400px",
}) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [route, setRoute] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  // Calculate center based on available locations
  useEffect(() => {
    if (providerLocation?.latitude && providerLocation?.longitude) {
      setMapCenter({
        lat: providerLocation.latitude,
        lng: providerLocation.longitude,
      });
    } else if (customerAddress?.lat && customerAddress?.lng) {
      setMapCenter({
        lat: customerAddress.lat,
        lng: customerAddress.lng,
      });
    }
  }, [providerLocation, customerAddress]);

  // Convert address to coordinates (simplified - you might want to use geocoding API)
  const geocodeAddress = useCallback(async (address) => {
    const google = typeof window !== "undefined" ? window.google : null;
    if (!address || !google?.maps?.Geocoder) return null;

    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      const addressString = `${address.street || ""}, ${address.city || ""}, ${
        address.state || ""
      } ${address.pincode || ""}`;
      geocoder.geocode({ address: addressString }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          reject(new Error("Geocoding failed"));
        }
      });
    });
  }, []);

  // Calculate route between provider and customer
  useEffect(() => {
    const google = typeof window !== "undefined" ? window.google : null;
    if (!mapLoaded || !directionsService || !directionsRenderer || !showRoute)
      return;
    if (!providerLocation?.latitude || !customerAddress) return;

    const calculateRoute = async () => {
      try {
        const providerLoc = {
          lat: providerLocation.latitude,
          lng: providerLocation.longitude,
        };

        let customerLoc;
        if (customerAddress.lat && customerAddress.lng) {
          customerLoc = {
            lat: customerAddress.lat,
            lng: customerAddress.lng,
          };
        } else {
          customerLoc = await geocodeAddress(customerAddress);
        }

        if (!customerLoc) return;

        const google = typeof window !== "undefined" ? window.google : null;
        directionsService.route(
          {
            origin: providerLoc,
            destination: customerLoc,
            travelMode: google?.maps?.TravelMode?.DRIVING || "DRIVING",
          },
          (result, status) => {
            if (status === "OK" && result) {
              directionsRenderer.setDirections(result);
              setRoute(result);
            }
          }
        );
      } catch (error) {
        console.error("Error calculating route:", error);
      }
    };

    calculateRoute();
  }, [
    mapLoaded,
    directionsService,
    directionsRenderer,
    providerLocation,
    customerAddress,
    showRoute,
    geocodeAddress,
  ]);

  const onMapLoad = useCallback((map) => {
    setMapLoaded(true);
    const google = typeof window !== "undefined" ? window.google : null;
    if (google?.maps) {
      const service = new google.maps.DirectionsService();
      const renderer = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
      });
      setDirectionsService(service);
      setDirectionsRenderer(renderer);
    }
  }, []);

  const onMapUnmount = useCallback(() => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }
  }, [directionsRenderer]);

  const statusColor = getStatusColor(status);
  const markerIcon = getMarkerIcon(status);

  // Show error if API key is missing
  if (!API_KEY) {
    return (
      <div
        className={`w-full ${className} bg-red-50 border border-red-200 rounded-lg p-4`}
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-600 font-medium mb-2">
              Google Maps API Key Missing
            </p>
            <p className="text-sm text-red-500">
              Please set VITE_GOOGLE_MAPS_API_KEY in your .env file
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={providerLocation?.latitude ? 13 : 10}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {/* Provider Location Marker */}
          {providerLocation?.latitude && providerLocation?.longitude && (
            <Marker
              position={{
                lat: providerLocation.latitude,
                lng: providerLocation.longitude,
              }}
              icon={markerIcon}
              title={providerName || "Service Provider"}
              onClick={() => setShowInfoWindow(true)}
              animation={window.google?.maps?.Animation?.DROP}
            >
              {showInfoWindow && (
                <InfoWindow
                  onCloseClick={() => setShowInfoWindow(false)}
                  position={{
                    lat: providerLocation.latitude,
                    lng: providerLocation.longitude,
                  }}
                >
                  <div className="p-2">
                    <h3 className="font-semibold text-primary mb-1">
                      {providerName || "Service Provider"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Status: <span className="font-medium">{status}</span>
                    </p>
                    {providerLocation.lastUpdated && (
                      <p className="text-xs text-gray-500 mt-1">
                        Last updated:{" "}
                        {new Date(
                          providerLocation.lastUpdated
                        ).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}

          {/* Customer Location Marker - Only show if we have coordinates */}
          {customerAddress &&
            (customerAddress.lat && customerAddress.lng ? (
              <Marker
                position={{
                  lat: customerAddress.lat,
                  lng: customerAddress.lng,
                }}
                icon={{
                  path: window.google?.maps?.SymbolPath?.CIRCLE || "circle",
                  fillColor: "#6c4bc0", // Purple for customer
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                  scale: 8,
                }}
                title="Customer Location"
              />
            ) : null)}

          {/* Draw route line if both locations are available */}
          {showRoute &&
            providerLocation?.latitude &&
            providerLocation?.longitude &&
            customerAddress &&
            route?.routes?.[0] && (
              <Polyline
                path={route.routes[0].overview_path}
                options={{
                  strokeColor: statusColor,
                  strokeOpacity: 0.7,
                  strokeWeight: 4,
                }}
              />
            )}
        </GoogleMap>
      </LoadScript>

      {/* Status Indicator */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: statusColor }}
          />
          <span className="text-sm font-medium text-gray-700">
            Provider: {status || "Pending"}
          </span>
        </div>
        {customerAddress && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-accent" />
            <span className="text-sm font-medium text-gray-700">
              Customer Location
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderLocationMap;
