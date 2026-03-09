import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState("Not Selected");
  const [progress, setProgress] = useState(0);
  const [rank, setRank] = useState("—");
  const [isNewUser, setIsNewUser] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/dashboard/${currentUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSelectedDomain(res.data.selectedDomain);
      setProgress(res.data.progress);
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
      <h1 className="text-3xl font-bold mb-2 text-white">
        {isNewUser ? `Welcome, ${user.name}` : `Welcome back, ${user.name}`}
      </h1>

      {/* Choose Domain Button for new users */}
      {isNewUser && (
        <button
          onClick={() => navigate("/domains")}
          className="px-6 py-3 rounded-xl font-semibold text-white
          bg-gradient-to-r from-indigo-600 to-purple-600
          hover:from-indigo-700 hover:to-purple-700 transition"
        >
          Choose a Domain
        </button>
      )}

      <div className="grid md:grid-cols-3 gap-6">

        {/* Domain Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <p className="text-white/70 mb-2">Selected Domain</p>
          <h2 className="text-2xl font-semibold text-white">
            {selectedDomain}
          </h2>
        </div>

        {/* Progress Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between mb-3">
            <p className="text-white/70">Progress</p>
            <span className="text-indigo-300 font-semibold">
              {progress}%
            </span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Rank Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <p className="text-white/70 mb-2">Leaderboard Rank</p>
          <h2 className="text-2xl font-semibold text-white">
            {rank}
          </h2>
        </div>

      </div>
    </div>
  );
}
