import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../api/AxiosInstance"; // ✅ use axios instance
import { SettingsContext } from "../context/SettingsContext";

const CandidateOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useContext(SettingsContext);

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = settings.themeColor || "blue";

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await api.get(`/results/getResult/${id}`); // ✅ no token/header needed
        setCandidate(res.data);
      } catch (error) {
        console.error("Error fetching candidate:", error);

        // ✅ If token/cookie expired, backend returns 401 → redirect to login
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading)
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          settings.darkMode ? "text-gray-300" : "text-gray-600"
        } text-lg`}
      >
        Loading candidate details...
      </div>
    );

  if (!candidate)
    return (
      <div
        className={`p-6 text-center text-lg ${
          settings.darkMode ? "text-red-400" : "text-red-600"
        }`}
      >
        Candidate not found
      </div>
    );

  return (
    <div
      className={`max-w-5xl mx-auto mt-10 p-8 rounded-2xl shadow-lg space-y-8 transition-colors duration-300 ${
        settings.darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 font-medium transition mb-2 ${
          theme === "blue"
            ? "text-blue-500 hover:text-blue-700"
            : theme === "green"
            ? "text-green-500 hover:text-green-700"
            : theme === "purple"
            ? "text-purple-500 hover:text-purple-700"
            : "text-rose-500 hover:text-rose-700"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to History
      </button>

      {/* Header */}
      <div className="border-b pb-4 border-gray-300 dark:border-gray-700">
        <h1 className="text-3xl font-bold">{candidate.candidateName}</h1>
        <p className="text-sm mt-1 text-black-500 dark:text-black-400">
          Candidate ID:{" "}
          <span className="text-black-700 dark:text-black-300">{candidate._id}</span>
        </p>
        <p className="text-sm text-black-500 dark:text-black-400">
          Analyzed on:{" "}
          <span className="text-black-700 dark:text-black-300">
            {new Date(candidate.createdAt).toLocaleString()}
          </span>
        </p>
      </div>

      {/* Summary Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Candidate Summary</h2>
        <p className="leading-relaxed">{candidate.summary}</p>
      </div>

      {/* Match & Recommendation */}
      <div
        className={`flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-xl border ${
          settings.darkMode
            ? "bg-gray-700 border-gray-600"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Match Percentage</p>
          <p className={`text-3xl font-bold text-${theme}-500`}>
            {candidate.matchPercentage}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Recommendation</p>
          <p
            className={`text-xl font-semibold ${
              candidate.recommendation === "Strong match"
                ? "text-green-500"
                : candidate.recommendation === "Good potential fit"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {candidate.recommendation}
          </p>
        </div>
      </div>

      {/* Experience Section */}
      {candidate.experience && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Experience Overview</h2>
          <div
            className={`p-5 rounded-xl border ${
              settings.darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}
          >
            <p>
              <strong>Total Experience:</strong> {candidate.experience.totalYears} years
            </p>
            <p>
              <strong>Relevant Experience:</strong> {candidate.experience.relevantYears} years
            </p>
            <p>
              <strong>Domains:</strong> {candidate.experience.domains?.join(", ") || "-"}
            </p>
            <p>
              <strong>Seniority Level:</strong> {candidate.experience.seniorityLevel}
            </p>
            <p>
              <strong>Role Fit:</strong> {candidate.experience.roleFit?.join(", ") || "-"}
            </p>
          </div>
        </div>
      )}

      {/* Skills */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Skills Analysis</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Matching Skills */}
          <div
            className={`p-5 rounded-xl border ${
              settings.darkMode ? "bg-green-900/20 border-green-700" : "bg-green-50 border-green-200"
            }`}
          >
            <h3 className="text-lg font-medium text-green-500 mb-2">
              Matching Skills
            </h3>
            {candidate.matchingSkills?.length ? (
              <ul className="flex flex-wrap gap-2">
                {candidate.matchingSkills.map((skill, idx) => (
                  <li
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      settings.darkMode ? "bg-green-700 text-green-100" : "bg-green-200 text-green-800"
                    }`}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No matching skills listed</p>
            )}
          </div>

          {/* Missing Skills */}
          <div
            className={`p-5 rounded-xl border ${
              settings.darkMode ? "bg-red-900/20 border-red-700" : "bg-red-50 border-red-200"
            }`}
          >
            <h3 className="text-lg font-medium text-red-500 mb-2">Missing Skills</h3>
            {candidate.missingSkills?.length ? (
              <ul className="flex flex-wrap gap-2">
                {candidate.missingSkills.map((skill, idx) => (
                  <li
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      settings.darkMode ? "bg-red-700 text-red-100" : "bg-red-200 text-red-800"
                    }`}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No missing skills</p>
            )}
          </div>
        </div>
      </div>

      {/* Required vs Candidate Skills */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Skills Comparison</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Required Skills */}
          <div
            className={`p-5 rounded-xl border ${
              settings.darkMode ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200"
            }`}
          >
            <h3 className="text-lg font-medium text-blue-500 mb-2">Required Skills</h3>
            <ul className="flex flex-wrap gap-2">
              {candidate.requiredSkills.map((skill, idx) => (
                <li
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    settings.darkMode ? "bg-blue-700 text-blue-100" : "bg-blue-200 text-blue-800"
                  }`}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Candidate Skills */}
          <div
            className={`p-5 rounded-xl border ${
              settings.darkMode ? "bg-purple-900/20 border-purple-700" : "bg-purple-50 border-purple-200"
            }`}
          >
            <h3 className="text-lg font-medium text-purple-500 mb-2">
              Candidate Skills
            </h3>
            <ul className="flex flex-wrap gap-2">
              {candidate.candidateSkills.map((skill, idx) => (
                <li
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    settings.darkMode ? "bg-purple-700 text-purple-100" : "bg-purple-200 text-purple-800"
                  }`}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Job Description</h2>
        <div
          className={`p-5 rounded-xl border leading-relaxed whitespace-pre-line ${
            settings.darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-700"
          }`}
        >
          {candidate.jobDescription}
        </div>
      </div>
    </div>
  );
};

export default CandidateOverview;
