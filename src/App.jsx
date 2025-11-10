import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import History from "./components/History";
import CandidateOverview from "./components/CandidateOverview";
import { SettingsContext } from "./context/SettingsContext";
import LandingPage from "./pages/LandingPage";

export default function App() {
  const { settings } = useContext(SettingsContext);

  // ✅ Apply dark mode, theme color globally
  useEffect(() => {
    const root = document.documentElement;

    // Dark Mode toggle
    if (settings.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Theme color
    root.style.setProperty("--theme-color", settings.themeColor);
  }, [settings]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Nested Pages inside Layout */}
          <Route index element={<ResumeAnalyzer />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="history" element={<History />} />
          <Route path="candidate/:id" element={<CandidateOverview />} />
        </Route>
      </Routes>
    </Router>
  );
}
