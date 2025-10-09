import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Button, Input } from "../ui";
import api from "../../services/api";

const AdminProfileTab = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    profilePicture: "",
    permissions: {},
    isActive: true,
    lastLogin: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch admin profile data
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/admin/profile");
      if (response.data.success) {
        const adminData = response.data.data.admin;
        setProfileData({
          name: adminData.name || "",
          email: adminData.email || "",
          phone: adminData.phone || "",
          role: adminData.role || "",
          profilePicture: adminData.profilePicture || "",
          permissions: adminData.permissions || {},
          isActive: adminData.isActive || true,
          lastLogin: adminData.lastLogin || null,
        });
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      showToast("Failed to load profile data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.put("/admin/profile", {
        name: profileData.name,
        phone: profileData.phone,
        profilePicture: profileData.profilePicture,
      });

      if (response.data.success) {
        updateUser(response.data.data.admin);
        showToast("Profile updated successfully!", "success");
        setIsEditing(false);
      } else {
        showToast(response.data.message || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Failed to update profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast("New password must be at least 8 characters", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.put("/admin/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        showToast("Password changed successfully!", "success");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showToast(
          response.data.message || "Failed to change password",
          "error"
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showToast("Failed to change password", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Profile Information
          </h3>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              Edit Profile
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture URL
              </label>
              <Input
                name="profilePicture"
                value={profileData.profilePicture}
                onChange={handleInputChange}
                placeholder="https://example.com/profile.jpg"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile(); // Reset to original data
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                {profileData.name || "Not set"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                {profileData.email}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                {profileData.phone || "Not set"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {profileData.role}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    profileData.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {profileData.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Login
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                {formatDate(profileData.lastLogin)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Permissions */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Permissions
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(profileData.permissions).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  value
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {value ? "Allowed" : "Denied"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Password Change */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <Input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <Input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              required
              minLength={8}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {isSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfileTab;
