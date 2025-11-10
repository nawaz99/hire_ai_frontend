import { useState, useContext } from "react";
import { registerUser } from "../api/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../context/SettingsContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);         // ✅ Loading state
  const [showSuccess, setShowSuccess] = useState(false); // ✅ Success popup
  const [showError, setShowError] = useState("");        // ✅ Error popup

  const navigate = useNavigate();
  const { settings } = useContext(SettingsContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loader

    try {
      const { data } = await registerUser(form);
      localStorage.setItem("user", JSON.stringify(data.user));

      setLoading(false);
      setShowSuccess(true); // ✅ Show success popup

      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    } catch (err) {
      setLoading(false);
      setShowError(err.response?.data?.msg || "Registration failed. Try again.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative ${settings.darkMode ? "bg-[#0A0A0A] text-gray-100" : "bg-[#FAF9F6] text-gray-900"
        }`}
    >
      {/* Premium gradient background */}
      <div className="absolute w-[650px] h-[650px] bg-gradient-to-br from-[#FFD1BB] to-[#FF7F50] opacity-30 rounded-full blur-[130px] -top-20 -left-32"></div>
      <div className="absolute w-[450px] h-[450px] bg-gradient-to-br from-[#FFE8D4] to-[#FBE6C8] opacity-25 rounded-full blur-[140px] bottom-10 right-10"></div>

      <div className="relative z-10 flex w-full max-w-6xl items-center justify-between gap-16 px-10">

        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col max-w-xl">
          <h1 className="text-6xl font-extrabold tracking-tight leading-tight">
            Create your account
            <span className="block text-[#FF7F50]">Start hiring smarter.</span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mt-6">
            Startogen helps HR teams evaluate resumes instantly with ATS scoring,
            keyword matching, and AI-powered suggestions.
          </p>

          <div className="mt-8 space-y-6 text-gray-800 dark:text-gray-300">
            <Step num="1" text="Upload resume or job description" />
            <Step num="2" text="AI analyzes skills & missing keywords" />
            <Step num="3" text="Get ATS score + improvement suggestions" />
          </div>
        </div>

        {/* RIGHT FORM */}
        <div
          className={`relative w-full max-w-md shadow-[0px_8px_40px_rgba(0,0,0,0.08)] rounded-2xl p-10 border ${settings.darkMode
              ? "bg-[#111111]/80 border-[#2b2b2b]"
              : "bg-white border-[#EDEDED]"
            }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#FF7F50]">Create Account</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Join Startogen — AI Resume Intelligence
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField label="Full Name" name="name" type="text" placeholder="Enter your name" handleChange={handleChange} />
            <InputField label="Email Address" name="email" type="email" placeholder="you@example.com" handleChange={handleChange} />
            <InputField label="Password" name="password" type="password" placeholder="Enter a password" handleChange={handleChange} />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all hover:-translate-y-[2px] ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF7F50] hover:bg-[#FF6A35]"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="font-medium text-[#FF7F50] hover:underline">
              Login
            </button>
          </p>

          <p className="text-xs mt-10 text-center text-gray-400">
            © {new Date().getFullYear()} Startogen — AI Resume Intelligence
          </p>
        </div>
      </div>

      {/* ✅ SUCCESS POPUP */}
      {showSuccess && (
        <Popup
          bg="bg-[#FF7F50]"
          icon="✅"
          title="Account Created!"
          text="Your account has been created successfully."
          buttonText="Go to Dashboard"
          onClick={() => navigate("/dashboard")}
        />
      )}

      {/* ❌ ERROR POPUP */}
      {showError && (
        <Popup
          bg="bg-red-500"
          icon="⚠️"
          title="Registration Failed"
          text={showError}
          buttonText="Try Again"
          onClick={() => setShowError("")}
        />
      )}
    </div>
  );
}

/* ✅ Input Component */
function InputField({ label, name, type, placeholder, handleChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 rounded-xl border bg-[#FAFAFA] dark:bg-[#1a1a1a] hover:border-[#FF7F50] border-gray-300 dark:border-[#333] outline-none focus:ring-2 focus:ring-[#FF7F50] transition-all"
      />
    </div>
  );
}

/* ✅ Step Component */
function Step({ num, text }) {
  return (
    <p className="flex items-center gap-4 text-md">
      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF7F50] text-white font-bold shadow-md">
        {num}
      </span>
      {text}
    </p>
  );
}

/* ✅ Popup Component */
function Popup({ bg, icon, title, text, buttonText, onClick }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      <div className="bg-white dark:bg-[#1b1b1b] rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm text-center animate-scaleIn">
        <div className={`w-16 h-16 mx-auto mb-4 ${bg} text-white flex items-center justify-center rounded-full text-3xl`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-[#FF7F50]">{title}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{text}</p>

        <button
          onClick={onClick}
          className="mt-6 px-6 py-2 rounded-xl font-medium bg-[#FF7F50] hover:bg-[#FF6A35] text-white transition-all"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
