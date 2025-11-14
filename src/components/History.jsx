import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/AxiosInstance"; // ✅ centralized axios instance
import { SettingsContext } from "../context/SettingsContext";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const { settings } = useContext(SettingsContext);

  // ✅ Load user from localStorage (name & email are safe to store)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ✅ Fetch history using Axios instance (token auto-included)
  useEffect(() => {
    if (!user?._id) return;

    api
      .get(`/results/getResults/${user._id}`)
      .then((res) => setHistory(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading)
    return (
      <div
        className={`flex justify-center items-center min-h-screen text-lg transition-colors duration-300 ${
          settings.darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"
        }`}
      >
        Loading analysis history...
      </div>
    );

  if (history.length === 0)
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
          settings.darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-700"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-2">No history found</h2>
        <p className="text-gray-500">Run your first candidate analysis to see results here.</p>
      </div>
    );

  // Pagination
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = history.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        settings.darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1 className={`text-2xl  mb-6 text-${settings.themeColor}-500`}>
        Candidate Analysis History
      </h1>

      <div
        className={`overflow-x-auto rounded-2xl shadow-lg p-3 border transition-colors duration-300 ${
          settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}
      >
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr
              className={`text-left ${
                settings.darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
              }`}
            >
              {[
                "Candidate",
                "Date",
                "Job Description",
                "Match %",
                "Matching Skills",
                "Missing Skills",
                "Recommendation",
                "Action",
              ].map((header) => (
                <th key={header} className="px-2 py-2 font-semibold border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentItems.map((item, index) => (
              <tr
                key={item._id}
                className={`transition-colors duration-200 cursor-pointer ${
                  settings.darkMode
                    ? index % 2 === 0
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-900 hover:bg-gray-700"
                    : index % 2 === 0
                    ? "bg-white hover:bg-blue-50"
                    : "bg-gray-50 hover:bg-blue-50"
                }`}
              >
                <td className="px-2 py-2 border-b font-medium">{item.candidateName || "—"}</td>

                <td className="px-2 py-2 border-b whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleString()}
                </td>

                <td className="px-2 py-2 border-b max-w-xs truncate">{item.jobDescription}</td>

                <td className="px-2 py-2 border-b text-center">
                  <span
                    className={`px-1 py-1 rounded-full text-xs font-semibold ${
                      item.matchPercentage >= 80
                        ? "bg-green-100 text-green-700"
                        : item.matchPercentage >= 60
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.matchPercentage}%
                  </span>
                </td>

                {/* Matching Skills */}
                <td className="px-2 py-2 border-b">
                  <div className="flex flex-wrap gap-1">
                    {item.matchingSkills?.length ? (
                      <>
                        {(item.showAll
                          ? item.matchingSkills
                          : item.matchingSkills.slice(0, 1)
                        ).map((skill, i) => (
                          <span
                            key={i}
                            className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}

                        {item.matchingSkills.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setHistory((prev) =>
                                prev.map((h) =>
                                  h._id === item._id ? { ...h, showAll: !h.showAll } : h
                                )
                              );
                            }}
                            className={`text-${settings.themeColor}-500 text-xs font-semibold ml-2 hover:underline`}
                          >
                            {item.showAll
                              ? "Show less"
                              : `+${item.matchingSkills.length - 1} more`}
                          </button>
                        )}
                      </>
                    ) : (
                      "—"
                    )}
                  </div>
                </td>

                {/* Missing Skills */}
                <td className="px-2 py-2 border-b">
                  <div className="flex flex-wrap gap-1">
                    {item.missingSkills?.length ? (
                      <>
                        {(item.showAll
                          ? item.missingSkills
                          : item.missingSkills.slice(0, 1)
                        ).map((skill, i) => (
                          <span
                            key={i}
                            className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}

                        {item.missingSkills.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setHistory((prev) =>
                                prev.map((h) =>
                                  h._id === item._id ? { ...h, showAll: !h.showAll } : h
                                )
                              );
                            }}
                            className={`text-${settings.themeColor}-500 text-xs font-semibold ml-2 hover:underline`}
                          >
                            {item.showAll ? "Show less" : `+${item.missingSkills.length - 1} more`}
                          </button>
                        )}
                      </>
                    ) : (
                      "—"
                    )}
                  </div>
                </td>

                {/* Recommendation */}
                <td className="px-2 py-2 border-b">
                  <span
                    className={`px-1 py-1 rounded-full text-xs font-semibold ${
                      item.recommendation === "Strong match"
                        ? "bg-green-100 text-green-700"
                        : item.recommendation === "Good potential fit"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.recommendation || "—"}
                  </span>
                </td>

                <td className="px-2 py-2 border-b">
                  <button
                    onClick={() => navigate(`/dashboard/candidate/${item._id}`)}
                    className={`px-1 py-1 rounded-md text-white bg-${settings.themeColor}-500 hover:bg-${settings.themeColor}-600 transition`}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 px-2">
        <p className="text-sm text-gray-500">
          Showing {startIndex + 1}–
          {Math.min(startIndex + itemsPerPage, history.length)} of {history.length}
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-1 py-1 rounded-md border text-sm transition ${
              settings.darkMode ? "border-gray-600 hover:bg-gray-700" : "hover:bg-gray-100"
            } disabled:opacity-50`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-1 py-1 rounded-md text-sm border transition ${
                currentPage === i + 1
                  ? `bg-${settings.themeColor}-500 text-white border-${settings.themeColor}-500`
                  : settings.darkMode
                  ? "border-gray-600 hover:bg-gray-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-1 py-1 rounded-md border text-sm transition ${
              settings.darkMode ? "border-gray-600 hover:bg-gray-700" : "hover:bg-gray-100"
            } disabled:opacity-50`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
