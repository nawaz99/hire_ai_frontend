import { createContext, useState, useEffect } from "react";
import api from "../api/AxiosInstance"; // ✅ axios instance with credentials

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {

  // ✅ Load settings instantly from localStorage (UI does not flicker)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("settings");
    if (saved) return JSON.parse(saved);

    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return {
      darkMode: prefersDark,
      themeColor: "blue",
    };
  });



  // ✅ Update settings in backend + localStorage
  const updateSettings = async (newSettings) => {
    try {
      await api.post("/settings", newSettings); // ✅ Auto-sends cookies

      setSettings(newSettings);
      localStorage.setItem("settings", JSON.stringify(newSettings));
      document.documentElement.classList.toggle("dark", newSettings.darkMode);
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings,setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
