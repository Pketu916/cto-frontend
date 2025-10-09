import React from "react";

const PreferencesTab = ({ settings, onSettingChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        App Preferences
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => onSettingChange("language", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="english">English</option>
            <option value="gujarati">ગુજરાતી (Gujarati)</option>
            <option value="punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="bengali">বাংলা (Bengali)</option>
            <option value="tamil">தமிழ் (Tamil)</option>
            <option value="telugu">తెలుగు (Telugu)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => onSettingChange("timezone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Asia/Kolkata">India Standard Time (IST)</option>
            <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="Europe/London">Greenwich Mean Time (GMT)</option>
            <option value="Asia/Singapore">Singapore Time (SGT)</option>
            <option value="Australia/Sydney">
              Australian Eastern Time (AET)
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            value={settings.theme}
            onChange={(e) => onSettingChange("theme", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="auto">Auto (System)</option>
            <option value="high-contrast">High Contrast</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size
          </label>
          <select
            value={settings.fontSize}
            onChange={(e) => onSettingChange("fontSize", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-900">Compact Mode</h4>
            <p className="text-sm text-gray-600">
              Use less space for content display
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => onSettingChange("compactMode", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;
