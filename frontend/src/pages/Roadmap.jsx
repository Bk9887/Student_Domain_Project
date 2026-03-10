import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaCheckCircle, FaRegCircle, FaPlayCircle, FaCode, FaNetworkWired, FaRocket, FaLock, FaTrophy } from "react-icons/fa";
import YouTube from "react-youtube";

const Roadmap = () => {
  const [videos, setVideos] = useState([]);
  const [fetchingVideos, setFetchingVideos] = useState(false);
  const [domain, setDomain] = useState("Not Selected");

  // New Interactive State
  const [activeTab, setActiveTab] = useState("beginner");
  const [completedVideos, setCompletedVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  // Popup state
  const [unlockedTierPopup, setUnlockedTierPopup] = useState(null);
  const prevCompletedState = useRef({ beginner: true, intermediate: true }); // Assume true on mount to skip initial popups

  useEffect(() => {
    const selected = localStorage.getItem("selectedDomain") || "Not Selected";
    setDomain(selected);

    if (selected === "Not Selected") {
      setVideos([]);
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser ? currentUser._id : "anonymous";
    const token = localStorage.getItem("token");

    setFetchingVideos(true);

    Promise.all([
      axios.get(`http://localhost:5000/api/roadmap/${selected}/videos`),
      axios.get(`http://localhost:5000/api/dashboard/progress/${userId}/${selected}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
      .then(([videosRes, progressRes]) => {
        const fetchedVideos = videosRes.data.videos || [];
        const cloudCompletedVideos = progressRes.data.completedVideos || [];

        setVideos(fetchedVideos);
        setCompletedVideos(cloudCompletedVideos);

        // Intelligently initialize the strictly historical completion state so we don't popup on load
        if (fetchedVideos.length > 0) {
          const begIds = fetchedVideos.slice(0, 4).map(v => v.id);
          const intIds = fetchedVideos.slice(4, 8).map(v => v.id);
          prevCompletedState.current = {
            beginner: begIds.length > 0 && begIds.every(id => cloudCompletedVideos.includes(id)),
            intermediate: intIds.length > 0 && intIds.every(id => cloudCompletedVideos.includes(id))
          };
        }
      })
      .catch((err) => {
        console.error("Roadmap fetch error:", err);
      })
      .finally(() => {
        setFetchingVideos(false);
      });
  }, []);

  // Handle checking off a video
  const toggleVideoCompletion = async (vidId) => {
    let newCompleted;
    if (completedVideos.includes(vidId)) {
      // Optional: Remove completion if already checked
      newCompleted = completedVideos.filter(id => id !== vidId);
    } else {
      newCompleted = [...completedVideos, vidId];
    }

    setCompletedVideos(newCompleted);

    const user = JSON.parse(localStorage.getItem("currentUser"));

    // Calculate explicit points instead of percentage based on tier index
    const pointValues = [20, 30, 40, 50];
    let accumulatedPoints = 0;

    newCompleted.forEach(vidId => {
      const index = videos.findIndex(v => v.id === vidId);
      if (index !== -1) {
        accumulatedPoints += pointValues[index % 4];
      }
    });

    // Calculate physical completion percentage
    const completionPercentage = videos.length > 0 ? Math.round((newCompleted.length / videos.length) * 100) : 0;

    const token = localStorage.getItem("token");

    if (user && user._id && token) {
      try {
        await axios.post(
          `http://localhost:5000/api/dashboard/${user._id}`,
          {
            domain,
            progress: completionPercentage,
            points: accumulatedPoints,
            isRawPoints: true,
            completedVideos: newCompleted
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Optimistically update the globally tracked user points and trigger Navbar refresh
        const basePoints = user.points || 50; // Use signup bonus points if zero 
        user.points = basePoints;
        localStorage.setItem("currentUser", JSON.stringify(user));

      } catch (error) {
        console.error("Failed to sync roadmap progress:", error);
      }
    }

    // Dispatch event to update UI elements like navbar points natively
    window.dispatchEvent(new Event("roadmapUpdated"));
    window.dispatchEvent(new Event("storage")); // Trigger global re-render for header
  };

  // Artificial chunking for UI presentation
  const begVideos = videos.slice(0, 4);
  const intVideos = videos.slice(4, 8);
  const advVideos = videos.slice(8);

  const isBeginnerComplete = begVideos.length > 0 && begVideos.every(v => completedVideos.includes(v.id));
  const isIntermediateComplete = intVideos.length > 0 && intVideos.every(v => completedVideos.includes(v.id));

  // Dynamic Event Listener for Unlocks
  useEffect(() => {
    if (videos.length === 0) return; // Wait until loaded

    // Check if beginner recently finished
    if (isBeginnerComplete && !prevCompletedState.current.beginner) {
      setUnlockedTierPopup({ tierName: "Intermediate", targetTab: "intermediate" });
      prevCompletedState.current.beginner = true; // Lock so it doesn't fire again
    }

    // Check if intermediate recently finished
    if (isIntermediateComplete && !prevCompletedState.current.intermediate) {
      setUnlockedTierPopup({ tierName: "Advanced", targetTab: "advanced" });
      prevCompletedState.current.intermediate = true; // Lock
    }

  }, [isBeginnerComplete, isIntermediateComplete, videos.length]);

  // Get active video list for the checklist
  const getActiveVideos = () => {
    if (activeTab === "beginner") return begVideos;
    if (activeTab === "intermediate") return intVideos;
    if (activeTab === "advanced") return advVideos;
    return [];
  };

  if (domain === "Not Selected") {
    return (
      <div className="text-white text-center mt-10">
        <h2 className="text-xl font-semibold">
          Please select a domain first.
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-16 text-white pb-16">

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase bg-gradient-to-r from-zinc-100 via-indigo-200 to-zinc-400 bg-clip-text text-transparent drop-shadow-sm">
          {domain} Roadmap Template
        </h1>
        <p className="text-zinc-400 tracking-wide">Interactive Guide to Mastery</p>
      </div>

      {/* Interactive Timeline Graphics */}
      <div className="relative w-full py-16 hidden md:block select-none">

        {/* Central Connected Line */}
        <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-emerald-500 to-amber-500 transform -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>

        {/* Start Node */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/4 w-28 h-28 bg-zinc-900 border-8 border-zinc-800 rounded-full flex items-center justify-center shadow-2xl z-10">
          <span className="font-bold text-sm tracking-widest text-zinc-300">FOUNDATION</span>
        </div>

        {/* Finish Node */}
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/4 w-28 h-28 bg-zinc-900 border-8 border-zinc-800 rounded-full flex items-center justify-center shadow-2xl z-10 text-center leading-tight">
          <span className="font-bold text-sm tracking-widest text-zinc-300">INDUSTRY<br />EXPERT</span>
        </div>

        {/* Interactive Nodes Container */}
        <div className="relative w-[70%] mx-auto flex justify-between h-56">

          {/* Beginner Node (Bottom Style) */}
          <div className={`relative flex flex-col items-center justify-end h-full cursor-pointer transition-transform duration-300 hover:scale-105 ${activeTab === 'beginner' ? 'opacity-100' : 'opacity-60 saturate-50'}`} onClick={() => setActiveTab('beginner')}>
            <div className="absolute top-[35%] w-px h-16 bg-white/20"></div> {/* Connecting line to track */}
            <div className="w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-indigo-500/30 absolute top-[48%] -translate-y-1/2"></div> {/* Track dot */}

            <div className="w-20 h-20 bg-zinc-950 border-[6px] border-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.4)] z-10 mb-2">
              <FaCode className="text-3xl text-indigo-400" />
            </div>
            <span className="font-bold text-indigo-400 text-sm tracking-wider uppercase mt-2">Beginner</span>
          </div>

          {/* Intermediate Node (Top Style) */}
          <div
            className={`relative flex flex-col items-center justify-start h-full transition-transform duration-300 ${!isBeginnerComplete ? 'cursor-not-allowed opacity-40 grayscale' : 'cursor-pointer hover:scale-105'} ${activeTab === 'intermediate' && isBeginnerComplete ? 'opacity-100' : 'opacity-60 saturate-50'}`}
            onClick={() => isBeginnerComplete && setActiveTab('intermediate')}
          >
            <div className="absolute top-[48%] w-px h-16 bg-white/20"></div> {/* Connecting line to track */}
            <div className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30 absolute top-[48%] -translate-y-1/2"></div> {/* Track dot */}

            <span className="font-bold text-emerald-400 text-sm tracking-wider uppercase mb-2 flex items-center gap-1">
              {!isBeginnerComplete && <FaLock className="text-xs" />} Intermediate
            </span>
            <div className={`w-20 h-20 bg-zinc-950 border-[6px] border-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)] z-10 mt-2 ${!isBeginnerComplete && 'border-zinc-700 shadow-none'}`}>
              {!isBeginnerComplete ? <FaLock className="text-3xl text-zinc-600" /> : <FaNetworkWired className="text-3xl text-emerald-400" />}
            </div>
          </div>

          {/* Advanced Node (Bottom Style) */}
          <div
            className={`relative flex flex-col items-center justify-end h-full transition-transform duration-300 ${!isIntermediateComplete || !isBeginnerComplete ? 'cursor-not-allowed opacity-40 grayscale' : 'cursor-pointer hover:scale-105'} ${activeTab === 'advanced' && isIntermediateComplete ? 'opacity-100' : 'opacity-60 saturate-50'}`}
            onClick={() => isBeginnerComplete && isIntermediateComplete && setActiveTab('advanced')}
          >
            <div className="absolute top-[35%] w-px h-16 bg-white/20"></div> {/* Connecting line to track */}
            <div className="w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-500/30 absolute top-[48%] -translate-y-1/2"></div> {/* Track dot */}

            <div className={`w-20 h-20 bg-zinc-950 border-[6px] border-amber-500 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.4)] z-10 mb-2 ${(!isIntermediateComplete || !isBeginnerComplete) && 'border-zinc-700 shadow-none'}`}>
              {!isIntermediateComplete || !isBeginnerComplete ? <FaLock className="text-3xl text-zinc-600" /> : <FaRocket className="text-3xl text-amber-400" />}
            </div>
            <span className="font-bold text-amber-400 text-sm tracking-wider uppercase mt-2 flex items-center gap-1">
              {(!isIntermediateComplete || !isBeginnerComplete) && <FaLock className="text-xs" />} Advanced
            </span>
          </div>

        </div>
      </div>

      {/* Mobile Tab Selector (Fallback for small screens) */}
      <div className="md:hidden flex space-x-2 bg-white/5 p-1 rounded-xl">
        <button onClick={() => setActiveTab('beginner')} className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-colors ${activeTab === 'beginner' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:bg-white/5'}`}>Beg</button>
        <button
          onClick={() => isBeginnerComplete && setActiveTab('intermediate')}
          className={`flex-1 flex items-center justify-center gap-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-colors ${!isBeginnerComplete ? 'text-zinc-600 cursor-not-allowed' : activeTab === 'intermediate' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-400 hover:bg-white/5'}`}
        >
          {!isBeginnerComplete && <FaLock className="text-xs" />} Int
        </button>
        <button
          onClick={() => isBeginnerComplete && isIntermediateComplete && setActiveTab('advanced')}
          className={`flex-1 flex items-center justify-center gap-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-colors ${!isIntermediateComplete || !isBeginnerComplete ? 'text-zinc-600 cursor-not-allowed' : activeTab === 'advanced' ? 'bg-amber-600 text-white shadow-lg' : 'text-zinc-400 hover:bg-white/5'}`}
        >
          {(!isIntermediateComplete || !isBeginnerComplete) && <FaLock className="text-xs" />} Adv
        </button>
      </div>

      {/* Checklist Panel */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">

        {/* Decorative Tab Indicator Glow */}
        <div className={`absolute top-0 left-0 w-full h-1 opacity-50 transition-colors duration-500 ${activeTab === 'beginner' ? 'bg-indigo-500 shadow-[0_0_30px_#6366f1]' : activeTab === 'intermediate' ? 'bg-emerald-500 shadow-[0_0_30px_#10b981]' : 'bg-amber-500 shadow-[0_0_30px_#f59e0b]'}`}></div>

        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className={`w-3 h-8 rounded-full transition-colors duration-500 ${activeTab === 'beginner' ? 'bg-indigo-500' : activeTab === 'intermediate' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          <span className="capitalize">{activeTab} Checklist</span>
        </h2>

        {fetchingVideos ? (
          <div className="flex justify-center py-12">
            <p className="text-indigo-400 font-medium animate-pulse tracking-wide">Synthesizing curriculum...</p>
          </div>
        ) : getActiveVideos().length > 0 ? (
          <div className="space-y-6">
            {getActiveVideos().map((vid, index) => {
              const isCompleted = completedVideos.includes(vid.id);
              return (
                <div key={vid.id} className={`group flex flex-col md:flex-row items-start md:items-center gap-6 p-5 rounded-2xl border transition-all duration-300 ${isCompleted ? 'bg-white/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'bg-zinc-900/50 border-white/[0.05] hover:border-white/20 hover:bg-zinc-800/80 shadow-lg'}`}>

                  {/* Checkbox Trigger */}
                  <button
                    onClick={() => toggleVideoCompletion(vid.id)}
                    className="flex-shrink-0 mt-2 md:mt-0 transition-transform active:scale-95"
                  >
                    {isCompleted ? (
                      <FaCheckCircle className="text-3xl text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] rounded-full" />
                    ) : (
                      <FaRegCircle className="text-3xl text-zinc-500 group-hover:text-zinc-400" />
                    )}
                  </button>

                  {/* Step Info */}
                  <div className="flex-grow">
                    <h3 className={`font-bold text-lg mb-1 tracking-tight ${isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-100'}`}>
                      Step {index + 1}
                    </h3>
                    <p className={`text-sm ${isCompleted ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      Instructor: <span className="font-semibold">{vid.channelTitle}</span>
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
                        XP +{[20, 30, 40, 50][index % 4]}
                      </span>
                      {isCompleted && (
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded-md">Completed</span>
                      )}
                    </div>
                  </div>
                  {/* Action Button */}
                  <button
                    onClick={() => setActiveVideo(vid)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all focus:outline-none ${isCompleted ? 'bg-white/10 text-zinc-300 hover:bg-white/20' : 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:bg-indigo-500 hover:scale-105 active:scale-95'}`}
                  >
                    <FaPlayCircle className="text-lg" />
                    {isCompleted ? 'Watch Again' : 'Watch Lesson'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-500 border border-dashed border-white/10 rounded-2xl p-8 max-w-sm mx-auto">
              No curriculum items available for this tier yet.
            </p>
          </div>
        )}
      </div>

      {/* Video Modal Overlay */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/[0.02]">
              <h3 className="font-bold text-lg text-white truncate pr-4">{activeVideo.title}</h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-zinc-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none"
              >
                ✕ Close
              </button>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-video w-full bg-black">
              <YouTube
                videoId={activeVideo.id}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 1,
                    modestbranding: 1,
                    rel: 0,
                    origin: window.location.origin
                  },
                }}
                onReady={(event) => {
                  // Force playback on load to bypass some browser autoplay restrictions
                  event.target.playVideo();
                }}
                onEnd={() => {
                  toggleVideoCompletion(activeVideo.id);
                  setActiveVideo(null); // Auto-close modal
                }}
                className="absolute inset-0 w-full h-full"
                iframeClassName="w-full h-full"
              />
            </div>

            {/* Auto-tick instructions */}
            <div className="bg-white/5 p-3 text-center text-xs text-zinc-400 font-medium">
              💡 This step will automatically be marked complete and your points will sync when the video finishes.
            </div>

          </div>
        </div>
      )}

      {/* Tier Unlocked Success Modal */}
      {unlockedTierPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.3)] overflow-hidden flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500">

            {/* Sparkles / Effects */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500"></div>

            <div className="w-24 h-24 bg-zinc-900 border-4 border-indigo-500/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] mb-6 text-indigo-400">
              <FaTrophy className="text-5xl drop-shadow-lg" />
            </div>

            <h3 className="font-extrabold text-2xl text-white mb-2 tracking-tight">Tier Unlocked!</h3>

            <p className="text-zinc-400 mb-8 leading-relaxed">
              Congratulations! You have completed the prerequisites and gained access to the <span className="text-indigo-400 font-bold">{unlockedTierPopup.tierName}</span> track.
            </p>

            <button
              onClick={() => {
                setActiveTab(unlockedTierPopup.targetTab);
                setUnlockedTierPopup(null);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none"
            >
              Let's Go!
            </button>
            <button
              onClick={() => setUnlockedTierPopup(null)}
              className="mt-4 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Roadmap;