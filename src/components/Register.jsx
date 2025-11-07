import { useState, useContext } from "react";
import { registerUser } from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../context/SettingsContext"; // 👈 Import settings

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { settings } = useContext(SettingsContext); // 👈 Access darkMode & themeColor

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await registerUser(form);

      // ✅ Save user into localStorage (no token because cookie auth)
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Registration successful!");
      // ✅ redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center transition-colors duration-500 ${settings.darkMode
        ? "bg-gray-900 text-gray-100"
        : "bg-gradient-to-br from-indigo-100 via-white to-indigo-50"
        }`}
      style={{
        backgroundImage: settings.darkMode
          ? "url('/dark-bg.jpg')" // 🌙 dark mode background image
          : "url('/light-bg.jpg')", // ☀️ light mode background image
      }}>
      <div
        className={`w-full max-w-md rounded-3xl shadow-2xl p-8 border transition-all duration-300 ${settings.darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-100"
          }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account 🚀</h1>
          <p
            className={`${settings.darkMode ? "text-gray-400" : "text-gray-500"
              }`}
          >
            Join us and analyze your resume smarter
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border transition ${settings.darkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-" +
                settings.themeColor +
                "-400 focus:ring focus:ring-" +
                settings.themeColor +
                "-200"
                : "border-gray-300 focus:border-" +
                settings.themeColor +
                "-500 focus:ring focus:ring-" +
                settings.themeColor +
                "-200"
                }`}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border transition ${settings.darkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-" +
                settings.themeColor +
                "-400 focus:ring focus:ring-" +
                settings.themeColor +
                "-200"
                : "border-gray-300 focus:border-" +
                settings.themeColor +
                "-500 focus:ring focus:ring-" +
                settings.themeColor +
                "-200"
                }`}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border transition ${settings.darkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-" +
                settings.themeColor +
                "-400 focus:ring focus:ring-" +
                settings.themeColor +
                "-200"
                : "border-gray-300 focus:border-" +
                settings.themeColor +
                "-500 focus:ring focus:ring-" +
                settings.themeColor +
                "-200"
                }`}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 text-white font-semibold rounded-xl shadow transition-transform transform hover:-translate-y-0.5 bg-${settings.themeColor}-600 hover:bg-${settings.themeColor}-700`}
          >
            Create Account
          </button>
        </form>

        {/* Footer Links */}
        <div
          className={`mt-6 text-center text-sm ${settings.darkMode ? "text-gray-400" : "text-gray-600"
            }`}
        >
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className={`font-medium hover:underline text-${settings.themeColor}-500`}
          >
            Login
          </button>
        </div>

        <div className="mt-8 text-center">
          <p
            className={`text-xs ${settings.darkMode ? "text-gray-500" : "text-gray-400"
              }`}
          >
            © 2025 AI Resume Analyzer. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
