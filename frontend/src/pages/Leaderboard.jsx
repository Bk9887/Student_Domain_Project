import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import BentoCard from "../components/BentoCard";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const token = localStorage.getItem("token");

  const fetchLeaderboard = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const selectedDomain = localStorage.getItem("selectedDomain") || currentUser?.domain;

      if (!currentUser || !selectedDomain || selectedDomain === "Not Selected") return;

      const res = await axios.get(
        `${API_BASE_URL}/leaderboard?domain=${encodeURIComponent(selectedDomain)}&t=${Date.now()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sorted = res.data;
      setLeaderboardData(sorted);

      // 🎉 Show confetti when reaching 100%
      const me = sorted.find((u) => u._id === currentUser._id);

      if (me && me.progress === 100) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    } catch (err) {
      console.error("Leaderboard error:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    window.addEventListener("roadmapUpdated", fetchLeaderboard);

    return () =>
      window.removeEventListener("roadmapUpdated", fetchLeaderboard);
  }, []);

  const getBadge = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="text-white relative">
      {showConfetti && (
        <Confetti numberOfPieces={250} recycle={false} gravity={0.3} />
      )}

      <h1 className="text-4xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-zinc-400 bg-clip-text text-transparent drop-shadow-sm">Domain Leaders</h1>

      <BentoCard className="p-0 overflow-hidden" accentColor="indigo">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="text-zinc-400 border-b border-white/[0.08] text-sm uppercase tracking-wider">
                <th className="pb-4 font-medium">Rank</th>
                <th className="pb-4 font-medium">Name</th>
                <th className="pb-4 font-medium">Domain</th>
                <th className="pb-4 font-medium">Progress</th>
                <th className="pb-4 font-medium text-right pr-4">Points</th>
              </tr>
            </thead>

            <tbody>
              {leaderboardData.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="py-4 px-2 font-semibold text-xl text-white">
                    {getBadge(index)}
                  </td>

                  <td className="py-4 font-medium text-zinc-100 group-hover:text-white transition-colors">
                    {user.name}
                  </td>

                  <td className="py-4 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {user.domain}
                  </td>

                  <td className="py-4 font-medium text-indigo-400">
                    {user.progress}%
                  </td>

                  <td className="py-4 font-semibold text-zinc-100 text-right pr-4">
                    {user.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BentoCard>
    </div>
  );
};

export default Leaderboard;