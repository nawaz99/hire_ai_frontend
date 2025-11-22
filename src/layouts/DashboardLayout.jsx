import { useNavigate, NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import startogen_logo from "../assets/startogen_logo.png";
import startogen_icon from "../assets/startogen_icon.png";
import {
  Menu,
} from "lucide-react";
import { SettingsContext } from "../context/SettingsContext";
import { logoutUser } from "../api/AxiosInstance";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { settings, setSettings } = useContext(SettingsContext);

  // Apply dark mode globally
  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) navigate("/login");
    else setUser(JSON.parse(storedUser));
  }, [navigate]);

  // LOGOUT LOADING HANDLER
  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await logoutUser();
      localStorage.removeItem("user");
      localStorage.removeItem("settings");
      setSettings({ darkMode: false, themeColor: "blue" });

      setTimeout(() => {
        navigate("/login");
      }, 700);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/dashboard/") return "Analyzer";
    if (path.includes("/dashboard/profile")) return "Profile";
    if (path.includes("/dashboard/history")) return "History";
    if (path.includes("/dashboard/settings")) return "Settings";
    if (path.includes("/candidate/")) return "Candidate Overview";
    return "Dashboard";
  };

  function NavItem({ icon, label, active, sidebarOpen, onClick }) {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${active ? "bg-blue-50 dark:bg-blue-900/40 font-medium" : ""
          }`}
      >
        <span className="text-lg">{icon}</span>
        {sidebarOpen && <span>{label}</span>}
      </button>
    );
  } 1

  // Map theme colors
  const theme = settings.themeColor || "blue";

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-300 ${settings.darkMode
        ? "bg-gray-900 text-gray-100"
        : "bg-gray-50 text-gray-900"
        }`}
    >

      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"
          } bg-white dark:bg-gray-900 border-r dark:border-gray-700`}
      >
        <div className="h-full flex flex-col">

          <div className="px-4 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            {sidebarOpen ? (
              <div className="flex flex-col items-start gap-1">
                <a href="/dashboard" className="flex items-center">
                  <img
                    src={startogen_logo}
                    alt="Startogen Logo"
                    className="h-10 w-auto object-contain"
                  />
                </a>
                <h1 className="text-sm font-bold text-blue-500 leading-tight pl-1">
                  AI Resume Analyzer
                </h1>
              </div>
            ) : (
              <img
                src={startogen_icon}
                alt="Startogen Icon"
                className="h-10 w-auto object-contain mx-auto"
              />
            )}

            <button
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((s) => !s)}
              className="ml-auto text-gray-400 hover:text-gray-700"
              title="Toggle"
            >
              {sidebarOpen ? "«" : "»"}
            </button>
          </div>



          <nav className="flex-1 px-2 py-4">
            <NavItem icon="📄" label="Analyze" active sidebarOpen={sidebarOpen} onClick={() => navigate("/dashboard")} />
            <NavItem icon="📚" label="History" sidebarOpen={sidebarOpen} onClick={() => navigate("history")} />
            <NavItem icon="👤" label="Profile" sidebarOpen={sidebarOpen} onClick={() => navigate("profile")} />
            <NavItem icon="⚙️" label="Settings" sidebarOpen={sidebarOpen} onClick={() => navigate("settings")} />
          </nav>

          <div className="px-3 py-4">
            <button
              onClick={() => {
                if (user) {
                  localStorage.removeItem("user");
                  navigate("/login");
                } else {
                  navigate("/login");
                }
              }}
              className="w-full px-3 py-2 rounded-md bg-red-600 text-white text-sm"
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </aside>


      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden ml-0">
        <header
          className={`px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm border-b backdrop-blur-sm transition-colors duration-300 ${settings.darkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/80 border-gray-200"
            }`}
        >
          <div className="flex items-center gap-4">
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm font-medium hidden sm:block">
                Hi, {user.name || "User"}
              </span>
            )}

            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${logoutLoading
                ? "bg-gray-400 cursor-not-allowed"
                : `bg-${theme}-500 hover:bg-${theme}-600`
                }`}
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
