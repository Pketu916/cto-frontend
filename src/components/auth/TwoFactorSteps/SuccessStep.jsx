import React from "react";
import { Button } from "../../ui";

const SuccessStep = ({ onComplete }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Two-Factor Authentication Enabled!
      </h3>
      <p className="text-gray-600">
        Your account is now protected with two-factor authentication
      </p>
    </div>

    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 className="font-semibold text-green-800 mb-2">What happens next:</h4>
      <ul className="text-sm text-green-700 space-y-1">
        <li>
          • You'll need to enter a code from your authenticator app when logging
          in
        </li>
        <li>• Save your backup codes in a secure location</li>
        <li>• You can disable 2FA anytime in your security settings</li>
      </ul>
    </div>

    <div className="flex gap-3">
      <Button onClick={onComplete} className="flex-1">
        Complete Setup
      </Button>
    </div>
  </div>
);

export default SuccessStep;
