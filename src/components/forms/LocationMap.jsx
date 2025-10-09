import React, { useState, useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";

const LocationMap = ({
  onLocationSelect,
  initialPosition,
  height = "400px",
  className = "",
}) => {
  const [position, setPosition] = useState(
    initialPosition || [23.0225, 72.5714]
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = [latitude, longitude];
        setPosition(newPosition);
        onLocationSelect(newPosition);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please try again.");
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const handleMapClick = (e) => {
    // Simulate map click - in a real implementation, this would be handled by the map library
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert click position to approximate coordinates
    const lat = 23.0225 + (0.5 - y / rect.height) * 0.1;
    const lng = 72.5714 + (x / rect.width - 0.5) * 0.1;
    const newPosition = [lat, lng];

    setPosition(newPosition);
    onLocationSelect(newPosition);
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {!mapLoaded ? (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
          {/* Simulated map background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          </div>

          {/* Map content */}
          <div className="relative z-10 text-center">
            <MapPin className="w-16 h-16 text-blue-600 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Interactive Map
            </h3>
            <p className="text-gray-700 text-center mb-6 max-w-sm">
              Click anywhere on the map to select your location, or use GPS to
              get your current position.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {isGettingLocation
                  ? "Getting Location..."
                  : "Use My Current Location"}
              </button>

              <div className="text-sm text-gray-600">
                <p>Or click anywhere on the map area below</p>
              </div>
            </div>
          </div>

          {/* Clickable map area */}
          <div
            className="absolute inset-0 cursor-crosshair"
            onClick={handleMapClick}
            title="Click to select location"
          >
            {/* Position indicator */}
            {position && (
              <div
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-2 -translate-y-2"
                style={{
                  left: "50%",
                  top: "50%",
                }}
              >
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-red-500"></div>
              </div>
            )}
          </div>

          {position && (
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Selected Location
              </p>
              <p className="text-xs text-gray-600">
                Lat: {position[0].toFixed(6)}
              </p>
              <p className="text-xs text-gray-600">
                Lng: {position[1].toFixed(6)}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-700 mb-1">
          📍 Select Location
        </p>
        <p className="text-xs text-gray-500">
          Click on the map or use GPS to place a pin at your exact location
        </p>
      </div>
    </div>
  );
};

export default LocationMap;
