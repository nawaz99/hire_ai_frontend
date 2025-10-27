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
    <ResumeAnalyzer />
  );
}
