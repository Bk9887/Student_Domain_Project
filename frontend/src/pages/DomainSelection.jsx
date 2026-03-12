import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { FaRobot, FaArrowRight } from "react-icons/fa";
import BentoCard from "../components/BentoCard";
import GlowButton from "../components/GlowButton";
import InterestTestModal from "../components/InterestTestModal";

export default function DomainSelection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dbDomains, setDbDomains] = useState([]); // Raw MongoDB data
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("selectedDomain");
    if (saved) setSelectedDomain(saved);

    // Fetch live domains created using the Admin CMS Panel
    const fetchLiveDomains = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/domains");
        setDbDomains(res.data);
      } catch (err) {
        console.error("Failed to load domains from CMS:", err);
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchLiveDomains();
  }, []);

  const extractAiDomain = (text) => {
    if (!text) return null;

    // Primary check: try to find an H2 header (e.g. ## Domain Name)
    const headerMatch = text.match(/^##\s*(.+)/m);
    if (headerMatch) return headerMatch[1].replace(/\*/g, '').trim();

    // Secondary fallback: Old point format (- Best Domain: ...)
    const fallbackMatch = text.match(/[-\*]\s*\*?Best Domain\*?:\s*(.+)/i);
    if (!fallbackMatch) return null;
    return fallbackMatch[1].replace(/\*/g, '').trim();
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

      // Initialize/Start Journey in backend
      const res = await axios.post("http://localhost:5000/api/journey/start",
        { userId: user._id, domain: domainName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status !== 201 && res.status !== 200) throw new Error("Failed to start journey");

      const updatedUser = { ...user, domain: domainName };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      localStorage.setItem("selectedDomain", domainName);

      navigate("/roadmap");
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

      // Initialize/Start Journey in backend
      const res = await axios.post("http://localhost:5000/api/journey/start",
        { userId: user._id, domain: aiSuggestedDomain },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status !== 201 && res.status !== 200) throw new Error("Failed to start journey");

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

  const filteredDomains = dbDomains.filter((domain) =>
    domain.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="text-white">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center mb-8 tracking-tight text-balance
          bg-gradient-to-br from-white via-cyber-lime/80 to-zinc-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Discover Your Destiny
      </motion.h1>

      <div className="flex flex-col items-center gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setIsQuizOpen(true)}
            className="group relative px-8 py-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl overflow-hidden transition-all hover:bg-indigo-500/20 hover:border-indigo-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <FaRobot size={22} />
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-white uppercase tracking-wider">Take Interest Test</div>
              </div>
              <FaArrowRight className="ml-2 text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </motion.div>

        <div className="w-full flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="e.g., I'm fascinated by artificial intelligence and data networks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl px-5 py-3.5 rounded-bento
              bg-white/[0.03] backdrop-blur-[12px] border border-white/[0.08]
              focus:outline-none focus:ring-2 focus:ring-cyber-violet/50 focus:border-cyber-violet/30
              hover:bg-white/[0.05] text-white placeholder-zinc-500 transition-all"
          />
          <GlowButton variant="secondary" onClick={askAI}>
            Consult the Oracle
          </GlowButton>
        </div>
      </div>

      {loadingAI && (
        <p className="text-center text-cyber-lime font-medium tracking-wide mb-4 animate-pulse">
          The Oracle is analyzing your potential...
        </p>
      )}

      <AnimatePresence>
        {aiSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="max-w-xl mx-auto mb-8"
          >
            <BentoCard className="p-6 text-left" magnetic={false} accentColor="cyber-lime">
              <p className="text-cyber-lime font-bold mb-3 text-center text-sm uppercase tracking-widest border-b border-white/[0.1] pb-3">
                Oracle's Insight
              </p>
              <div className="text-white text-sm md:text-base leading-relaxed prose prose-invert max-w-none">
                <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
              </div>
              {aiSuggestedDomain && (
                <div className="mt-6 flex justify-center">
                  <GlowButton variant="primary" onClick={handleAIGetStarted}>
                    Get Started with {aiSuggestedDomain}
                  </GlowButton>
                </div>
              )}
            </BentoCard>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl font-bold mb-6 text-zinc-200 tracking-tight text-left">
        Popular Domains
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loadingConfig ? (
          <p className="text-zinc-400 col-span-full text-center py-10">
            Synthesizing Domain knowledge from the Matrix...
          </p>
        ) : filteredDomains.length > 0 ? (
          filteredDomains.map((domain, index) => {
            const colors = ["indigo", "emerald", "amber", "rose", "cyan", "violet"];
            const accentColor = colors[index % colors.length];
            return (
              <BentoCard
                key={domain._id}
                className="p-6 cursor-pointer"
                onClick={() => setSelectedInfo(domain)}
                accentColor={accentColor}
              >
                <h2 className={`text-xl font-bold mb-3 text-white group-hover:text-white transition-colors tracking-tight`}>
                  {domain.name}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">{domain.description}</p>
              </BentoCard>
            );
          })
        ) : (
          <p className="text-zinc-500 col-span-full text-center py-10">
            No active Domains match your query.
          </p>
        )}
      </div>

      <AnimatePresence>
        {selectedInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="max-w-2xl mx-auto"
          >
            <BentoCard className="p-8" magnetic={false} accentColor="indigo">
              <h2 className="text-3xl font-bold mb-3 text-white tracking-tight">
                {selectedInfo.name}
              </h2>
              <p className="mb-6 text-zinc-400 leading-relaxed">{selectedInfo.description}</p>
              <p className="font-bold text-cyber-lime mb-3 tracking-wide uppercase text-xs">
                Core Virtues
              </p>
              <ul className="mb-6 list-disc list-inside text-sm text-zinc-300 space-y-1">
                {selectedInfo.skills?.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
              <p className="font-bold text-cyber-lime mb-3 tracking-wide uppercase text-xs">
                Destined Paths
              </p>
              <ul className="mb-8 list-disc list-inside text-sm text-zinc-300 space-y-1">
                {selectedInfo.careers?.map((career, i) => (
                  <li key={i}>{career}</li>
                ))}
              </ul>
              <GlowButton variant="primary" onClick={() => handleGetStarted(selectedInfo.name)}>
                Get Started
              </GlowButton>
            </BentoCard>
          </motion.div>
        )}
      </AnimatePresence>

      <InterestTestModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectDomain={(domain) => {
          setIsQuizOpen(false);
          handleGetStarted(domain);
        }}
      />
    </div>
  );
}