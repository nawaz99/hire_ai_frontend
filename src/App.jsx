import React, { useState } from "react";
import axios from "axios";
import ResumeAnalyzer from "./components/ResumeAnalyzer";

export default function App() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resume || !job) {
      alert("Please enter both Resume and Job Description!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("https://hire-ai-backend.vercel.app/api/analyze", {
        resumeText: resume,
        jobDescription: job,
      });
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend. Please check server logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
    //   <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl p-8">
    //     <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
    //       🧠 AI Resume & Hiring Tool
    //     </h1>

    //     {/* Input Section */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    //       <div>
    //         <label className="block font-semibold mb-2 text-gray-700">Resume</label>
    //         <textarea
    //           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
    //           rows="10"
    //           placeholder="Paste the candidate's resume here..."
    //           value={resume}
    //           onChange={(e) => setResume(e.target.value)}
    //         ></textarea>
    //       </div>

    //       <div>
    //         <label className="block font-semibold mb-2 text-gray-700">Job Description</label>
    //         <textarea
    //           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
    //           rows="10"
    //           placeholder="Paste the job description here..."
    //           value={job}
    //           onChange={(e) => setJob(e.target.value)}
    //         ></textarea>
    //       </div>
    //     </div>

    //     <div className="text-center">
    //       <button
    //         onClick={handleAnalyze}
    //         disabled={loading}
    //         className={`${
    //           loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
    //         } text-white font-semibold py-3 px-8 rounded-lg transition`}
    //       >
    //         {loading ? "Analyzing..." : "Analyze Resume"}
    //       </button>
    //     </div>

    //     {/* Results Section */}
    //     {result && (
    //       <div className="mt-10 bg-gray-100 p-6 rounded-xl">
    //         <h2 className="text-2xl font-semibold mb-4 text-gray-800">📊 Analysis Results</h2>

    //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    //           <div className="bg-white p-4 rounded-lg shadow">
    //             <p className="text-sm text-gray-500">Match Percentage</p>
    //             <p className="text-3xl font-bold text-blue-600">{result.matchPercentage}%</p>
    //           </div>

    //           <div className="bg-white p-4 rounded-lg shadow">
    //             <p className="text-sm text-gray-500">Missing Skills</p>
    //             <p className="text-md font-semibold text-red-600">
    //               {result.missingSkills?.length
    //                 ? result.missingSkills.join(", ")
    //                 : "None 🎉"}
    //             </p>
    //           </div>

    //           <div className="bg-white p-4 rounded-lg shadow">
    //             <p className="text-sm text-gray-500">Overall Fit</p>
    //             <p className="text-md font-semibold text-green-600">
    //               {result.matchPercentage >= 80
    //                 ? "Excellent Fit 💎"
    //                 : result.matchPercentage >= 60
    //                 ? "Good Fit 👍"
    //                 : "Needs Improvement ⚙️"}
    //             </p>
    //           </div>
    //         </div>

    //         <div className="bg-white p-4 rounded-lg shadow mt-4">
    //           <p className="text-gray-700 whitespace-pre-line">{result.summary}</p>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <ResumeAnalyzer />
  );
}
