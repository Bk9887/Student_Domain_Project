import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FaFire,
    FaBook,
    FaProjectDiagram,
    FaClock,
    FaStar,
    FaBrain,
    FaArrowRight,
    FaCalendarAlt,
    FaTrash
} from "react-icons/fa";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

const MyJourney = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([]);
    const [weeklyXPData, setWeeklyXPData] = useState([]);
    const [skills, setSkills] = useState([]);
    const [journeys, setJourneys] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            const [statsRes, journeysRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/journey/stats/${currentUser._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`http://localhost:5000/api/journey/my-journeys/${currentUser._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const { stats: apiStats, weeklyXPData: apiWeekly, skills: apiSkills } = statsRes.data;

            const iconMap = {
                "Current Streak": { icon: <FaFire />, color: "from-orange-500 to-red-500" },
                "Courses Completed": { icon: <FaBook />, color: "from-indigo-500 to-purple-500" },
                "Projects Built": { icon: <FaProjectDiagram />, color: "from-emerald-500 to-teal-500" },
                "Total Learning Time": { icon: <FaClock />, color: "from-blue-500 to-cyan-500" },
                "Total XP": { icon: <FaStar />, color: "from-amber-400 to-orange-500" },
                "Skills Built": { icon: <FaBrain />, color: "from-rose-500 to-pink-500" }
            };

            const formattedStats = apiStats.map(s => ({
                ...s,
                ...iconMap[s.title]
            }));

            setStats(formattedStats);
            setWeeklyXPData(apiWeekly);
            setSkills(apiSkills);
            setJourneys(journeysRes.data);
        } catch (err) {
            console.error("Journey Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?._id) fetchData();
    }, []);

    const handleContinueLearning = async (domainName) => {
        try {
            await axios.post(`http://localhost:5000/api/journey/start`,
                { userId: currentUser._id, domain: domainName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            localStorage.setItem("selectedDomain", domainName);
            const updatedUser = { ...currentUser, domain: domainName };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));

            navigate("/roadmap");
        } catch (err) {
            console.error("Error switching domain:", err);
        }
    };

    const handleDeleteJourney = async (domainName) => {
        if (!window.confirm(`Are you sure you want to delete your progress in ${domainName}? This cannot be undone.`)) return;

        try {
            const res = await axios.delete(`http://localhost:5000/api/journey/${currentUser._id}/${domainName}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // If the deleted domain was the active one, update local storage
            const currentSelected = localStorage.getItem("selectedDomain");
            if (currentSelected === domainName) {
                const newActive = res.data.activeDomain;
                localStorage.setItem("selectedDomain", newActive || "Not Selected");
                const updatedUser = { ...currentUser, domain: newActive };
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            }

            // Refresh data
            fetchData();
        } catch (err) {
            console.error("Error deleting journey:", err);
            alert("Failed to delete journey.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="text-white space-y-10 animate-in fade-in duration-700 pb-10">
            <div>
                <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                    My Journey 🚀
                </h1>
                <p className="text-zinc-500 font-medium mt-2">Track your evolution and learning milestones.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="group relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 shadow-2xl overflow-hidden"
                    >
                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}></div>

                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                                <span className="text-white text-xl">{stat.icon}</span>
                            </div>
                        </div>

                        <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none">
                            {stat.title}
                        </h2>

                        <p className="text-3xl font-black mt-2 text-white tracking-tighter">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Journeys */}
                <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                    <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                        Active Learning Paths <span className="text-indigo-400">🔥</span>
                    </h2>

                    <div className="space-y-4">
                        {journeys.length === 0 ? (
                            <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl">
                                <p className="text-zinc-500 font-bold text-sm tracking-widest uppercase">No journeys started yet.</p>
                            </div>
                        ) : (
                            journeys.map((journey, index) => (
                                <div key={index} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all group relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-black text-white">{journey.domain}</h3>
                                            <div className="flex items-center gap-2 mt-1 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                                                <FaCalendarAlt className="text-indigo-500" />
                                                Started {new Date(journey.startedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDeleteJourney(journey.domain)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all"
                                                title="Delete Journey"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                            <button
                                                onClick={() => handleContinueLearning(journey.domain)}
                                                className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white border border-indigo-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                            >
                                                Continue <FaArrowRight />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-zinc-500">Progress</span>
                                            <span className="text-indigo-400">{journey.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                                                style={{ width: `${journey.progress}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest pt-1">
                                            <span>{journey.completedSteps} / {journey.totalSteps} Steps</span>
                                            <span>{journey.points} XP EARNED</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Weekly XP Graph */}
                <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px]"></div>

                    <h2 className="text-xl font-black mb-8 flex items-center gap-2">
                        Weekly Experience <span className="text-indigo-400">📈</span>
                    </h2>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyXPData}>
                                <defs>
                                    <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="week"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#71717a', fontSize: 12, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    hide
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        fontSize: '12px'
                                    }}
                                    itemStyle={{ color: '#818cf8' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="xp"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorXP)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Skills Learned */}
            <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                    Mastered Paradigms <span className="text-emerald-400">🧠</span>
                </h2>

                <div className="flex flex-wrap gap-2">
                    {skills.length === 0 ? (
                        <div className="py-6 px-10 rounded-2xl bg-white/[0.02] border border-dashed border-white/5 text-center w-full">
                            <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs italic">
                                Your journey has just begun. No skills mastered yet.
                            </p>
                        </div>
                    ) : (
                        skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-5 py-2.5 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-xs font-black uppercase tracking-widest transition-all cursor-default hover:-translate-y-0.5"
                            >
                                {skill}
                            </span>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyJourney;
