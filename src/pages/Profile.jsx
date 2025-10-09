import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ProtectedRoute } from "../components/auth";
import { PageContainer } from "../components/layout";
import { Card, Button, Input } from "../components/ui";
import { useToast } from "../contexts/ToastContext";
import { usersAPI, providersAPI } from "../services/api";

const Profile = () => {
  const { user, userType, updateUser } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call appropriate API based on user type
      let response;
      if (userType === "user") {
        response = await usersAPI.updateProfile(profileData);
      } else if (userType === "provider") {
        response = await providersAPI.updateProfile(profileData);
      } else {
        // For admin, we can use user API or create admin API
        response = await usersAPI.updateProfile(profileData);
      }

      if (response.success) {
        // Update user data in context with the response data
        updateUser(
          response.data.user || response.data.provider || response.data
        );
        setIsEditing(false);
        showToast("Profile updated successfully!", "success");
      } else {
        showToast(response.message || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      showToast("There was an error updating your profile.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setIsEditing(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast("New password must be at least 6 characters long", "error");
      return;
    }

    setIsChangingPassword(true);

    try {
      // Simulate API call for password change
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showToast("Password changed successfully!", "success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowChangePassword(false);
    } catch (error) {
      showToast("There was an error changing your password.", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePasswordCancel = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowChangePassword(false);
  };

  return (
    <ProtectedRoute>
      <PageContainer>
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Picture and Basic Info */}
            <div className="lg:col-span-1">
              <Card className="p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {user?.name}
                </h2>
                <p className="text-blue-600 font-medium mb-2">
                  {userType === "user" && "Patient"}
                  {userType === "provider" && "Healthcare Provider"}
                  {userType === "admin" && "Administrator"}
                </p>
                <p className="text-gray-600 text-sm mb-4">{user?.email}</p>

                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full mb-4"
                  >
                    Edit Profile
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowChangePassword(true)}
                >
                  Change Password
                </Button>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Profile Information
                  </h3>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="+91-9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <Input
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Your address"
                      />
                    </div>
                  </div>
                </form>
              </Card>

              {/* Change Password Form */}
              {showChangePassword && (
                <Card className="p-6 mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Change Password
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePasswordCancel}
                      disabled={isChangingPassword}
                    >
                      Cancel
                    </Button>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password *
                      </label>
                      <Input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Enter your current password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password *
                      </label>
                      <Input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Enter your new password"
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 6 characters long
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password *
                      </label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Confirm your new password"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={isChangingPassword}
                        className="flex-1"
                      >
                        {isChangingPassword
                          ? "Changing Password..."
                          : "Change Password"}
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
};

export default Profile;
