import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const domainsData = [
  {
    id: 1,
    name: "Web Development",
    description: "Frontend, Backend, Full-Stack development",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    careers: ["Frontend Developer", "Backend Developer", "Full Stack Developer"]
  },
  {
    id: 2,
    name: "Data Science",
    description: "Python, ML, AI, Data Analysis",
    skills: ["Python", "Pandas", "Machine Learning", "SQL"],
    careers: ["Data Scientist", "ML Engineer", "AI Engineer"]
  },
  {
    id: 3,
    name: "Cyber Security",
    description: "Ethical Hacking, Network Security",
    skills: ["Networking", "Ethical Hacking", "Linux"],
    careers: ["Security Analyst", "Penetration Tester"]
  },
  {
    id: 4,
    name: "Mobile Development",
    description: "Flutter, React Native, Android, iOS",
    skills: ["Flutter", "React Native", "Kotlin"],
    careers: ["Android Developer", "iOS Developer"]
  },
  {
    id: 5,
    name: "Cloud Computing",
    description: "AWS, Azure, DevOps",
    skills: ["AWS", "Docker", "Kubernetes"],
    careers: ["Cloud Engineer", "DevOps Engineer"]
  }
];

export default function DomainSelection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const extractAiDomain = (text) => {
    if (!text) return null;

    // Primary check: try to find an H2 header (e.g. ## Domain Name)
    const headerMatch = text.match(/^##\s*\*?([^\n\*]+)/m);
    if (headerMatch) return headerMatch[1].trim();

    // Secondary fallback: Old point format (- Best Domain: ...)
    const fallbackMatch = text.match(/[-\*]\s*\*?Best Domain\*?:\s*\*?([^\n]+)/i);
    if (!fallbackMatch) return null;
    let domainStr = fallbackMatch[1].trim();
    return domainStr.replace(/\*+$/, '').trim();
  };

  const aiSuggestedDomain = extractAiDomain(aiSuggestion);

  useEffect(() => {
    const saved = localStorage.getItem("selectedDomain");
    if (saved) setSelectedDomain(saved);
  }, []);

  // ================= Ask AI for domain recommendation =================
  const askAI = async () => {
    if (!search) return;

    console.log("Ask AI clicked. Sending query:", search); // debug log

    try {
      setLoadingAI(true);
      setAiSuggestion("");

      const res = await fetch("http://localhost:5000/api/ai/domain-advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: search })
      });

      if (!res.ok) {
        console.error("Backend returned an error:", res.status, res.statusText);
        setAiSuggestion("AI could not provide a suggestion (server error).");
        return;
      }

      const data = await res.json();
      console.log("AI response data:", data); // debug log

      if (data && data.suggestion) {
        setAiSuggestion(data.suggestion);
      } else {
        setAiSuggestion("AI did not return any suggestion.");
      }
    } catch (err) {
      console.error("AI error:", err);
      setAiSuggestion("AI could not provide a suggestion (network error).");
    } finally {
      setLoadingAI(false);
    }
  };

  // ================= Save selected domain to backend =================
  const handleGetStarted = async (domainName) => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/domain/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ domain: domainName })
      });

      if (!res.ok) throw new Error("Failed to update domain");

      const updatedUser = { ...user, domain: domainName };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      localStorage.setItem("selectedDomain", domainName);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while selecting the domain.");
    }
  };

  const handleAIGetStarted = async () => {
    if (!aiSuggestedDomain) return;
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/domain/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ domain: aiSuggestedDomain })
      });

      if (!res.ok) throw new Error("Failed to update domain");

      const updatedUser = { ...user, domain: aiSuggestedDomain };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      localStorage.setItem("selectedDomain", aiSuggestedDomain);

      // Redirect to roadmap directly
      navigate("/roadmap");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while selecting the domain.");
    }
  };

  const filteredDomains = domainsData.filter((domain) =>
    domain.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="text-white px-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Choose Your Domain
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Describe your interest (ex: I like AI and statistics)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-5 py-3 rounded-xl
            bg-white/5 backdrop-blur-xl border border-white/10
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            text-white placeholder-gray-400"
        />
      </div>

      {/* Ask AI Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={askAI}
          className="px-6 py-2 rounded-lg
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-700 hover:to-purple-700"
        >
          Ask AI
        </button>
      </div>

      {/* AI Loading */}
      {loadingAI && (
        <p className="text-center text-indigo-300 mb-4">
          AI is thinking...
        </p>
      )}

      {/* AI Result */}
      {aiSuggestion && (
        <div className="max-w-xl mx-auto mb-6 p-6
          rounded-xl bg-white/5 border border-white/10 text-left">
          <p className="text-indigo-300 font-semibold mb-3 text-center text-lg border-b border-indigo-500/30 pb-2">
            AI Recommendation
          </p>
          <div className="text-white text-sm md:text-base leading-relaxed prose prose-invert max-w-none">
            <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
          </div>
          {aiSuggestedDomain && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleAIGetStarted}
                className="px-6 py-3 rounded-xl font-semibold
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  hover:from-indigo-700 hover:to-purple-700"
              >
                Get Started with {aiSuggestedDomain}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Domain Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {filteredDomains.map((domain) => (
          <div
            key={domain.id}
            onClick={() => setSelectedInfo(domain)}
            className="group p-6 rounded-2xl cursor-pointer
              bg-white/5 backdrop-blur-xl border border-white/10
              hover:scale-105 hover:bg-gradient-to-r
              hover:from-indigo-500 hover:to-purple-600
              transition-all"
          >
            <h2 className="text-xl font-semibold mb-3">{domain.name}</h2>
            <p className="text-blue-200 text-sm">{domain.description}</p>
          </div>
        ))}
      </div>

      {/* INFO BOX */}
      {selectedInfo && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl
          bg-white/5 border border-white/10 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-3">{selectedInfo.name}</h2>
          <p className="mb-4 text-blue-200">{selectedInfo.description}</p>

          <p className="font-semibold mb-2">Skills</p>
          <ul className="mb-4 list-disc list-inside text-sm text-gray-300">
            {selectedInfo.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>

          <p className="font-semibold mb-2">Career Paths</p>
          <ul className="mb-6 list-disc list-inside text-sm text-gray-300">
            {selectedInfo.careers.map((career, i) => (
              <li key={i}>{career}</li>
            ))}
          </ul>

          <button
            onClick={() => handleGetStarted(selectedInfo.name)}
            className="px-6 py-3 rounded-xl font-semibold
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700"
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
}