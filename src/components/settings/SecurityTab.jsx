import React, { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../ui";
import TwoFactorAuth from "../auth/TwoFactorAuth";

const SecurityTab = ({ settings, onSettingChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const { showToast } = useToast();

  const handleEnableTwoFactor = () => {
    setShowTwoFactorModal(true);
  };

  const handleTwoFactorSuccess = () => {
    onSettingChange("twoFactorAuth", true);
    setShowTwoFactorModal(false);
  };

  const handleDisableTwoFactor = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSettingChange("twoFactorAuth", false);
      showToast("Two-factor authentication has been disabled.", "success");
    } catch (error) {
      showToast(
        "There was an error disabling two-factor authentication.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Security Settings
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-900">
              Two-Factor Authentication
            </h4>
            <p className="text-sm text-gray-600">
              Add extra security to your account
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-medium ${
                settings.twoFactorAuth ? "text-green-600" : "text-red-600"
              }`}
            >
              {settings.twoFactorAuth ? "Enabled" : "Disabled"}
            </span>
            <Button
              onClick={
                settings.twoFactorAuth
                  ? handleDisableTwoFactor
                  : handleEnableTwoFactor
              }
              disabled={isSubmitting}
              variant={settings.twoFactorAuth ? "outline" : "primary"}
              size="sm"
            >
              {isSubmitting
                ? "Processing..."
                : settings.twoFactorAuth
                ? "Disable"
                : "Setup"}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-900">Login Alerts</h4>
            <p className="text-sm text-gray-600">
              Get notified of new login attempts
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.loginAlerts}
              onChange={(e) => onSettingChange("loginAlerts", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Two-Factor Authentication Modal */}
      {showTwoFactorModal && (
        <TwoFactorAuth
          onClose={() => setShowTwoFactorModal(false)}
          onSuccess={handleTwoFactorSuccess}
        />
      )}
    </div>
  );
};

export default SecurityTab;
