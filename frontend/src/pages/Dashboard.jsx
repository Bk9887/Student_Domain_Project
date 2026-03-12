import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { FaStar } from "react-icons/fa";
import BentoCard from "../components/BentoCard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState("Not Selected");
  const [progress, setProgress] = useState(0);
  const [points, setPoints] = useState(0);
  const [rank, setRank] = useState("—");
  const [isNewUser, setIsNewUser] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/dashboard/${currentUser._id}?t=${Date.now()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSelectedDomain(res.data.selectedDomain);
      setProgress(res.data.progress);
      setPoints(res.data.points);
      setRank(res.data.rank);

      // update domain in localStorage so app stays consistent
      const updatedUser = {
        ...currentUser,
        domain: res.data.selectedDomain === "Not Selected" ? null : res.data.selectedDomain,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!localStorage.getItem(`welcomed_${currentUser._id}`)) {
      setShowWelcome(true);
      localStorage.setItem(`welcomed_${currentUser._id}`, "true");
    }

    setUser(currentUser);

    if (!currentUser.domain) {
      setIsNewUser(true);
    }

    fetchDashboard();
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      fetchDashboard();
    };

    const handleFocus = () => {
      fetchDashboard();
    };

    window.addEventListener("roadmapUpdated", handleUpdate);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("roadmapUpdated", handleUpdate);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6">

      {/* Welcome message */}
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
        {isNewUser ? `Welcome, ${user.name}` : `Welcome back, ${user.name}. Ready to level up?`}
      </h1>

      {/* Choose Domain Button for new users */}
      {selectedDomain === "Not Selected" && (
        <button
          onClick={() => navigate("/domains")}
          className="px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-500/20
            bg-indigo-600 border border-indigo-500
            hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300 text-white"
        >
          Choose a Domain
        </button>
      )}

      <div className="grid md:grid-cols-4 gap-6">

        {/* Domain Card */}
        <BentoCard className="p-7" accentColor="indigo">
          <p className="text-zinc-400 font-bold mb-2 text-xs uppercase tracking-widest">Active Domain</p>
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent tracking-tight block">
            {selectedDomain}
          </h2>
        </BentoCard>

        {/* Progress Card */}
        <BentoCard className="p-7" accentColor="indigo">
          <div className="flex justify-between items-end mb-4">
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Progress</p>
            <span className="text-indigo-400 font-black text-2xl tracking-tighter drop-shadow-sm">
              {progress}%
            </span>
          </div>

          <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/[0.05] shadow-inner">
            <div
              className="bg-indigo-500 h-full rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </BentoCard>

        {/* Rank Card */}
        <BentoCard className="p-7" accentColor="indigo">
          <p className="text-zinc-400 font-bold mb-2 text-xs uppercase tracking-widest">Global Rank</p>
          <h2 className="text-3xl font-black bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent tracking-tighter drop-shadow-lg">
            {rank}
          </h2>
        </BentoCard>

      </div>

      {/* Welcome Modal Overlay */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
            {/* Decorative animated background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/30 rounded-full blur-[50px]"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(99,102,241,0.5)] text-white text-3xl">
                <FaStar />
              </div>

              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Welcome Aboard!</h2>
              <p className="text-zinc-400 mb-8">
                We've credited your account with <strong className="text-emerald-400 text-lg">50 Bonus XP</strong> to kickstart your learning journey. Check out your rank and choose a domain to start leveling up!
              </p>

              <button
                onClick={() => setShowWelcome(false)}
                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg active:scale-95 duration-200"
              >
                Let's Go!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
