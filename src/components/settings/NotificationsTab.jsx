import React from "react";

const NotificationToggle = ({ key, label, description, value, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div>
      <h4 className="font-semibold text-gray-900">{label}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(key, e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

const NotificationsTab = ({ settings, onSettingChange }) => {
  const notificationSettings = [
    {
      key: "emailNotifications",
      label: "Email Notifications",
      description: "Receive important updates via email",
    },
    {
      key: "smsNotifications",
      label: "SMS Notifications",
      description: "Receive urgent updates via SMS",
    },
    {
      key: "pushNotifications",
      label: "Push Notifications",
      description: "Receive notifications on your device",
    },
    {
      key: "appointmentReminders",
      label: "Appointment Reminders",
      description: "Get notified about upcoming appointments",
    },
    {
      key: "emergencyAlerts",
      label: "Emergency Alerts",
      description: "Receive critical medical alerts",
    },
    {
      key: "bookingUpdates",
      label: "Medical Appointment Updates",
      description: "Get notified about appointment status changes",
    },
    {
      key: "healthTips",
      label: "Health Tips & News",
      description: "Receive health tips and medical news",
    },
    {
      key: "marketingEmails",
      label: "Marketing Emails",
      description: "Receive promotional offers and updates",
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Notification Preferences
      </h3>

      <div className="space-y-4">
        {notificationSettings.map((setting) => (
          <NotificationToggle
            key={setting.key}
            {...setting}
            value={settings[setting.key]}
            onChange={onSettingChange}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationsTab;
