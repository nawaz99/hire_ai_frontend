// src/components/Settings.jsx
import { useContext, useState, useEffect } from "react";
import { SettingsContext } from "../context/SettingsContext";

export default function Settings() {
  const { settings, updateSettings } = useContext(SettingsContext);
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  // ✅ Sync localSettings with context updates
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key, value) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const { darkMode, themeColor } = localSettings;

  // ✅ Safe color map (prevents Tailwind purge issues)
  const colorMap = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    rose: "bg-rose-500 hover:bg-rose-600",
    orange: "bg-orange-500 hover:bg-orange-600",
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
      } p-6 rounded-2xl shadow-md max-w-3xl mx-auto mt-8 transition-colors duration-300`}
    >
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      <div className="space-y-5">
        {/* Dark Mode */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => handleChange("darkMode", !darkMode)}
            className="w-5 h-5 accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Theme Color */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Theme Color</span>
          <select
            value={themeColor}
            onChange={(e) => handleChange("themeColor", e.target.value)}
            className={`border rounded-lg px-3 py-1 outline-none cursor-pointer transition ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          >
            {["blue", "green", "purple", "rose","orange"].map((color) => (
              <option
                key={color}
                value={color}
                className={
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                }
              >
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 text-right">
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${colorMap[themeColor]}`}
        >
          Save Changes
        </button>
      </div>

      {/* Success Toast */}
      {saved && (
        <div className={`mt-4 text-${themeColor}-500 text-sm text-center font-medium`}>
           Settings saved successfully!
        </div>
      )}
    </div>
  );
}
