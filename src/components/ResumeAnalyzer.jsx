import { useState, useEffect } from "react";




function ReadMoreText({ text, limit = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const displayText = isExpanded ? text : text.slice(0, limit) + (text.length > limit ? "..." : "");

  return (
    <p>
      {displayText}{" "}
      {text.length > limit && (
        <span
          onClick={toggleReadMore}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {isExpanded ? "Read less" : "Read more"}
        </span>
      )}
    </p>
  );
}


export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch past analyses
  useEffect(() => {
    fetch("http://localhost:5000/api/getResults")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch(console.error);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !jobDesc) return alert("Upload file and enter job description");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDesc);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/upload-resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("📊 Analysis result:", data);
      setResult(data);

      // Save summary result in DB
      await fetch("http://localhost:5000/api/saveResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: "",
          jobDescription: jobDesc,
          matchPercentage: data.matchPercentage || 0,
          missingSkills: data.requirementsSummary?.missingSkills || [],
          summary: data.summary || "",
        }),
      });

      const histRes = await fetch("http://localhost:5000/api/getResults");
      const histData = await histRes.json();
      setHistory(histData);
    } catch (err) {
      console.error(err);
      alert("Error uploading/analyzing file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">AI Resume Analyzer</h1>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="space-y-4 bg-gray-50 p-6 rounded shadow relative"
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Paste job description here"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="border p-2 w-full h-32"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-md ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </form>

      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg z-50">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-700 font-medium">
            Analyzing your resume...
          </p>
        </div>
      )}

      {/* Analysis Result */}
      {result && !loading && (
        <div className="mt-6 p-6 bg-white border rounded shadow-md space-y-4">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            Analysis Result
          </h2>

          <p className="text-lg">
            <strong>Match Percentage:</strong>{" "}
            <span className="text-green-600 font-semibold">
              {result.matchPercentage || 0}%
            </span>
          </p>

          <p>
            <strong>Experience:</strong> {result.experience || "N/A"}
          </p>

          <p>
            <strong>Recommendation:</strong>{" "}
            <span
              className={`${result.recommendation?.includes("Strong")
                ? "text-green-700 font-semibold"
                : result.recommendation?.includes("Good")
                  ? "text-yellow-700 font-semibold"
                  : "text-red-700 font-semibold"
                }`}
            >
              {result.recommendation || "N/A"}
            </span>
          </p>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Skills Overview:</h3>

            {/* Required Skills */}
            <div>
              <p className="font-medium text-gray-600 mb-1">Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {result.requirementsSummary?.requiredSkills?.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-200 text-sm rounded-full"
                  >
                    {s}
                  </span>
                )) || <p className="text-gray-500">N/A</p>}
              </div>
            </div>

            {/* Candidate Skills */}
            <div>
              <p className="font-medium text-gray-600 mb-1">
                Candidate Skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {result.requirementsSummary?.candidateSkills?.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {s}
                  </span>
                )) || <p className="text-gray-500">N/A</p>}
              </div>
            </div>

            {/* Matching Skills */}
            <div>
              <p className="font-medium text-gray-600 mb-1">Matching Skills:</p>
              <div className="flex flex-wrap gap-2">
                {result.requirementsSummary?.matchingSkills?.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                  >
                    {s}
                  </span>
                )) || <p className="text-gray-500">N/A</p>}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <p className="font-medium text-gray-600 mb-1">Missing Skills:</p>
              <div className="flex flex-wrap gap-2">
                {result.requirementsSummary?.missingSkills?.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                  >
                    {s}
                  </span>
                )) || <p className="text-gray-500">N/A</p>}
              </div>
            </div>
          </div>

          <p className="pt-3 border-t text-gray-800 leading-relaxed">
            <strong>Summary:</strong> {result.summary || result.raw || "N/A"}
          </p>
        </div>
      )}

      {/* History Table */}
      {history.length > 0 && !loading && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Job Description</th>
                  <th className="border px-4 py-2">Match %</th>
                  <th className="border px-4 py-2">Missing Skills</th>
                  <th className="border px-4 py-2">Summary</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 max-w-xs truncate">
                      {item.jobDescription}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {item.matchPercentage}
                    </td>
                    <td className="border px-4 py-2">
                      {item.missingSkills?.join(", ")}
                    </td>
                    <td className="border px-4 py-2">
                      <ReadMoreText text={item.summary} limit={60} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
