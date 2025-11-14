import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-900 flex flex-col relative overflow-hidden">

      {/* ABSTRACT SOFT GRADIENT SHAPES */}
      <div className="absolute w-[650px] h-[650px] bg-gradient-to-br from-[#FFB08A] to-[#FF7F50] opacity-30 rounded-full blur-[140px] -top-20 -left-28"></div>
      <div className="absolute w-[450px] h-[450px] bg-gradient-to-br from-[#ffdcc9] to-[#FBE8D3] opacity-30 rounded-full blur-[140px] bottom-10 right-10"></div>

      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-6 backdrop-blur-xl bg-white/40 border-b border-[#EDEDED] relative z-10 shadow-sm">
        <h1 className="text-2xl">
          <span className="text-[#FF7F50]">Startogen</span> | <span className="text-gray-700">Resume Analyzer</span>
        </h1>


        <nav className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-[#FF7F50] font-medium hover:underline"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-[#FF7F50] hover:bg-[#FF6A35] text-white px-5 py-2 rounded-lg shadow-md transition-all hover:-translate-y-[2px]"
          >
            Register
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center py-20 px-5 relative z-10">
        <h2 className="text-4xl  max-w-3xl leading-tight tracking-tight">
          Startogen AI resume Analyzer
          <span className="block text-[#FF7F50]">Smart hiring starts here.</span>
        </h2>

        <p className="mt-6 text-gray-600 max-w-3xl text-lg leading-relaxed">
          AI-powered resume analysis to help HR teams evaluate candidates faster,
          improve hiring decisions, and reduce manual resume reading by 80%.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-10 bg-[#FF7F50] hover:bg-[#FF6A35] text-white px-8 py-3 rounded-xl text-lg shadow-lg transition-all hover:-translate-y-[3px]"
        >
          Try Resume Analyzer →
        </button>
      </div>

      {/* Features Section */}
      <section className="px-10 py-16 bg-white relative z-10 bg-opacity-60 backdrop-blur-xl">
        <h3 className="text-3xl text-center">Why Startogen AI Resume Analyzer?</h3>

        <p className="text-gray-600 text-center mt-4 max-w-2xl mx-auto text-lg">
          Upload a resume and job description — our AI evaluates skill match,
          ATS score, strengths, weaknesses, and gives actionable improvements.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
          <Feature
            title="Resume Parsing"
            description="Extracts skills, experience, job roles, and key insights automatically."
          />
          <Feature
            title="ATS Score"
            description="Checks how well the resume matches the job and highlights gaps."
          />
          <Feature
            title="Improvement Suggestions"
            description="AI suggests edits to boost resume quality and hiring success rate."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 mt-auto relative z-10">
        © {new Date().getFullYear()} Startogen — AI Resume Intelligence
      </footer>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="bg-[#FFF2EB] p-6 rounded-xl border border-[#FFD6C8] shadow-md transition-all hover:shadow-lg hover:-translate-y-[3px]">
      <h4 className="font-semibold text-lg text-[#FF7F50]">{title}</h4>
      <p className="text-gray-700 text-sm mt-2">{description}</p>
    </div>
  );
}
