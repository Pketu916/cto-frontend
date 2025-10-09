import React from "react";

const BusinessTab = ({ settings, onSettingChange, onNestedSettingChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Business Settings
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-900">
              Auto-Accept Medical Appointments
            </h4>
            <p className="text-sm text-gray-600">
              Automatically accept medical appointment requests
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoAcceptBookings}
              onChange={(e) =>
                onSettingChange("autoAcceptBookings", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Working Hours</h4>
          <div className="space-y-3">
            {Object.entries(settings.workingHours).map(([day, schedule]) => (
              <div
                key={day}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedule.enabled}
                      onChange={(e) =>
                        onNestedSettingChange("workingHours", day, {
                          ...schedule,
                          enabled: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="ml-3 font-medium capitalize">{day}</span>
                </div>
                {schedule.enabled && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={schedule.start}
                      onChange={(e) =>
                        onNestedSettingChange("workingHours", day, {
                          ...schedule,
                          start: e.target.value,
                        })
                      }
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={schedule.end}
                      onChange={(e) =>
                        onNestedSettingChange("workingHours", day, {
                          ...schedule,
                          end: e.target.value,
                        })
                      }
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessTab;
