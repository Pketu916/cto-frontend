import React from "react";
import { Button, Input } from "../../ui";

const VerificationStep = ({
  qrCode,
  secretKey,
  verificationCode,
  setVerificationCode,
  onVerify,
  onBack,
  isLoading,
}) => (
  <div className="space-y-6">
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan QR Code</h3>
      <p className="text-gray-600">
        Use your authenticator app to scan this QR code
      </p>
    </div>

    {qrCode && (
      <div className="flex justify-center">
        <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
          <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
        </div>
      </div>
    )}

    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 className="font-semibold text-gray-800 mb-2">
        Manual Entry (Alternative):
      </h4>
      <div className="flex items-center justify-between">
        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
          {secretKey}
        </code>
        <button
          onClick={() => navigator.clipboard.writeText(secretKey)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Copy
        </button>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Enter Verification Code
      </label>
      <Input
        type="text"
        value={verificationCode}
        onChange={(e) =>
          setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
        }
        placeholder="000000"
        className="text-center text-2xl tracking-widest"
        maxLength={6}
      />
      <p className="text-sm text-gray-500 mt-1">
        Enter the 6-digit code from your authenticator app
      </p>
    </div>

    <div className="flex gap-3">
      <Button
        onClick={onVerify}
        disabled={isLoading || verificationCode.length !== 6}
        className="flex-1"
      >
        {isLoading ? "Verifying..." : "Verify & Enable"}
      </Button>
      <Button onClick={onBack} variant="outline">
        Back
      </Button>
    </div>
  </div>
);

export default VerificationStep;
