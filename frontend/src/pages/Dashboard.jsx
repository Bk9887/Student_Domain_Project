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
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight text-gradient leading-tight">
        {isNewUser ? `Welcome, ${user.name}` : `Welcome back, ${user.name}. Ready to level up?`}
      </h1>

      {/* Choose Domain Button for new users */}
      {selectedDomain === "Not Selected" && (
        <button
          onClick={() => navigate("/domains")}
          className="btn-primary"
        >
          Choose a Domain
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Domain Card */}
        <BentoCard className="p-7" accentColor="indigo">
          <p className="text-sky-100/60 font-bold mb-2 text-xs uppercase tracking-widest">Active Domain</p>
          <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-200 to-emerald-200 bg-clip-text text-transparent tracking-tight block">
            {selectedDomain}
          </h2>
        </BentoCard>

        {/* Progress Card */}
        <BentoCard className="p-7" accentColor="indigo">
          <div className="flex justify-between items-end mb-4">
            <p className="text-sky-100/60 font-bold text-xs uppercase tracking-widest">Progress</p>
            <span className="text-emerald-200 font-black text-2xl tracking-tighter drop-shadow-sm">
              {progress}%
            </span>
          </div>

          <div className="w-full bg-[#091a34] rounded-full h-2.5 overflow-hidden border border-sky-100/10 shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-300 to-amber-300 h-full rounded-r-full shadow-[0_0_10px_rgba(47,185,169,0.5)] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </BentoCard>

        {/* Rank Card */}
        <BentoCard className="p-7" accentColor="amber">
          <p className="text-sky-100/60 font-bold mb-2 text-xs uppercase tracking-widest">Global Rank</p>
          <h2 className="text-3xl font-black bg-gradient-to-r from-amber-100 to-amber-300 bg-clip-text text-transparent tracking-tighter drop-shadow-lg">
            {rank}
          </h2>
        </BentoCard>

      </div>

      {/* Welcome Modal Overlay */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="panel-strong p-8 max-w-md w-full text-center relative overflow-hidden">
            {/* Decorative animated background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-300/30 rounded-full blur-[50px]"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-300 to-cyan-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(47,185,169,0.5)] text-[#08324a] text-3xl">
                <FaStar />
              </div>

              <h2 className="text-2xl font-black text-slate-100 mb-2 tracking-tight">Welcome Aboard!</h2>
              <p className="text-sky-100/70 mb-8">
                We've credited your account with <strong className="text-emerald-200 text-lg">50 Bonus XP</strong> to kickstart your learning journey. Check out your rank and choose a domain to start leveling up!
              </p>

              <button
                onClick={() => setShowWelcome(false)}
                className="w-full btn-primary"
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
