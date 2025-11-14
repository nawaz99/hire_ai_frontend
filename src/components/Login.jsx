import { useState, useContext } from "react";
import { loginUser } from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../context/SettingsContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);      // ✅ Loading state
  const [error, setError] = useState(null);           // ✅ Error popup state
  const navigate = useNavigate();
  const { settings } = useContext(SettingsContext);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);    // start loading
    setError(null);      // reset error

    try {
      const { data } = await loginUser(form);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed"); // ✅ show error popup
    } finally {
      setLoading(false);  // stop loading
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative ${
        settings.darkMode ? "bg-[#0A0A0A] text-gray-100" : "bg-[#FAF9F6] text-gray-900"
      }`}
    >

      {/* ERROR POPUP */}
      {error && (
        <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg animate-slide-in">
          <span>{error}</span>
          <button className="ml-3 font-bold" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* PREMIUM ABSTRACT SHAPES */}
      <div className="absolute w-[650px] h-[650px] bg-gradient-to-br from-[#FFB08A] to-[#FF7F50] opacity-30 rounded-full blur-[140px] -top-16 -left-32"></div>
      <div className="absolute w-[450px] h-[450px] bg-gradient-to-br from-[#ffdcc9] to-[#FBE8D3] opacity-25 rounded-full blur-[120px] bottom-10 right-10"></div>

      <div className="relative z-10 flex w-full max-w-6xl items-center justify-between gap-12 px-10">

        {/* LEFT – BRAND VALUE SECTION */}
        <div className="hidden lg:flex flex-col max-w-xl">
          <h1 className="text-6xl tracking-tight leading-tight">
            Startogen
            <span className="block text-[#FF7F50]">Hire with confidence.</span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mt-6">
            AI-powered candidate evaluation built for hiring teams.
            Stop reading resumes manually — let AI highlight the best talent.
          </p>

          <div className="mt-8 space-y-4 text-md font-medium text-gray-700 dark:text-gray-300">
            <Feature point="Resume-to-Job match % (ATS aligned)" />
            <Feature point="AI improvements + formatting suggestions" />
            <Feature point="Missing keyword highlights" />
            <Feature point="Reduce screening time by 80%" />
          </div>

          <p className="mt-10 text-sm text-gray-500 italic">
            Trusted by recruiters & growing startups to make better hiring decisions.
          </p>
        </div>

        {/* RIGHT – LOGIN CARD */}
        <div
          className={`relative w-full max-w-md shadow-[0px_8px_40px_rgba(0,0,0,0.08)] rounded-2xl p-10 border ${
            settings.darkMode
              ? "bg-[#111111]/80 border-[#2b2b2b]"
              : "bg-white border-[#EDEDED]"
          }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#FF7F50]">Welcome Back</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Log in to continue your hiring workflow.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border bg-[#FAFAFA] dark:bg-[#1a1a1a] 
                   hover:border-[#FF7F50] border-gray-300 dark:border-[#333] outline-none 
                   focus:ring-2 focus:ring-[#FF7F50] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border bg-[#FAFAFA] dark:bg-[#1a1a1a] 
                   hover:border-[#FF7F50] border-gray-300 dark:border-[#333] outline-none 
                   focus:ring-2 focus:ring-[#FF7F50] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all 
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF7F50] hover:bg-[#FF6A35] hover:-translate-y-[2px]"}`}
            >
              {loading ? "Signing In..." : "Sign In →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
            New here?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-medium text-[#FF7F50] hover:underline"
            >
              Create account
            </button>
          </p>

          <p className="text-xs mt-10 text-center text-gray-400">
            © {new Date().getFullYear()} Startogen — AI Resume Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ point }) {
  return <p className="flex items-center gap-2 text-md">{point}</p>;
}
