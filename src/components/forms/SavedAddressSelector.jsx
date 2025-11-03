import React, { useState } from "react";
import { MapPin, Plus, Check } from "lucide-react";

const SavedAddressSelector = ({
  savedAddresses,
  onSelectAddress,
  selectedAddressId,
  onAddNew,
  isLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState(savedAddresses.length > 0);

  if (isLoading) {
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <div className="animate-pulse flex space-x-4 w-full">
            <div className="rounded-full bg-gray-300 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (savedAddresses.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
          Saved Addresses ({savedAddresses.length})
        </h4>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isExpanded ? "Hide" : "Show"} Addresses
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 border border-gray-200 rounded-lg p-2 bg-gray-50">
          {savedAddresses.map((address, index) => (
            <div
              key={address.id || index}
              onClick={() => onSelectAddress(address)}
              className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                selectedAddressId === (address.id || index)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {selectedAddressId === (address.id || index) && (
                      <Check className="w-4 h-4 text-blue-600 mr-2" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {address.label || `Address ${index + 1}`}
                    </span>
                    {address.isDefault && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {address.name && (
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {address.name}
                      </p>
                    )}
                    {address.address && (
                      <p className="line-clamp-2">{address.address}</p>
                    )}
                    <p>
                      {address.city && `${address.city}, `}
                      {address.state}
                      {address.pincode && ` - ${address.pincode}`}
                    </p>
                    {address.phone && (
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {address.phone}
                      </p>
                    )}
                  </div>
                </div>
                <MapPin
                  className={`w-5 h-5 ml-2 ${
                    selectedAddressId === (address.id || index)
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          ))}

          {onAddNew && (
            <button
              type="button"
              onClick={onAddNew}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center text-gray-600 hover:text-blue-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="font-medium">Add New Address</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedAddressSelector;
