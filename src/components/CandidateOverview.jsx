import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../api/AxiosInstance";
import { SettingsContext } from "../context/SettingsContext";

const CandidateOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useContext(SettingsContext);

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardStyle = settings.darkMode
    ? "bg-gray-800 border-gray-700 text-gray-100"
    : "bg-white border-gray-200 text-gray-900";

  const sectionCard = settings.darkMode
    ? "bg-gray-700 border-gray-600"
    : "bg-gray-50 border-gray-200";

  const badge = (color) =>
    settings.darkMode
      ? `bg-${color}-700 text-${color}-100`
      : `bg-${color}-100 text-${color}-700`;

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await api.get(`/results/getResult/${id}`);
        setCandidate(res.data);
      } catch (error) {
        if (error.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300 text-lg">
        Loading candidate details...
      </div>
    );

  if (!candidate)
    return (
      <div className="p-6 text-center text-lg text-red-600 dark:text-red-400">
        Candidate not found
      </div>
    );

  return (
    <div className={`max-w-5xl mx-auto mt-8 p-8 rounded-2xl shadow-lg border ${cardStyle}`}>
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-theme hover:opacity-80 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm">Back to History</span>
      </button>

      {/* Header */}
      <div className="pb-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl font-semibold text-theme">{candidate.candidateName}</h1>

        <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
          <p>ID: <span className="text-gray-700 dark:text-gray-300">{candidate._id}</span></p>
          <p>Analyzed on: <span className="text-gray-700 dark:text-gray-300">
            {new Date(candidate.createdAt).toLocaleString()}
          </span></p>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-theme">Summary</h2>
        <p className="mt-2 leading-relaxed text-gray-700 dark:text-gray-300">
          {candidate.summary}
        </p>
      </div>

      {/* Match Score */}
      <div className={`mt-8 p-6 rounded-xl border ${sectionCard}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Match Score</p>
            <p className="text-3xl font-semibold text-theme">
              {candidate.matchPercentage}%
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Recommendation</p>
            <p className="text-base font-medium text-green-500">
              {candidate.recommendation}
            </p>
          </div>

        </div>
      </div>

      {/* Experience */}
      {candidate.experience && (
        <div className="mt-10">
          <h2 className="text-lg font-medium text-theme">Experience Overview</h2>

          <div className={`mt-3 p-5 rounded-xl border ${sectionCard} space-y-2`}>
            <p><span className="font-medium">Total Experience:</span> {candidate.experience.totalYears} years</p>
            <p><span className="font-medium">Relevant Experience:</span> {candidate.experience.relevantYears} years</p>
            <p><span className="font-medium">Domains:</span> {candidate.experience.domains?.join(", ") || "-"}</p>
            <p><span className="font-medium">Seniority Level:</span> {candidate.experience.seniorityLevel}</p>
            <p><span className="font-medium">Role Fit:</span> {candidate.experience.roleFit?.join(", ") || "-"}</p>
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="mt-10">
        <h2 className="text-lg font-medium text-theme">Skills Analysis</h2>

        <div className="grid md:grid-cols-2 gap-6 mt-4">

          {/* Matching Skills */}
          <div className={`p-5 rounded-xl border ${sectionCard}`}>
            <h3 className="text-base font-medium text-green-500 mb-3">Matching Skills</h3>
            {candidate.matchingSkills?.length ? (
              <div className="flex flex-wrap gap-2">
                {candidate.matchingSkills.map((skill, idx) => (
                  <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${badge("green")}`}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">None listed</p>}
          </div>

          {/* Missing Skills */}
          <div className={`p-5 rounded-xl border ${sectionCard}`}>
            <h3 className="text-base font-medium text-red-500 mb-3">Missing Skills</h3>
            {candidate.missingSkills?.length ? (
              <div className="flex flex-wrap gap-2">
                {candidate.missingSkills.map((skill, idx) => (
                  <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${badge("red")}`}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">None missing</p>}
          </div>

        </div>
      </div>

      {/* Skill Comparison */}
      <div className="mt-10">
        <h2 className="text-lg font-medium text-theme">Skills Comparison</h2>

        <div className="grid md:grid-cols-2 gap-6 mt-4">

          <div className={`p-5 rounded-xl border ${sectionCard}`}>
            <h3 className="text-base font-medium text-blue-500 mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.requiredSkills.map((skill, idx) => (
                <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${badge("blue")}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className={`p-5 rounded-xl border ${sectionCard}`}>
            <h3 className="text-base font-medium text-purple-500 mb-3">Candidate Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.candidateSkills.map((skill, idx) => (
                <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${badge("purple")}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Job Description */}
      <div className="mt-10">
        <h2 className="text-lg font-medium text-theme">Job Description</h2>

        <div className={`p-5 rounded-xl border ${sectionCard} mt-3 whitespace-pre-line leading-relaxed`}>
          {candidate.jobDescription}
        </div>
      </div>

    </div>
  );
};

export default CandidateOverview;
