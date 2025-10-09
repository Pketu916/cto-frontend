import React from "react";
import { Button } from "../../ui";

const SetupStep = ({ onGenerateQR, onClose, isLoading }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Enable Two-Factor Authentication
      </h3>
      <p className="text-gray-600">
        Add an extra layer of security to your account
      </p>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
      <ul className="text-sm text-blue-700 space-y-1">
        <li>• Download an authenticator app (Google Authenticator, Authy)</li>
        <li>• Scan the QR code with your authenticator app</li>
        <li>• Enter the 6-digit code from your app to verify</li>
        <li>• Use the app to generate codes for future logins</li>
      </ul>
    </div>

    <div className="flex gap-3">
      <Button onClick={onGenerateQR} disabled={isLoading} className="flex-1">
        {isLoading ? "Generating..." : "Generate QR Code"}
      </Button>
      <Button onClick={onClose} variant="outline">
        Cancel
      </Button>
    </div>
  </div>
);

export default SetupStep;
