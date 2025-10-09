import React, { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import SetupStep from "./TwoFactorSteps/SetupStep";
import VerificationStep from "./TwoFactorSteps/VerificationStep";
import SuccessStep from "./TwoFactorSteps/SuccessStep";

const TwoFactorAuth = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Setup, 2: Verify, 3: Success
  const [qrCode, setQrCode] = useState("");
  const [secretKey] = useState("JBSWY3DPEHPK3PXP");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleGenerateQR = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setQrCode(
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjJGUUFSQ29kZTwvdGV4dD4KPC9zdmc+"
      );
      setStep(2);
      showSuccess("QR code generated successfully!");
    } catch (error) {
      showError("Failed to generate QR code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      showError("Please enter a valid 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (verificationCode.length === 6) {
        setStep(3);
        showSuccess("Two-factor authentication enabled successfully!");
      } else {
        showError("Invalid verification code. Please try again.");
      }
    } catch (error) {
      showError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    onSuccess && onSuccess();
    onClose && onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SetupStep
            onGenerateQR={handleGenerateQR}
            onClose={onClose}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <VerificationStep
            qrCode={qrCode}
            secretKey={secretKey}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            onVerify={handleVerifyCode}
            onBack={() => setStep(1)}
            isLoading={isLoading}
          />
        );
      case 3:
        return <SuccessStep onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {renderStep()}
      </div>
    </div>
  );
};

export default TwoFactorAuth;
