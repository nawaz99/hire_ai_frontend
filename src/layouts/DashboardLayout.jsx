import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import {
  LogOut,
  FileText,
  User,
  Settings,
  Menu,
  X,
  Clock,
} from "lucide-react";
import { SettingsContext } from "../context/SettingsContext";
import { logoutUser } from "../api/AxiosInstance";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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


  const handleLogout = async () => {
    await logoutUser();          // ✅ calls backend to remove cookie
    localStorage.removeItem("user");
    localStorage.removeItem("settings");
    setSettings({ darkMode: false, themeColor: "blue" });
    navigate("/login");
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

  // Map theme colors (used for dynamic Tailwind classes)
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
        className={`fixed md:static z-40 border-r shadow-sm w-64 flex flex-col justify-between transform transition-transform duration-300 ${settings.darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
          } ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h1
            className={`text-2xl font-bold ${theme === "blue"
                ? "text-blue-500"
                : theme === "green"
                  ? "text-green-500"
                  : theme === "purple"
                    ? "text-purple-500"
                    : theme === "rose"
                      ? "text-rose-500"
                      : "text-blue-500"
              }`}
          >
            AI Resume
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-4 flex-1 space-y-1 overflow-y-auto">
          {[
            { to: "/dashboard", icon: FileText, label: "Analyzer" },
            { to: "/dashboard/profile", icon: User, label: "Profile" },
            { to: "/dashboard/history", icon: Clock, label: "History" },
            { to: "/dashboard/settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full p-3 rounded-lg transition-colors duration-200 ${isActive
                  ? `${theme === "blue"
                    ? "bg-blue-100 text-blue-700"
                    : theme === "green"
                      ? "bg-green-100 text-green-700"
                      : theme === "purple"
                        ? "bg-purple-100 text-purple-700"
                        : theme === "rose"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-blue-100 text-blue-700"
                  } font-medium`
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
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
            <button
              className="md:hidden text-gray-400 hover:text-gray-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h2 className="text-lg font-semibold">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm font-medium hidden sm:block">
                Hi, {user.name || "User"}
              </span>
            )}
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition bg-${theme}-500 hover:bg-${theme}-600"}`}
            >
              Logout
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
