import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Button, Input } from "../ui";

const AccountTab = () => {
  const { user, userType, logout } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast(
        "Password change request has been sent. Please check your email.",
        "success"
      );
    } catch (error) {
      showToast("There was an error changing your password.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast(
        "Password reset instructions have been sent to your email.",
        "success"
      );
    } catch (error) {
      showToast("There was an error sending reset instructions.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        showToast("Account has been successfully deleted.", "success");
        logout();
      } catch (error) {
        showToast("There was an error deleting your account.", "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Account Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500 mt-1">
              Email address cannot be changed
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Type
            </label>
            <Input value={userType} disabled className="bg-gray-50" />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Password Management
        </h3>
        <div className="space-y-4">
          <div className="max-w-md ">
            <div className="flex gap-3">
              <Button
                onClick={handleChangePassword}
                disabled={isSubmitting}
                variant="outline"
                className="mr-4"
              >
                {isSubmitting ? "Sending..." : "Change Password"}
              </Button>
              <Button
                onClick={handleForgotPassword}
                disabled={isSubmitting}
                variant="outline"
              >
                {isSubmitting ? "Sending..." : "Reset Password"}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              We will send you an email for password management
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
          <p className="text-red-700 text-sm mb-4">
            Once your account is deleted, all data will be permanently removed.
            This action cannot be undone.
          </p>
          <Button
            onClick={handleDeleteAccount}
            disabled={isSubmitting}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            {isSubmitting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;
