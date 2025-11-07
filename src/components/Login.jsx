import { useState, useContext } from "react";
import { loginUser } from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../context/SettingsContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { settings } = useContext(SettingsContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await loginUser(form);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  const colorMap = {
    blue: "bg-blue-600 hover:bg-blue-700 text-blue-500",
    green: "bg-green-600 hover:bg-green-700 text-green-500",
    purple: "bg-purple-600 hover:bg-purple-700 text-purple-500",
    rose: "bg-rose-600 hover:bg-rose-700 text-rose-500",
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-cover bg-center transition-colors duration-500 ${
        settings.darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
      style={{
        backgroundImage: settings.darkMode
          ? "url('/dark-bg.jpg')"
          : "url('/light-bg.jpg')",
      }}
    >
      <div
        className={`absolute inset-0 ${
          settings.darkMode ? "bg-black/60" : "bg-white/60"
        } backdrop-blur-sm`}
      ></div>

      <div
        className={`relative w-full max-w-md shadow-2xl rounded-3xl p-8 border transition-all duration-300 ${
          settings.darkMode
            ? "bg-gray-800/90 border-gray-700"
            : "bg-white/90 border-gray-200"
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back 👋</h1>
          <p
            className={`${
              settings.darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Login to your AI Resume Analyzer account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-xl border transition ${
                settings.darkMode
                  ? `bg-gray-700 border-gray-600 text-gray-100`
                  : `border-gray-300`
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-xl border transition ${
                settings.darkMode
                  ? `bg-gray-700 border-gray-600 text-gray-100`
                  : `border-gray-300`
              }`}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 text-white font-semibold rounded-xl shadow transition-transform transform hover:-translate-y-0.5 ${
              colorMap[settings.themeColor].split(" ")[0]
            } ${colorMap[settings.themeColor].split(" ")[1]}`}
          >
            Sign In
          </button>
        </form>

        <div
          className={`mt-6 text-center text-sm ${
            settings.darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className={`font-medium hover:underline ${
              colorMap[settings.themeColor].split(" ")[2]
            }`}
          >
            Create one
          </button>
        </div>

        <div className="mt-8 text-center">
          <p
            className={`text-xs ${
              settings.darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            © 2025 AI Resume Analyzer. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
