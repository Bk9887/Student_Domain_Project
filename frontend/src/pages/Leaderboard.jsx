import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const token = localStorage.getItem("token");

  const fetchLeaderboard = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const selectedDomain = localStorage.getItem("selectedDomain");

      if (!currentUser || !selectedDomain) return;

      const res = await axios.get(
        `http://localhost:5000/api/leaderboard?domain=${selectedDomain}`,
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

      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <table className="w-full text-left">
          <thead>
            <tr className="text-white/70 border-b border-white/10">
              <th className="pb-3">Rank</th>
              <th className="pb-3">Name</th>
              <th className="pb-3">Domain</th>
              <th className="pb-3">Progress</th>
              <th className="pb-3">Points</th>
            </tr>
          </thead>

          <tbody>
            {leaderboardData.map((user, index) => (
              <tr
                key={user._id}
                className="border-b border-white/10 hover:bg-white/5 transition"
              >
                <td className="py-3 font-semibold text-lg">
                  {getBadge(index)}
                </td>

                <td>{user.name}</td>

                <td className="text-sm text-white/70">{user.domain}</td>

                <td>{user.progress}%</td>

                <td className="font-semibold text-indigo-400">
                  {user.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;