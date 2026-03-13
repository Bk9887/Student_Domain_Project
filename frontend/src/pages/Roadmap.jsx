import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import axios from "axios";
import { FaCheckCircle, FaRegCircle, FaPlayCircle, FaCode, FaNetworkWired, FaRocket, FaLock, FaTrophy, FaChevronDown, FaChevronUp, FaFileAlt, FaCheck, FaTimes } from "react-icons/fa";
import YouTube from "react-youtube";

const Roadmap = () => {
  const [domain, setDomain] = useState("Not Selected");
  const [tiers, setTiers] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("beginner");

  // Interactive State
  const [expandedModuleId, setExpandedModuleId] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Modals
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeTest, setActiveTest] = useState(null);

  // Popups
  const [unlockedModulePopup, setUnlockedModulePopup] = useState(null);
  const [unlockedTierPopup, setUnlockedTierPopup] = useState(null);

  // Test State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [testScore, setTestScore] = useState(0);
  const [showTestResults, setShowTestResults] = useState(false);

  const prevCompletedState = useRef({}); // Track unlock popups

  useEffect(() => {
    const selected = localStorage.getItem("selectedDomain") || "Not Selected";
    setDomain(selected);

    if (selected === "Not Selected") {
      setTiers([]);
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser ? currentUser._id : "anonymous";
    const token = localStorage.getItem("token");

    setFetchingData(true);

    Promise.all([
      axios.get(`${API_BASE_URL}/roadmap/${selected}/videos`), // The endpoint returns nested tiers -> modules -> steps
      axios.get(`${API_BASE_URL}/dashboard/progress/${userId}/${selected}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([roadmapRes, progressRes]) => {
        const fetchedTiers = roadmapRes.data.tiers || [];
        const cloudCompletedSteps = progressRes.data.completedVideos || [];

        setTiers(fetchedTiers);
        setCompletedSteps(cloudCompletedSteps);

        if (fetchedTiers.length > 0) {
          // Flatten modules to build our tracking dictionary
          const stateDict = {};
          fetchedTiers.forEach(tier => {
            tier.modules.forEach(m => {
              stateDict[m.id] = m.steps.every(s => cloudCompletedSteps.includes(s.id));
            });
            // Add tier completion to dict
            stateDict[tier.name] = tier.modules.every(m => m.steps.every(s => cloudCompletedSteps.includes(s.id)));
          });
          prevCompletedState.current = stateDict;

          // Auto-expand first incomplete module in beginner
          const begTier = fetchedTiers.find(t => t.name === 'beginner');
          if (begTier && begTier.modules.length > 0) {
            let targetExpandId = begTier.modules[0].id;
            for (let m of begTier.modules) {
              const allComplete = m.steps.every(s => cloudCompletedSteps.includes(s.id));
              if (!allComplete) {
                targetExpandId = m.id;
                break;
              }
            }
            setExpandedModuleId(targetExpandId);
          }
        }
      })
      .catch((err) => console.error("Roadmap fetch error:", err))
      .finally(() => setFetchingData(false));
  }, []);

  // --- Lock Logic Helpers ---
  const isTierComplete = (tierName) => {
    if (tiers.length === 0) return false;
    const tier = tiers.find(t => t.name === tierName);
    if (!tier) return false;
    // Check if every step in every module is included in completedSteps
    return tier.modules.every(m => m.steps.every(s => completedSteps.includes(s.id)));
  };

  const isBeginnerComplete = isTierComplete('beginner');
  const isIntermediateComplete = isTierComplete('intermediate');

  // Helper to check if a specific mapped module is unlocked (It's unlocked if it's the 1st module of the tier OR its prior module in that tier is 100% complete)
  const isModuleUnlocked = (moduleIdx) => {
    if (moduleIdx === 0) return true;
    const currentTierData = tiers.find(t => t.name === activeTab);
    if (!currentTierData) return false;

    const prevModule = currentTierData.modules[moduleIdx - 1];
    return prevModule.steps.every(step => completedSteps.includes(step.id));
  };

  // --- Progress Completion Handler ---
  const toggleStepCompletion = async (stepId, isManualToggle = false) => {
    if (isManualToggle && completedSteps.includes(stepId)) return;

    const newCompleted = [...completedSteps, stepId];
    const uniqueCompleted = [...new Set(newCompleted)];
    setCompletedSteps(uniqueCompleted);

    // Compute Total Progress and Points natively from the tiers tree
    let totalStepsCount = 0;
    let computedPoints = 0;

    // We must gracefully handle cases if tiers is somehow empty
    if (tiers && tiers.length > 0) {
      tiers.forEach(t => {
        t.modules.forEach(m => {
          totalStepsCount += m.steps.length;
          m.steps.forEach(s => {
            if (uniqueCompleted.includes(s.id)) {
              computedPoints += (s.xp || 50); // Default to 50 if somehow missing
            }
          });
        });
      });
    }

    const progressPercentage = totalStepsCount === 0 ? 0 : Math.round((uniqueCompleted.length / totalStepsCount) * 100);

    const user = JSON.parse(localStorage.getItem("currentUser"));
    const token = localStorage.getItem("token");

    if (user && user._id && token) {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/dashboard/${user._id}`,
          {
            domain,
            completedVideos: uniqueCompleted,
            progress: progressPercentage,
            points: computedPoints,
            isRawPoints: true
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Force the Navbar and Dashboard to visibly refresh the XP
        window.dispatchEvent(new Event("roadmapUpdated"));
      } catch (err) {
        console.error("Error updating progress:", err);
      }
    }

    // Checking locks triggers
    if (tiers.length === 0) return;

    let pendingModulePopup = null;
    let pendingTierPopup = null;

    tiers.forEach((tier, tierIdx) => {
      let isEntireTierComplete = true;

      tier.modules.forEach((mod, modIdx) => {
        const isNowComplete = mod.steps.every(s => uniqueCompleted.includes(s.id));
        if (!isNowComplete) {
          isEntireTierComplete = false;
        }

        // If this module just completely finished
        if (isNowComplete && !prevCompletedState.current[mod.id]) {
          prevCompletedState.current[mod.id] = true;
          // Check if there is another module in this tier to unlock
          if (modIdx + 1 < tier.modules.length) {
            const nextMod = tier.modules[modIdx + 1];
            pendingModulePopup = { moduleName: nextMod.title, targetId: nextMod.id };
          }
        }
      });

      // If the ENTIRE tier just finished
      if (isEntireTierComplete && !prevCompletedState.current[tier.name]) {
        prevCompletedState.current[tier.name] = true;
        if (tier.name === 'beginner') {
          pendingTierPopup = { tierName: 'Intermediate', targetTab: 'intermediate' };
        } else if (tier.name === 'intermediate') {
          pendingTierPopup = { tierName: 'Advanced', targetTab: 'advanced' };
        }
      }
    });

    // Prioritize showing Tier unlock over Module unlock if both happen simultaneously
    if (pendingTierPopup) {
      setUnlockedTierPopup(pendingTierPopup);
    } else if (pendingModulePopup) {
      setUnlockedModulePopup(pendingModulePopup);
    }
  };

  // --- MCQ Test Logic ---
  const handleTestOptionClick = (index) => setSelectedOptionIndex(index);

  const handleTestSubmit = () => {
    if (selectedOptionIndex === null) return;
    const isCorrect = selectedOptionIndex === activeTest.questions[currentQuestionIndex].answerIndex;
    if (isCorrect) setTestScore(prev => prev + 1);

    if (currentQuestionIndex + 1 < activeTest.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      setShowTestResults(true);
      const passScore = Math.ceil(activeTest.questions.length / 2);
      if (testScore + (isCorrect ? 1 : 0) >= passScore) {
        if (!completedSteps.includes(activeTest.id)) {
          toggleStepCompletion(activeTest.id, false);
        }
      }
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setTestScore(0);
    setShowTestResults(false);
  };

  // --- Utility Render Variables ---
  const getActiveTierModules = () => {
    if (tiers.length === 0) return [];
    const found = tiers.find(t => t.name === activeTab);
    return found ? found.modules : [];
  };

  // ------------------------------------------------------------------------------------------------ //

  if (domain === "Not Selected") {
    return (
      <div className="text-white text-center mt-10">
        <h2 className="text-xl font-semibold">Please select a domain first.</h2>
      </div>
    );
  }

  return (
    <div className="space-y-12 text-white pb-16 max-w-5xl mx-auto px-4 md:px-0">

      {/* Header */}
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase bg-gradient-to-r from-zinc-100 via-indigo-200 to-zinc-400 bg-clip-text text-transparent drop-shadow-sm transition-all duration-300">
          {domain} Track
        </h1>
        <p className="text-zinc-400 tracking-wide text-lg">AI-Architected Journey</p>
      </div>

      {fetchingData && loadingBlock()}

      {/* Main Container Elements rendering only when fetched */}
      {!fetchingData && tiers.length > 0 && (
        <>
          {/* Animated Timeline Tab Graphic */}
          <div className="relative w-full py-16 hidden md:block select-none">

            {/* Base Line */}
            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-emerald-500 to-amber-500 transform -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>

            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/4 w-28 h-28 bg-zinc-900 border-8 border-zinc-800 rounded-full flex items-center justify-center shadow-2xl z-10 transition-colors duration-300"><span className="font-bold text-sm tracking-widest text-zinc-300">FOUNDATION</span></div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/4 w-28 h-28 bg-zinc-900 border-8 border-zinc-800 rounded-full flex items-center justify-center shadow-2xl z-10 text-center leading-tight transition-colors duration-300"><span className="font-bold text-sm tracking-widest text-zinc-300">INDUSTRY<br />EXPERT</span></div>

            {/* Nodes Container */}
            <div className="relative w-[70%] mx-auto flex justify-between h-56">

              {/* Beginner Tab Node */}
              <div
                className={`relative flex flex-col items-center justify-end h-full cursor-pointer transition-transform duration-300 hover:scale-105 ${activeTab === 'beginner' ? 'opacity-100' : 'opacity-60 saturate-50'}`}
                onClick={() => {
                  setActiveTab('beginner');
                  // Auto toggle first module
                  const t = tiers.find(x => x.name === 'beginner');
                  if (t && t.modules.length > 0) setExpandedModuleId(t.modules[0].id);
                }}
              >
                <div className="absolute top-[35%] w-px h-16 bg-white/20"></div>
                <div className="w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-indigo-500/30 absolute top-[48%] -translate-y-1/2"></div>
                <div className="w-20 h-20 bg-zinc-950 border-[6px] border-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.4)] z-10 mb-2 transition-colors duration-300">
                  <FaCode className="text-3xl text-indigo-400" />
                </div>
                <span className="font-bold text-indigo-400 text-sm tracking-wider uppercase mt-2">Beginner</span>
              </div>

              {/* Intermediate Tab Node */}
              <div
                className={`relative flex flex-col items-center justify-start h-full transition-transform duration-300 ${!isBeginnerComplete ? 'cursor-not-allowed opacity-40 grayscale' : 'cursor-pointer hover:scale-105'} ${activeTab === 'intermediate' && isBeginnerComplete ? 'opacity-100' : 'opacity-60 saturate-50'}`}
                onClick={() => {
                  if (isBeginnerComplete) {
                    setActiveTab('intermediate');
                    const t = tiers.find(x => x.name === 'intermediate');
                    if (t && t.modules.length > 0) setExpandedModuleId(t.modules[0].id);
                  }
                }}
              >
                <div className="absolute top-[48%] w-px h-16 bg-white/20"></div>
                <div className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30 absolute top-[48%] -translate-y-1/2"></div>
                <span className="font-bold text-emerald-400 text-sm tracking-wider uppercase mb-2 flex items-center gap-1">
                  {!isBeginnerComplete && <FaLock className="text-xs" />} Intermediate
                </span>
                <div className={`w-20 h-20 bg-zinc-950 border-[6px] border-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)] z-10 mt-2 transition-colors duration-300 ${!isBeginnerComplete && 'border-zinc-700 shadow-none'}`}>
                  {!isBeginnerComplete ? <FaLock className="text-3xl text-zinc-600" /> : <FaNetworkWired className="text-3xl text-emerald-400" />}
                </div>
              </div>

              {/* Advanced Tab Node */}
              <div
                className={`relative flex flex-col items-center justify-end h-full transition-transform duration-300 ${!isIntermediateComplete || !isBeginnerComplete ? 'cursor-not-allowed opacity-40 grayscale' : 'cursor-pointer hover:scale-105'} ${activeTab === 'advanced' && isIntermediateComplete ? 'opacity-100' : 'opacity-60 saturate-50'}`}
                onClick={() => {
                  if (isBeginnerComplete && isIntermediateComplete) {
                    setActiveTab('advanced');
                    const t = tiers.find(x => x.name === 'advanced');
                    if (t && t.modules.length > 0) setExpandedModuleId(t.modules[0].id);
                  }
                }}
              >
                <div className="absolute top-[35%] w-px h-16 bg-white/20"></div>
                <div className="w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-500/30 absolute top-[48%] -translate-y-1/2"></div>
                <div className={`w-20 h-20 bg-zinc-950 border-[6px] border-amber-500 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.4)] z-10 mb-2 transition-colors duration-300 ${(!isIntermediateComplete || !isBeginnerComplete) && 'border-zinc-700 shadow-none'}`}>
                  {!isIntermediateComplete || !isBeginnerComplete ? <FaLock className="text-3xl text-zinc-600" /> : <FaRocket className="text-3xl text-amber-400" />}
                </div>
                <span className="font-bold text-amber-400 text-sm tracking-wider uppercase mt-2 flex items-center gap-1">
                  {(!isIntermediateComplete || !isBeginnerComplete) && <FaLock className="text-xs" />} Advanced
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Tab Fallback */}
          <div className="md:hidden flex space-x-1.5 bg-white/5 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveTab('beginner')}
              className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wide rounded-lg transition-all truncate px-1
                ${activeTab === 'beginner' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:bg-white/5'}`}
            >
              Beginner
            </button>
            <button
              onClick={() => isBeginnerComplete && setActiveTab('intermediate')}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wide rounded-lg transition-all truncate px-1
                ${!isBeginnerComplete ? 'text-zinc-600 cursor-not-allowed' : activeTab === 'intermediate' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-400 hover:bg-white/5'}`}
            >
              {!isBeginnerComplete && <FaLock className="text-[10px]" />} Intermediate
            </button>
            <button
              onClick={() => isBeginnerComplete && isIntermediateComplete && setActiveTab('advanced')}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wide rounded-lg transition-all truncate px-1
                ${!isIntermediateComplete || !isBeginnerComplete ? 'text-zinc-600 cursor-not-allowed' : activeTab === 'advanced' ? 'bg-amber-600 text-white shadow-lg' : 'text-zinc-400 hover:bg-white/5'}`}
            >
              {(!isIntermediateComplete || !isBeginnerComplete) && <FaLock className="text-[10px]" />} Advanced
            </button>
          </div>

          {/* Dynamic Module Accordion Stack */}
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-300">
            <div className={`absolute top-0 left-0 w-full h-1 opacity-50 transition-all duration-500 ${activeTab === 'beginner' ? 'bg-indigo-500 shadow-[0_0_30px_#6366f1]' : activeTab === 'intermediate' ? 'bg-emerald-500 shadow-[0_0_30px_#10b981]' : 'bg-amber-500 shadow-[0_0_30px_#f59e0b]'}`}></div>

            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
              <span className={`w-3 h-8 rounded-full transition-colors duration-500 ${activeTab === 'beginner' ? 'bg-indigo-500' : activeTab === 'intermediate' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="capitalize">{activeTab} Roadmap</span>
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {getActiveTierModules().map((mod, index) => {
                const isUnlocked = isModuleUnlocked(index);
                const isExpanded = expandedModuleId === mod.id;
                const moduleCompletedSteps = mod.steps.filter(s => completedSteps.includes(s.id)).length;
                const isFullyComplete = moduleCompletedSteps === mod.steps.length;

                return (
                  <div key={mod.id} className={`bg-[#121214] border rounded-2xl overflow-hidden transition-all duration-300 ${isUnlocked ? (isExpanded ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-white/10 hover:border-white/30') : 'border-white/5 opacity-60 grayscale'}`}>

                    {/* Header */}
                    <div className={`p-5 flex items-center justify-between transition-colors ${isUnlocked ? 'cursor-pointer hover:bg-white/[0.02]' : 'cursor-not-allowed'} ${isExpanded && 'bg-white/[0.03]'}`} onClick={() => { if (isUnlocked) setExpandedModuleId(isExpanded ? null : mod.id); }}>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {!isUnlocked ? <FaLock className="text-zinc-500 text-xl" /> : isFullyComplete ? <FaCheckCircle className="text-emerald-500 text-xl" /> : <FaRegCircle className="text-indigo-500 text-xl" />}
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight">{mod.title}</h3>
                          <p className="text-[10px] sm:text-xs text-zinc-500 mt-1 line-clamp-1">{mod.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {isUnlocked && !isFullyComplete && (
                          <span className="hidden sm:inline-block text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">{moduleCompletedSteps} / {mod.steps.length} Steps</span>
                        )}
                        {isUnlocked && <button className="text-zinc-400 hover:text-white transition-colors">{isExpanded ? <FaChevronUp /> : <FaChevronDown />}</button>}
                      </div>
                    </div>

                    {/* Step Body */}
                    {isExpanded && isUnlocked && (
                      <div className="p-2 pt-0 bg-[#0f0f11]">
                        <div className="space-y-1">
                          {mod.steps.map((step) => {
                            const isStepComplete = completedSteps.includes(step.id);
                            return (
                              <div key={step.id} className={`group flex items-center justify-between p-4 rounded-xl border border-transparent transition-all hover:bg-[#1a1a1f] ${isStepComplete ? 'opacity-70' : ''}`}>
                                <div className="flex items-center gap-4">
                                  <button className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${isStepComplete ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
                                    {isStepComplete && <FaCheck className="text-emerald-500 text-xs" />}
                                  </button>
                                  <div>
                                    <h4 className={`font-semibold text-sm ${isStepComplete ? 'text-zinc-400 line-through decoration-zinc-600' : 'text-zinc-200'}`}>{step.title}</h4>
                                    <p className="text-xs text-zinc-600 mt-0.5">{step.description}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                                  <span className="text-[10px] font-bold text-amber-500/80 tracking-widest hidden sm:block">+{step.xp} XP</span>
                                  <button
                                    onClick={() => {
                                      if (step.type === 'video') setActiveVideo(step);
                                      else if (step.type === 'test') { resetTest(); setActiveTest(step); }
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${isStepComplete ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : step.type === 'video' ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30' : 'bg-fuchsia-600/20 text-fuchsia-400 hover:bg-fuchsia-600/30'}`}
                                  >
                                    {step.type === 'video' ? <FaPlayCircle className="text-sm" /> : <FaFileAlt className="text-sm" />}
                                    {isStepComplete ? 'Review' : step.type === 'video' ? 'Watch' : 'Take Test'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ======================= MODALS ======================= */}

      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/[0.02]">
              <h3 className="font-bold text-lg text-white truncate pr-4">{activeVideo.title}</h3>
              <button onClick={() => setActiveVideo(null)} className="text-zinc-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none">✕ Close</button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <YouTube
                videoId={activeVideo.videoId}
                opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1, modestbranding: 1, rel: 0, origin: window.location.origin } }}
                onReady={(event) => event.target.playVideo()}
                onEnd={() => { toggleStepCompletion(activeVideo.id, false); setActiveVideo(null); }}
                className="absolute inset-0 w-full h-full"
                iframeClassName="w-full h-full"
              />
            </div>
            <div className="bg-white/5 p-3 text-center text-xs text-zinc-400 font-medium">💡 This step will automatically be marked complete when the video finishes.</div>
          </div>
        </div>
      )}

      {activeTest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-zinc-900 bg-zinc-900/50">
              <h3 className="font-bold text-lg text-fuchsia-400 flex items-center gap-2"><FaFileAlt /> {activeTest.title}</h3>
              <button onClick={() => setActiveTest(null)} className="text-zinc-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5 focus:outline-none">✕ Close</button>
            </div>
            <div className="p-8">
              {!showTestResults ? (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-zinc-500 font-medium text-sm">Question {currentQuestionIndex + 1} of {activeTest.questions.length}</span>
                    <div className="flex gap-1">
                      {activeTest.questions.map((_, i) => (<div key={i} className={`h-1.5 w-6 rounded-full ${i === currentQuestionIndex ? 'bg-fuchsia-500' : i < currentQuestionIndex ? 'bg-fuchsia-500/40' : 'bg-zinc-800'}`}></div>))}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-6 leading-relaxed">{activeTest.questions[currentQuestionIndex].question}</h4>
                  <div className="space-y-3 mb-8">
                    {activeTest.questions[currentQuestionIndex].options.map((option, idx) => (
                      <button key={idx} onClick={() => handleTestOptionClick(idx)} className={`w-full text-left p-4 rounded-xl border transition-all ${selectedOptionIndex === idx ? 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-100' : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full border text-xs ${selectedOptionIndex === idx ? 'border-fuchsia-500 bg-fuchsia-500 text-white' : 'border-zinc-600 text-zinc-500'}`}>{String.fromCharCode(65 + idx)}</div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleTestSubmit} disabled={selectedOptionIndex === null} className={`px-6 py-3 rounded-xl font-bold transition-all ${selectedOptionIndex === null ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-fuchsia-600 text-white hover:bg-fuchsia-500 hover:scale-105 active:scale-95'}`}>
                      {currentQuestionIndex + 1 === activeTest.questions.length ? 'Submit Assessment' : 'Next Question'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 animate-in zoom-in-95">
                  {testScore >= Math.ceil(activeTest.questions.length / 2) ? (
                    <>
                      <div className="w-20 h-20 bg-emerald-500/20 border-4 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400"><FaCheck className="text-4xl" /></div>
                      <h3 className="text-2xl font-bold text-white mb-2">Target Passed!</h3>
                      <p className="text-emerald-400 font-bold mb-6">Score: {testScore} / {activeTest.questions.length}</p>
                      <button onClick={() => setActiveTest(null)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-xl font-bold transition-all">Continue Roadmap</button>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-rose-500/20 border-4 border-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-400"><FaTimes className="text-4xl" /></div>
                      <h3 className="text-2xl font-bold text-white mb-2">Test Failed</h3>
                      <p className="text-rose-400 font-bold mb-6">Score: {testScore} / {activeTest.questions.length}</p>
                      <button onClick={resetTest} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-8 py-3 rounded-xl font-bold transition-all">Retake Assessment</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {unlockedModulePopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm bg-[#121214] border border-white/10 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500"></div>
            <div className="w-24 h-24 bg-zinc-900 border-4 border-indigo-500/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] mb-6 text-indigo-400"><FaTrophy className="text-5xl" /></div>
            <h3 className="font-extrabold text-2xl text-white mb-2 tracking-tight">Module Unlocked!</h3>
            <p className="text-zinc-400 mb-8 leading-relaxed">You've unlocked <span className="text-indigo-400 font-bold">{unlockedModulePopup.moduleName}</span>.</p>
            <button onClick={() => { setExpandedModuleId(unlockedModulePopup.targetId); setUnlockedModulePopup(null); }} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1">Start Next Module</button>
          </div>
        </div>
      )}

      {unlockedTierPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500"></div>
            <div className="w-24 h-24 bg-zinc-900 border-4 border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] mb-6 text-emerald-400"><FaTrophy className="text-5xl" /></div>
            <h3 className="font-extrabold text-2xl text-white mb-2 tracking-tight">Tier Completed!</h3>
            <p className="text-zinc-400 mb-8 leading-relaxed">Amazing! You've mastered that tier and unlocked the <span className="text-emerald-400 font-bold">{unlockedTierPopup.tierName}</span> Track.</p>
            <button onClick={() => { setActiveTab(unlockedTierPopup.targetTab); setUnlockedTierPopup(null); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1">Advance to {unlockedTierPopup.tierName}</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Roadmap;

function loadingBlock() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-indigo-400 font-medium tracking-wide animate-pulse">The Oracle is architecting your custom roadmap...</p>
      <p className="text-zinc-500 text-sm">(This may take 15-30 seconds)</p>
    </div>
  );
}