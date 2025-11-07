import { useState, useEffect, useContext } from "react";
import api from "../api/AxiosInstance"; // ✅ use axios instance with cookies enabled
import { User, Mail, Calendar, Briefcase, Edit3, Save } from "lucide-react";
import { SettingsContext } from "../context/SettingsContext";

export default function Profile() {
  const [user, setUser] = useState({ _id: "", name: "", email: "", createdAt: "" });
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const { settings } = useContext(SettingsContext);

  // ✅ Load logged-in user from localStorage (name & email are safe to store)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData({ name: parsed.name || "", email: parsed.email || "" });
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // ✅ API call, cookie is auto sent by axiosInstance
      const response = await api.put(`/users/${user._id}`, formData);

      setUser(response.data);

      // Update local storage so updated name/email reflects across app
      localStorage.setItem("user", JSON.stringify(response.data));

      setEditing(false);
      setSaved(true);

      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div
      className={`min-h-screen flex justify-center items-start py-10 transition-colors duration-500 ${
        settings.darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div
        className={`p-8 rounded-2xl shadow-lg w-full max-w-3xl border transition-all duration-300 ${
          settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}
      >
        {/* Header Section */}
        <div className="flex items-center gap-6 border-b pb-6 mb-6 border-gray-600/20">
          {/* Avatar */}
          <div
            className={`h-20 w-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-md bg-${settings.themeColor}-100 text-${settings.themeColor}-600`}
          >
            {initials}
          </div>

          {/* Basic Info */}
          <div>
            <h2
              className={`text-2xl font-bold ${
                settings.darkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {user.name || "User"}
            </h2>
            <p className={`${settings.darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {user.email || "No email available"}
            </p>
            <p className={`text-sm mt-1 ${settings.darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Member since{" "}
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>

          {/* Edit Button */}
          <div className="ml-auto">
            <button
              onClick={() => (editing ? handleSave() : setEditing(true))}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                editing
                  ? `bg-green-500 text-white hover:bg-green-600`
                  : `bg-${settings.themeColor}-100 text-${settings.themeColor}-700 hover:bg-${settings.themeColor}-200`
              }`}
            >
              {editing ? <Save size={16} /> : <Edit3 size={16} />}
              {loading ? "Saving..." : editing ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label
              className={`flex items-center gap-2 text-sm mb-1 ${
                settings.darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <User size={16} />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly={!editing}
              className={`w-full rounded-lg p-2 border outline-none transition ${
                editing
                  ? `focus:ring-2 focus:ring-${settings.themeColor}-500 border-${settings.themeColor}-300 ${
                      settings.darkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-800"
                    }`
                  : settings.darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 cursor-not-allowed"
                  : "bg-gray-50 border-gray-200 text-gray-800 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label
              className={`flex items-center gap-2 text-sm mb-1 ${
                settings.darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!editing}
              className={`w-full rounded-lg p-2 border outline-none transition ${
                editing
                  ? `focus:ring-2 focus:ring-${settings.themeColor}-500 border-${settings.themeColor}-300 ${
                      settings.darkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-800"
                    }`
                  : settings.darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 cursor-not-allowed"
                  : "bg-gray-50 border-gray-200 text-gray-800 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Role */}
          <div>
            <label
              className={`flex items-center gap-2 text-sm mb-1 ${
                settings.darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <Briefcase size={16} />
              Role
            </label>
            <input
              type="text"
              value="Candidate / Recruiter"
              readOnly
              className={`w-full border rounded-lg p-2 cursor-not-allowed ${
                settings.darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            />
          </div>

          {/* Joined Date */}
          <div>
            <label
              className={`flex items-center gap-2 text-sm mb-1 ${
                settings.darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <Calendar size={16} />
              Joined On
            </label>
            <input
              type="text"
              value={
                user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available"
              }
              readOnly
              className={`w-full border rounded-lg p-2 cursor-not-allowed ${
                settings.darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            />
          </div>
        </div>

        {/* ✅ Success Toast */}
        {saved && (
          <div className="mt-4 text-green-500 text-sm text-center font-medium">
            ✅ Profile updated successfully!
          </div>
        )}
      </div>
    </div>
  );
}
