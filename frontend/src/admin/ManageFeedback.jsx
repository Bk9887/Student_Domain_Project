import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";
import axios from "axios";
import { MdCheckCircle, MdInfoOutline, MdSync, MdEmail, MdCategory } from "react-icons/md";
import BentoCard from "../components/BentoCard";

export default function ManageFeedback() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // 'all', 'open', 'resolved'

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/admin/feedback`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedback(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const markResolved = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_BASE_URL}/admin/feedback/${id}/resolve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Instant UI update
            setFeedback(feedback.map(item => item._id === id ? { ...item, isResolved: true } : item));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const filteredTickets = feedback.filter(ticket => {
        if (filter === "open") return !ticket.isResolved;
        if (filter === "resolved") return ticket.isResolved;
        return true;
    });

    const openTicketsCount = feedback.filter(t => !t.isResolved).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">

            {/* Header & Stats Widget */}
            <BentoCard className="overflow-hidden p-0" accentColor="indigo">
                <div className="bg-gradient-to-r from-indigo-950/40 via-zinc-950 to-indigo-950/40 p-6 md:p-10 border-b border-white/[0.05] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-500/[0.02] mix-blend-overlay"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6 md:gap-8">
                        <div>
                            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase underline decoration-indigo-500 decoration-4 underline-offset-8 transition-colors">Support Intel</h1>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-6">Review student transmissions and resolve anomalies.</p>
                        </div>
                        <div className="flex items-center space-x-10">
                            <div className="text-right">
                                <span className="block text-4xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">{openTicketsCount}</span>
                                <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-2">Active Signals</span>
                            </div>
                            <div className="h-12 w-px bg-white/[0.05]"></div>
                            <div className="text-right">
                                <span className="block text-4xl font-black text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{feedback.length}</span>
                                <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-2">Total Logged</span>
                            </div>
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* Filter Tabs */}
            <div className="flex space-x-8 border-b border-white/[0.05] relative px-2 mb-8">
                <button
                    onClick={() => setFilter("all")}
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${filter === 'all' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    All Signals
                    {filter === 'all' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_10px_#6366f1]"></div>}
                </button>
                <button
                    onClick={() => setFilter("open")}
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${filter === 'open' ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    Unresolved
                    {filter === 'open' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div>}
                </button>
                <button
                    onClick={() => setFilter("resolved")}
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${filter === 'resolved' ? 'text-emerald-500' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    Resolved
                    {filter === 'resolved' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>}
                </button>
            </div>

            {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                    <div
                        key={ticket._id}
                        className={`bg-white/[0.02] border rounded-2xl p-6 md:p-8 mb-6 transition-all group ${ticket.isResolved
                            ? 'border-white/[0.03] opacity-60'
                            : 'border-amber-500/20 shadow-[0_4px_25px_rgba(245,158,11,0.05)] bg-amber-500/[0.01]'}`}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6 mb-6 md:mb-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-black text-white tracking-tight italic uppercase transition-colors">{ticket.name}</h3>
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${ticket.category === 'bug' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                        ticket.category === 'feature' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                                            'bg-zinc-800/20 text-zinc-500 border-white/[0.05]'
                                        }`}>
                                        {ticket.category}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-indigo-400 hover:text-white transition-colors">
                                    <MdEmail className="text-sm opacity-50" />
                                    <a href={`mailto:${ticket.email}`} className="text-xs font-bold tracking-tight">{ticket.email}</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest transition-colors">
                                    DATA RECORDED: {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                                {ticket.isResolved ? (
                                    <div className="flex items-center px-4 py-2 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-500/10">
                                        <MdCheckCircle className="mr-2 text-sm" /> Resolution Active
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => markResolved(ticket._id)}
                                        className="flex items-center px-6 py-2.5 bg-zinc-950 hover:bg-white text-zinc-300 hover:text-black text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/[0.05] transition-all shadow-lg active:scale-95"
                                    >
                                        <MdSync className="mr-2 text-sm animate-spin-slow" /> Resolve Signal
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="bg-black/[0.2] p-6 rounded-2xl border border-white/[0.03] text-zinc-400 text-sm leading-relaxed font-medium relative group-hover:border-white/[0.08] transition-colors whitespace-pre-wrap">
                            "{ticket.message}"
                            <div className="absolute -top-3 -left-3 text-white/[0.03] text-5xl font-black italic select-none">"</div>
                        </div>
                    </div>
                ))
            ) : (
                <BentoCard className="py-24 text-center" accentColor="zinc">
                    <MdInfoOutline className="mx-auto text-6xl text-zinc-800 mb-6 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
                    <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Signals Clear</h3>
                    <p className="text-zinc-600 mt-4 font-bold tracking-widest text-[10px] uppercase">No transmissions found in current frequency. Systems optimal.</p>
                </BentoCard>
            )}

        </div>
    );
}
