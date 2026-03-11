import { useState, useEffect } from "react";
import axios from "axios";
import { MdTrendingUp, MdPeople, MdSchool, MdLeaderboard } from "react-icons/md";
import BentoCard from "../components/BentoCard";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/admin/stats", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Bootstrap style KPI Cards
    const kpiCards = [
        { title: "Total Students", value: stats?.totalUsers || 0, icon: <MdPeople />, color: "bg-blue-500" },
        { title: "Active Learners", value: stats?.activeLearners || 0, icon: <MdTrendingUp />, color: "bg-emerald-500" },
        { title: "Total XP Mined", value: stats?.totalPoints || 0, icon: <MdLeaderboard />, color: "bg-amber-500" },
        { title: "Domains Active", value: Object.keys(stats?.domainDistribution || {}).length, icon: <MdSchool />, color: "bg-purple-500" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase italic underline decoration-indigo-500 decoration-4 underline-offset-8">System Overview</h2>
                    <p className="text-zinc-500 text-sm mt-4 font-bold tracking-widest uppercase">Real-time metrics from the matrix</p>
                </div>
                <button className="px-6 py-3 bg-white/[0.03] text-zinc-300 font-bold rounded-xl hover:bg-white/[0.05] transition-all border border-white/[0.08] shadow-lg text-xs uppercase tracking-widest active:scale-95">
                    Generate Report
                </button>
            </div>

            {/* KPI Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 ml:grid-cols-4 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, idx) => {
                    const accents = ["indigo", "emerald", "amber", "rose"];
                    return (
                        <BentoCard key={idx} className="p-7 flex items-center group" accentColor={accents[idx % accents.length]}>
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg transition-transform group-hover:scale-110 duration-500 ${card.color.replace('bg-', 'bg-opacity-20 text-').replace('text-', 'bg-')}`}>
                                {card.icon}
                            </div>
                            <div className="ml-5">
                                <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">{card.title}</p>
                                <h3 className="text-3xl font-black text-white tracking-tighter">{card.value}</h3>
                            </div>
                        </BentoCard>
                    );
                })}
            </div>

            {/* Distribution Panel */}
            <BentoCard className="mt-8 overflow-hidden" accentColor="cyan">
                <div className="px-8 py-6 border-b border-white/[0.05] bg-white/[0.01] flex justify-between items-center">
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Domain Adoption Rates</h3>
                    <div className="h-2 w-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
                </div>
                <div className="p-8">
                    <div className="space-y-8">
                        {Object.entries(stats?.domainDistribution || {}).map(([domain, count], index) => {
                            const percentage = Math.round((count / (stats?.activeLearners || 1)) * 100);
                            return (
                                <div key={index} className="w-full">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-sm font-bold text-zinc-100 tracking-tight">{domain}</span>
                                        <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{count} Users ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-white/[0.03] rounded-full h-3 border border-white/[0.05] shadow-inner overflow-hidden">
                                        <div
                                            className="bg-indigo-500 h-full rounded-full shadow-[0_0_15px_#6366f1] transition-all duration-1000 ease-out"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}

                        {Object.keys(stats?.domainDistribution || {}).length === 0 && (
                            <p className="text-zinc-500 text-sm text-center py-8 font-medium italic underline decoration-zinc-800">No domain data logged yet from the simulation.</p>
                        )}
                    </div>
                </div>
            </BentoCard>
        </div>
    );
}
