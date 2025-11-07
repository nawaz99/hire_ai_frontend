import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/AxiosInstance"; // ✅ axios instance (withCredentials)
import { SettingsContext } from "../context/SettingsContext";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      api
        .get(`/results/getResults/${userData._id}`)
        .then((res) => setHistory(res.data))
        .catch((error) => {
          console.error(error);

          if (error.response?.status === 401) {
            navigate("/login");
          }
        });
    }
  }, [navigate]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !jobDesc)
      return alert("Please upload a resume and enter a job description");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDesc);

    setLoading(true);
    setResult(null);

    try {
      // ✅ Upload & analyze (cookie attached automatically)
      const { data } = await api.post("/upload-resume", formData);

      setResult(data);

      // ✅ Save result
      await api.post("/results/saveResult", {
        userId: user?._id || null,
        candidateName: data.candidate?.name || "Anonymous",
        resumeFileName: file?.name || "",
        jobDescription: jobDesc,
        matchPercentage: data.matchPercentage || 0,
        summary: data.summary || "",
        recommendation: data.recommendation || "",
        experience: data.experience || "",
        requiredSkills: data.requirementsSummary?.requiredSkills || [],
        candidateSkills: data.requirementsSummary?.candidateSkills || [],
        matchingSkills: data.requirementsSummary?.matchingSkills || [],
        missingSkills: data.requirementsSummary?.missingSkills || [],
        createdAt: new Date(),
      });

      // ✅ Refresh Analysis History
      const histRes = await api.get(`/results/getResults/${user._id}`);
      setHistory(histRes.data);
    } catch (err) {
      console.error(err);
      alert("Error uploading or analyzing file");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        settings.darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <main className="max-w-7xl mx-auto p-6">
        <h2
          className={`text-2xl font-semibold mb-6 text-center ${
            settings.darkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Analyze Your Resume
        </h2>

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          className={`space-y-4 p-6 rounded-2xl shadow-md border transition-all ${
            settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className={`border p-3 w-full rounded-lg focus:ring-2 focus:outline-none transition ${
              settings.darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500"
                : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400"
            }`}
          />
          <textarea
            placeholder="Paste job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className={`border p-3 w-full h-32 rounded-lg focus:ring-2 focus:outline-none transition ${
              settings.darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400"
            }`}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : `bg-${settings.themeColor}-600 hover:bg-${settings.themeColor}-700`
            }`}
          >
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>
        </form>

        {/* Loader */}
        {loading && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center rounded-lg z-50 ${
              settings.darkMode ? "bg-gray-900/80" : "bg-white/80"
            } backdrop-blur-sm`}
          >
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 font-medium">Analyzing your resume...</p>
          </div>
        )}

        {/* Analysis Result */}
        {result && !loading && (
          <div
            className={`mt-6 p-6 border rounded-2xl shadow-md space-y-4 transition-all ${
              settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            }`}
          >
            <h3
              className={`text-xl font-bold ${
                settings.darkMode ? "text-blue-400" : "text-blue-700"
              }`}
            >
              Analysis Result
            </h3>

            <p>
              <strong>Match Percentage:</strong>{" "}
              <span className="text-green-500 font-semibold">
                {result.matchPercentage || 0}%
              </span>
            </p>

            <p>
              <strong>Experience:</strong>{" "}
              {result.experience?.totalYears
                ? `${result.experience.totalYears} years total (${result.experience.relevantYears || 0} relevant)`
                : result.experience || "N/A"}
            </p>

            <p>
              <strong>Recommendation:</strong>{" "}
              <span
                className={`font-semibold ${
                  result.recommendation?.includes("Strong")
                    ? "text-green-500"
                    : result.recommendation?.includes("Good")
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {result.recommendation || "N/A"}
              </span>
            </p>

            {/* Skills Overview */}
            <div className="space-y-4 border-t pt-4 border-gray-600/30">
              <SkillSection
                title="Required Skills"
                skills={result.requirementsSummary?.requiredSkills}
                color={
                  settings.darkMode
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-200 text-gray-700"
                }
              />
              <SkillSection
                title="Candidate Skills"
                skills={result.requirementsSummary?.candidateSkills}
                color={
                  settings.darkMode
                    ? "bg-blue-900 text-blue-300"
                    : "bg-blue-100 text-blue-700"
                }
              />
              <SkillSection
                title="Matching Skills"
                skills={result.requirementsSummary?.matchingSkills}
                color={
                  settings.darkMode
                    ? "bg-green-900 text-green-300"
                    : "bg-green-100 text-green-700"
                }
              />
              <SkillSection
                title="Missing Skills"
                skills={result.requirementsSummary?.missingSkills}
                color={
                  settings.darkMode
                    ? "bg-red-900 text-red-300"
                    : "bg-red-100 text-red-700"
                }
              />
            </div>

            <p className="pt-3 border-t border-gray-600/30 leading-relaxed">
              <strong>Summary:</strong> {result.summary || "N/A"}
            </p>
          </div>
        )}

        {/* History Table */}
        {history.length > 0 && !loading && (
          <div
            className={`mt-10 p-6 rounded-2xl shadow-md border transition-all ${
              settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-2xl font-bold ${
                  settings.darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Recent Analysis
              </h3>
              <button
                onClick={() => navigate("history")}
                className={`font-medium hover:underline ${
                  settings.darkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                View Full History →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table
                className={`min-w-full border text-sm ${
                  settings.darkMode
                    ? "border-gray-700 text-gray-200"
                    : "border-gray-200 text-gray-800"
                }`}
              >
                <thead
                  className={`${settings.darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <tr>
                    {[
                      "ID",
                      "Candidate",
                      "Date",
                      "Job Description",
                      "Match %",
                      "Matching Skills",
                      "Missing Skills",
                      "Recommendation",
                      "Action",
                    ].map((h) => (
                      <th key={h} className="border px-4 py-2 text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 5).map((item) => (
                    <tr
                      key={item._id}
                      className={`transition ${
                        settings.darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="border px-4 py-2">{item._id.slice(-6)}</td>
                      <td className="border px-4 py-2">{item.candidateName || "—"}</td>
                      <td className="border px-4 py-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2 max-w-xs truncate">
                        {item.jobDescription}
                      </td>
                      <td className="border px-4 py-2 text-center font-semibold">
                        {item.matchPercentage}%
                      </td>
                      <td className="border px-4 py-2 text-green-500">
                        {item.matchingSkills?.join(", ") || "-"}
                      </td>
                      <td className="border px-4 py-2 text-red-500">
                        {item.missingSkills?.join(", ") || "-"}
                      </td>
                      <td
                        className={`border px-4 py-2 font-medium ${
                          item.recommendation === "Strong match"
                            ? "text-green-500"
                            : item.recommendation === "Good potential fit"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.recommendation || "-"}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => navigate(`candidate/${item._id}`)}
                          className={`px-3 py-1 rounded-md text-white transition bg-${settings.themeColor}-600 hover:bg-${settings.themeColor}-700`}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// 🔹 Skill Section Component
function SkillSection({ title, skills, color }) {
  return (
    <div>
      <p className="font-medium mb-1">{title}:</p>
      <div className="flex flex-wrap gap-2">
        {skills?.length > 0 ? (
          skills.map((s, i) => (
            <span key={i} className={`px-2 py-1 rounded-full text-sm ${color}`}>
              {s}
            </span>
          ))
        ) : (
          <p className="text-gray-400">N/A</p>
        )}
      </div>
    </div>
  );
}
