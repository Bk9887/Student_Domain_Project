import { useState, useEffect } from "react";
import axios from "axios";

const Roadmap = () => {
  const [topics, setTopics] = useState([]);
  const [domain, setDomain] = useState("Not Selected");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const selected = localStorage.getItem("selectedDomain") || "Not Selected";
    setDomain(selected);

    if (selected === "Not Selected") {
      setTopics([]);
      return;
    }

    axios
      .get(`http://localhost:5000/api/roadmap/${selected}`)
      .then((res) => {
        const formattedTopics = res.data.steps.map((step) => ({
          id: step._id,
          title: step.title,
          completed: false,
        }));

        const saved =
          JSON.parse(localStorage.getItem(`roadmapProgress_${selected}`)) || [];

        setTopics(saved.length ? saved : formattedTopics);
      })
      .catch((err) => {
        console.error("Roadmap fetch error:", err);
      });
  }, []);

  // 🔹 Update backend progress
  useEffect(() => {
    if (!user || domain === "Not Selected" || topics.length === 0) return;

    const completed = topics.filter((t) => t.completed).length;
    const progressPercent = Math.round((completed / topics.length) * 100);

    axios
      .post(
        `http://localhost:5000/api/dashboard/${user._id}`,
        {
          domain: domain,
          progress: progressPercent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        window.dispatchEvent(new Event("roadmapUpdated"));
      })
      .catch((err) => console.error("Progress update error:", err));

    localStorage.setItem(`roadmapProgress_${domain}`, JSON.stringify(topics));
  }, [topics]);

  const toggleComplete = (id) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const progress = topics.length
    ? Math.round((topics.filter((t) => t.completed).length / topics.length) * 100)
    : 0;

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
    <div className="space-y-6 text-white">
      <h1 className="text-3xl font-bold">{domain} Roadmap</h1>

      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <div className="flex justify-between mb-3">
          <span>Progress</span>
          <span className="text-indigo-300 font-semibold">{progress}%</span>
        </div>

        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className={`flex justify-between p-5 rounded-xl ${
              topic.completed
                ? "bg-green-500/10 border border-green-400/30"
                : "bg-white/5 border border-white/10"
            }`}
          >
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={topic.completed}
                onChange={() => toggleComplete(topic.id)}
                className="w-5 h-5 accent-indigo-600"
              />
              <span
                className={topic.completed ? "line-through text-gray-400" : ""}
              >
                {topic.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;