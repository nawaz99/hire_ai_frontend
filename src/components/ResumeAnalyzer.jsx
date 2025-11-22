import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../api/AxiosInstance";
import { SettingsContext } from "../context/SettingsContext";

/**
 * ResumeAnalyzer.jsx
 * Premium Dashboard layout (Sidebar + Topbar + Main)
 *
 * Drop-in replacement for your previous ResumeAnalyzer component.
 * Requires: Tailwind CSS, recharts, api instance, SettingsContext
 */

const THEME_COLORS = {
  blue: ["#1e40af", "#3b82f6"],
  green: ["#16a34a", "#22c55e"],
  yellow: ["#d97706", "#f59e0b"],
  red: ["#dc2626", "#ef4444"],
  gray: ["#374151", "#6b7280"],
};

export default function ResumeAnalyzer() {
  const { settings } = useContext(SettingsContext);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchHistory(userData._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async (userId) => {
    try {
      const { data } = await api.get(`/results/getResults/${userId}`);
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history", err);
      if (err?.response?.status === 401) navigate("/login");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !jobDesc) return alert("Please upload a resume and enter a job description");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDesc);

    setLoading(true);
    setResult(null);

    try {
      const { data } = await api.post("/upload-resume", formData);
      setResult(data);

      // Save result for history
      await api.post("/results/saveResult", {
        userId: user?._id || null,
        candidateName: data.candidate?.name || "Anonymous",
        resumeFileName: file?.name || "",
        jobDescription: jobDesc,
        matchPercentage: data.matchPercentage || 0,
        summary: data.summary || "",
        recommendation: data.recommendation || "",
        experience: data.experience || {},
        requiredSkills: data.requirementsSummary?.requiredSkills || [],
        candidateSkills: data.requirementsSummary?.candidateSkills || [],
        matchingSkills: data.requirementsSummary?.matchingSkills || [],
        missingSkills: data.requirementsSummary?.missingSkills || [],
        createdAt: new Date(),
      });

      if (user?._id) fetchHistory(user._id);
    } catch (err) {
      console.error(err);
      alert("Error uploading or analyzing file");
    } finally {
      setLoading(false);
    }
  };

  // Utility: export result JSON
  const exportJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(result.candidate?.name || "candidate").replace(/\s+/g, "_")}_analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySummary = async () => {
    if (!result) return;
    const text = `Name: ${result.candidate?.name || "—"}\nMatch: ${result.matchPercentage}%\nRecommendation: ${result.recommendation}\nSummary: ${result.summary}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Summary copied to clipboard!");
    } catch {
      alert("Copy failed — please allow clipboard access.");
    }
  };

  // Chart data preparation
  const skillBarData = (result?.skillDetails || []).map((s) => ({
    skill: s.skill,
    score: s.matchScore || 0,
  }));

  const breakdownData = result
    ? [
      { name: "Skills", value: result.matchBreakdown?.skills ?? 0 },
      { name: "Experience", value: result.matchBreakdown?.experience ?? 0 },
      { name: "Education", value: result.matchBreakdown?.education ?? 0 },
      { name: "Certifications", value: result.matchBreakdown?.certifications ?? 0 },
      { name: "Keywords", value: result.matchBreakdown?.keywords ?? 0 },
    ]
    : [];

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#9ca3af"];

  return (
    <div className={`min-h-screen flex bg-gray-50 ${settings.darkMode ? "dark" : ""}`}>


      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header
          className={`flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 ${settings.darkMode ? "bg-gray-900 text-gray-100" : "bg-white"
            }`}
        >
          <div className="flex items-center gap-4">
            <div className="ml-6 hidden md:flex items-center gap-3 text-sm text-gray-500">
              <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">AI Model: GPT-4o  Mini</span>
              <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">Mode: Analysis</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (result) exportJSON();
                else alert("No result to export");
              }}
              className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-sm"
              title="Export JSON"
            >
              Export JSON
            </button>

            <button
              onClick={() => copySummary()}
              className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm"
            >
              Copy Summary
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: form + history */}
            <div className="lg:col-span-1 space-y-6">
              {/* Upload Card */}
              <section
                className={`p-4 rounded-2xl shadow-sm border ${settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
                  }`}
              >
                <h3 className="font-semibold mb-2">Upload & Analyze</h3>
                <form onSubmit={handleUpload} className="space-y-3">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-sm"
                  />
                  <textarea
                    rows={6}
                    placeholder="Paste the job description here..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 px-3 py-2 rounded-md text-white font-medium ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                      {loading ? "Analyzing..." : "Upload & Analyze"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setJobDesc("");
                        setResult(null);
                      }}
                      className="px-3 py-2 rounded-md border text-sm"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </section>

              {/* Recent History (compact) */}
              <section
                className={`p-4 rounded-2xl shadow-sm border ${settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Recent Analysis</h4>
                  <button onClick={() => navigate("history")} className="text-sm text-blue-600">
                    View all
                  </button>
                </div>

                <div className="mt-3 space-y-3 max-h-64 overflow-auto">
                  {history.length === 0 && <p className="text-sm text-gray-500">No history yet</p>}
                  {history.slice(0, 6).map((h) => (
                    <div
                      key={h._id}
                      className="p-2 rounded-md border hover:shadow-md cursor-pointer"
                      onClick={() => {
                        // quick load
                        setResult({
                          ...h,
                          // in case older history doesn't have full result structure,
                          // try to keep fields consistent
                          candidate: { name: h.candidateName },
                          matchPercentage: h.matchPercentage,
                          summary: h.summary,
                          recommendation: h.recommendation,
                          confidence: h.confidence ?? 60,
                          experience: h.experience ?? {},
                          requirementsSummary: {
                            requiredSkills: h.requiredSkills || [],
                            candidateSkills: h.candidateSkills || [],
                            matchingSkills: h.matchingSkills || [],
                            missingSkills: h.missingSkills || [],
                          },
                          skillDetails: h.skillDetails || [],
                          suggestedInterviewQuestions: h.suggestedInterviewQuestions || [],
                          suggestedResumeImprovements: h.suggestedResumeImprovements || [],
                          redFlags: h.redFlags || [],
                          matchBreakdown: h.matchBreakdown || {},
                        });
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{h.candidateName || "Anonymous"}</div>
                          <div className="text-xs text-gray-500">{new Date(h.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{h.matchPercentage}%</div>
                          <div className="text-xs text-gray-500">{h.recommendation}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Tips */}
              <section className={`p-4 rounded-2xl shadow-sm border ${settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <h4 className="font-semibold">Tips</h4>
                <ul className="mt-2 text-sm text-gray-600 list-disc ml-5">
                  <li>Include explicit project outcomes & metrics.</li>
                  <li>Add years of experience per technology (e.g., React — 2 yrs).</li>
                  <li>Mention testing / TypeScript / CI if you have it.</li>
                </ul>
              </section>
            </div>

            {/* Middle & Right columns: result & charts */}
            <div className="lg:col-span-2 grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Overview Cards (span full width on small screens) */}
              <div className="xl:col-span-2 space-y-4">
                <div className={`p-4 rounded-2xl shadow-sm border flex items-center justify-between gap-4 ${settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                  {/* Left: big match ring */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke={settings.darkMode ? "#1f2937" : "#e6e6e6"} strokeWidth="12" fill="none" />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke={result ? getColorForPercentage(result.matchPercentage) : "#80ffaeff"}
                          strokeWidth="12"
                          strokeDasharray={2 * Math.PI * 56}
                          strokeDashoffset={result ? (2 * Math.PI * 56) * (1 - (result.matchPercentage / 100)) : 2 * Math.PI * 56}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold" style={{color:"white"}}>{result?.matchPercentage ?? "—"}%</div>
                        <div className="text-xs text-gray-500">match</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-lg font-semibold">{result?.candidate?.name || "Candidate"}</div>
                      <div className="text-sm text-gray-500">{result?.candidate?.location || "—"}</div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Recommendation:</span>{" "}
                        <span className={`${result?.recommendation?.includes("Strong") ? "text-green-600" : result?.recommendation?.includes("Good") ? "text-yellow-600" : "text-red-600"}`}>
                          {result?.recommendation || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: KPI cards */}
                  <div className="flex gap-3 items-center">
                    <MiniKPI label="Confidence" value={`${result?.confidence ?? "—"}%`} color="yellow" />
                    <MiniKPI label="Total Exp" value={`${result?.experience?.totalYears ?? "—"} yrs`} color="blue" />
                    <MiniKPI label="Relevant Exp" value={`${result?.experience?.relevantYears ?? "—"} yrs`} color="green" />
                  </div>
                </div>

                {/* Summary & actions */}
                <div className={`p-4 rounded-2xl shadow-sm border ${settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Executive Summary</h4>
                      <p className="text-sm text-gray-600">{result?.summary || "No analysis yet. Upload a resume and paste a job description to start."}</p>

                      <div className="mt-3 flex gap-2">
                        <button onClick={() => exportJSON()} className="px-3 py-2 rounded-md bg-gray-100 text-sm">Export JSON</button>
                        <button onClick={() => copySummary()} className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm">Copy Summary</button>
                        <button
                          onClick={() => {
                            // Open printable report (simple new window)
                            const reportWindow = window.open("", "_blank");
                            reportWindow.document.write(`<pre>${JSON.stringify(result, null, 2)}</pre>`);
                            reportWindow.document.close();
                          }}
                          className="px-3 py-2 rounded-md border text-sm"
                        >
                          Print / Preview
                        </button>
                      </div>
                    </div>

                    {/* Quick metrics */}
                    <div className="w-60">
                      <div className="text-sm text-gray-500">Match Breakdown</div>
                      <div style={{ width: 200, height: 140 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={breakdownData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={55} paddingAngle={2}>
                              {breakdownData.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                              ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={24} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skill bar chart */}
                <div className={`p-4 rounded-2xl shadow-sm border ${settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                  <h4 className="font-semibold mb-3">Skill Match Scores</h4>
                  {skillBarData.length === 0 ? (
                    <p className="text-sm text-gray-500">No skill details available.</p>
                  ) : (
                    <div style={{ width: "100%", height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={skillBarData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <XAxis dataKey="skill" tick={{ fontSize: 12 }} />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                            {skillBarData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getColorForPercentage(entry.score)} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column: suggestions, projects, questions */}
              <div className="space-y-4">
                {/* Top Projects */}
                <section className={`p-4 rounded-2xl shadow-sm border ${settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                  <h4 className="font-semibold mb-3">Top Projects</h4>
                  {result?.experience?.topProjects?.length ? (
                    <div className="space-y-3">
                      {result.experience.topProjects.map((p, i) => (
                        <div key={i} className="p-3 rounded-md border hover:shadow">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{p.title}</div>
                              <div className="text-xs text-gray-500">{p.brief}</div>
                            </div>
                            <div className="text-xs text-gray-500">{p.techStack?.join(", ")}</div>
                          </div>
                          <div className="text-sm text-gray-600 mt-2"><strong>Impact:</strong> {p.impact}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No projects found in the analysis.</p>
                  )}
                </section>

                {/* Interview Questions */}
                <section className={`p-4 rounded-2xl shadow-sm border ${settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Interview Questions</h4>
                    <button
                      onClick={() => {
                        // copy questions
                        const text = (result?.suggestedInterviewQuestions || []).join("\n");
                        if (!text) return alert("No questions to copy");
                        navigator.clipboard.writeText(text).then(() => alert("Questions copied"));
                      }}
                      className="text-xs text-blue-600"
                    >
                      Copy
                    </button>
                  </div>

                  <ul className="mt-2 list-decimal list-inside text-sm text-gray-700">
                    {result?.suggestedInterviewQuestions?.length ? (
                      result.suggestedInterviewQuestions.map((q, i) => <li key={i} className="mb-1">{q}</li>)
                    ) : (
                      <li className="text-gray-500">No questions generated.</li>
                    )}
                  </ul>
                </section>

                {/* Resume Improvements & Red Flags */}
                <section className={`p-4 rounded-2xl shadow-sm border ${settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                  <h4 className="font-semibold">Resume Improvements</h4>
                  <ul className="mt-2 list-disc ml-5 text-sm text-gray-700">
                    {result?.suggestedResumeImprovements?.length ? (
                      result.suggestedResumeImprovements.map((s, i) => <li key={i} className="mb-1">{s}</li>)
                    ) : (
                      <li className="text-gray-500">No suggestions available.</li>
                    )}
                  </ul>

                  {result?.redFlags?.length > 0 && (
                    <>
                      <h5 className="mt-4 text-sm font-semibold text-red-600">Red Flags</h5>
                      <ul className="mt-2 list-disc ml-5 text-sm text-red-500">
                        {result.redFlags.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </>
                  )}
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* -----------------------------
   Small UI pieces / helpers
------------------------------ */

function MiniKPI({ label, value, color = "blue" }) {
  const bg = THEME_COLORS[color]?.[0] ?? THEME_COLORS.blue[0];
  return (
    <div className="px-3 py-2 rounded-md" style={{ background: "#fff0", minWidth: 110 }}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function getColorForPercentage(pct = 0) {
  const n = Number(pct);
  if (isNaN(n)) return "#22c55e";
  if (n >= 80) return "#16a34a";
  if (n >= 60) return "#22c55e";
  if (n >= 40) return "#f59e0b";
  return "#ef4444";
}
