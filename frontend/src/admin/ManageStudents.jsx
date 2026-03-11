import { useState, useEffect } from "react";
import axios from "axios";
import { MdSearch, MdDelete, MdWarning } from "react-icons/md";
import BentoCard from "../components/BentoCard";

export default function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/admin/users/${userToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Remove from UI
            setStudents(students.filter(s => s._id !== userToDelete._id));
            setShowModal(false);
            setUserToDelete(null);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete user");
            setShowModal(false);
        }
    };

    // Filter students based on search
    const filteredStudents = students.filter(student => {
        const term = searchTerm.toLowerCase();
        return (
            student.name.toLowerCase().includes(term) ||
            student.email.toLowerCase().includes(term) ||
            (student.domain && student.domain.toLowerCase().includes(term))
        );
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase italic underline decoration-indigo-500 decoration-4 underline-offset-8">Student Directory</h2>
                    <p className="text-zinc-500 text-sm mt-4 font-bold tracking-widest uppercase">Monitor and manage the next generation</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400">
                        <MdSearch className="text-zinc-500 text-xl" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-3 bg-zinc-950 border border-white/[0.05] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-bold tracking-tight shadow-inner"
                        placeholder="SEARCH OPERATIVES..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Data Table Container */}
            <BentoCard className="overflow-hidden" accentColor="indigo">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/[0.05] text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-8 py-5">Intel / Identity</th>
                                <th className="px-8 py-5">Active Sector</th>
                                <th className="px-8 py-5 hidden md:table-cell text-center">Efficiency (XP)</th>
                                <th className="px-8 py-5 hidden lg:table-cell text-center">Clearance</th>
                                <th className="px-8 py-5 text-right pr-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-11 w-11 flex-shrink-0 bg-indigo-600/10 text-indigo-400 rounded-xl flex items-center justify-center font-black text-sm border border-indigo-500/20 group-hover:bg-indigo-600/20 transition-all duration-300">
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-black text-white tracking-tight">{student.name}</div>
                                                    <div className="text-xs text-zinc-500 font-medium tracking-wide mt-0.5">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className={`px-3 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-lg border ${student.domain && student.domain !== "Not Selected" ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' : 'bg-zinc-800/10 text-zinc-500 border-zinc-800'}`}>
                                                {student.domain && student.domain !== "Not Selected" ? student.domain : "UNASSIGNED"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap hidden md:table-cell text-center">
                                            <div className="text-sm text-white font-black">{student.points || 0} <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">XP</span></div>
                                            <div className="text-[10px] text-amber-500 font-black uppercase tracking-widest mt-1">Streak {student.streak || 0}</div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-xs font-black uppercase tracking-widest hidden lg:table-cell text-center">
                                            {student.isAdmin ? (
                                                <span className="text-rose-500 flex items-center justify-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></div> Root</span>
                                            ) : <span className="text-zinc-400">Operative</span>}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right pr-10">
                                            {!student.isAdmin && (
                                                <button
                                                    onClick={() => handleDeleteClick(student)}
                                                    className="text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 p-2.5 rounded-xl border border-transparent hover:border-rose-500/20 transition-all active:scale-90"
                                                    title="Decommission Account"
                                                >
                                                    <MdDelete className="text-xl" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-zinc-600 font-black uppercase tracking-[0.2em] italic">
                                        No operatives located in the database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </BentoCard>

            {/* Futuristic Dark Delete Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setShowModal(false)}></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md z-[70]">
                        <BentoCard className="overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.15)]" accentColor="rose">
                            <div className="bg-rose-500/5 px-8 py-6 border-b border-white/[0.05] flex items-center">
                                <MdWarning className="text-rose-500 text-2xl mr-4 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                <h3 className="text-lg font-black text-white italic tracking-tight uppercase">Confirm Decommission</h3>
                            </div>
                            <div className="relative p-8 space-y-4">
                                <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                                    Permanent erasure sequence initiated for <strong className="text-white font-black tracking-tight">{userToDelete?.name}</strong>.
                                </p>
                                <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/[0.03] space-y-2">
                                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest leading-relaxed">
                                        <span className="text-rose-500 mr-2">!</span> All domain progress, XP reserves, and streaks will be wiped from the data core.
                                    </p>
                                </div>
                                <p className="text-zinc-400 text-xs font-bold leading-relaxed text-center pt-2 italic">
                                    This operation is irreversible. Proceed?
                                </p>
                            </div>
                            <div className="flex items-center justify-end px-8 py-6 border-t border-white/[0.05] bg-white/[0.01] space-x-4">
                                <button
                                    className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                >
                                    Abort
                                </button>
                                <button
                                    className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                                    type="button"
                                    onClick={confirmDelete}
                                >
                                    Decommission
                                </button>
                            </div>
                        </BentoCard>
                    </div>
                </div>
            )}

        </div>
    );
}
