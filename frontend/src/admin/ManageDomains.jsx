import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave } from "react-icons/md";
import BentoCard from "../components/BentoCard";

export default function ManageDomains() {
    const navigate = useNavigate();
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        _id: "",
        name: "",
        description: "",
        skills: "",   // Handled as comma-separated string in UI for ease
        careers: "",  // Handled as comma-separated string in UI for ease
    });

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/domains");
            setDomains(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleOpenModal = (domain = null) => {
        if (domain) {
            setEditMode(true);
            setFormData({
                _id: domain._id,
                name: domain.name,
                description: domain.description,
                skills: domain.skills?.join(", ") || "",
                careers: domain.careers?.join(", ") || "",
            });
        } else {
            setEditMode(false);
            setFormData({ _id: "", name: "", description: "", skills: "", careers: "" });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ _id: "", name: "", description: "", skills: "", careers: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            // Parse CSV strings back to arrays
            const payload = {
                name: formData.name,
                description: formData.description,
                skills: formData.skills.split(",").map(item => item.trim()).filter(Boolean),
                careers: formData.careers.split(",").map(item => item.trim()).filter(Boolean),
            };

            if (editMode) {
                await axios.put(`http://localhost:5000/api/admin/domains/${formData._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post("http://localhost:5000/api/admin/domains", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            handleCloseModal();
            fetchDomains(); // Refresh grid
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save domain");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Domain? This cannot be undone.")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/admin/domains/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDomains();
        } catch (err) {
            alert("Failed to delete domain");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase italic underline decoration-indigo-500 decoration-4 underline-offset-8">Domain Portfolio</h2>
                    <p className="text-zinc-500 text-sm mt-4 font-bold tracking-widest uppercase">Engineer the future of learning paths</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center px-6 py-3.5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 text-xs uppercase tracking-widest active:scale-95"
                >
                    <MdAdd className="mr-2 text-xl" />
                    New Creation
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {domains.map((domain, idx) => {
                        const accents = ["indigo", "emerald", "amber", "rose", "cyan", "violet"];
                        const accent = accents[idx % accents.length];
                        return (
                            <BentoCard key={domain._id} className="flex flex-col group" accentColor={accent}>
                                <div className="p-7 flex-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors duration-300">{domain.name}</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(domain)}
                                                className="p-2 text-zinc-500 hover:text-white bg-white/[0.03] border border-white/[0.05] hover:border-indigo-500/50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <MdEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(domain._id)}
                                                className="p-2 text-zinc-500 hover:text-rose-400 bg-white/[0.03] border border-white/[0.05] hover:border-rose-500/50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-950/40 border border-white/[0.03] p-4 rounded-xl mb-6 relative overflow-hidden group/desc">
                                        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 italic relative z-10 transition-colors group-hover/desc:text-zinc-300">
                                            "{domain.description}"
                                        </p>
                                        <div className={`absolute top-0 right-0 w-16 h-16 bg-${accent}-500/5 blur-2xl rounded-full`}></div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Primary Skillset</span>
                                            <div className="flex flex-wrap gap-2">
                                                {domain.skills?.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-white/[0.02] text-zinc-300 border border-white/[0.05] rounded-lg text-[11px] font-bold group-hover:border-indigo-500/30 transition-colors">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {domain.skills?.length > 3 && (
                                                    <span className="px-3 py-1.5 bg-zinc-950 text-zinc-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                                        +{domain.skills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-7 py-5 bg-white/[0.01] border-t border-white/[0.05] flex items-center justify-between group-hover:bg-white/[0.03] transition-colors rounded-b-2xl">
                                    <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                                        {domain.roadmap?.length || 0} Nodes
                                    </span>
                                    <span
                                        onClick={() => navigate("/admin/manage-roadmaps")}
                                        className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:text-white cursor-pointer flex items-center gap-2 group/btn"
                                    >
                                        Configure <span className="transform group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                                    </span>
                                </div>
                            </BentoCard>
                        );
                    })}

                    {domains.length === 0 && (
                        <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-xl">
                            <MdSchool className="mx-auto text-4xl text-slate-300 mb-3" />
                            <h3 className="text-lg font-medium text-slate-700">No Domains Yet</h3>
                            <p className="text-slate-500 text-sm mt-1">Create your first learning domain to get started.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Futuristic Dark Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={handleCloseModal}></div>
                    <BentoCard className="relative w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10" accentColor="indigo">
                        <form onSubmit={handleSubmit} className="relative flex flex-col w-full">
                            {/* Header */}
                            <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.05] bg-white/[0.01]">
                                <h3 className="text-xl font-black text-white italic tracking-tight">
                                    <span className="text-indigo-500 mr-2">{editMode ? 'MODIFY' : 'INITIALIZE'}</span> DOMAIN
                                </h3>
                                <button type="button" onClick={handleCloseModal} className="text-zinc-500 hover:text-white transition-all transform hover:rotate-90">
                                    <MdClose className="text-2xl" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="relative p-8 space-y-6 h-auto max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Domain Designation</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-zinc-950 border border-white/[0.05] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-bold tracking-tight placeholder-zinc-700"
                                        placeholder="SYSTEM NAME..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Mission Overview</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-zinc-950 border border-white/[0.05] rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium leading-relaxed resize-none placeholder-zinc-700"
                                        placeholder="CORE OBJECTIVES..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Target Skillset <span className="text-zinc-700 font-bold ml-1">(CSV)</span></label>
                                        <textarea
                                            rows="4"
                                            value={formData.skills}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                            className="w-full bg-zinc-950 border border-white/[0.05] rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm font-bold resize-none custom-scrollbar placeholder-zinc-700 font-mono"
                                            placeholder="SKILL_01, SKILL_02..."
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Trajectory Paths <span className="text-zinc-700 font-bold ml-1">(CSV)</span></label>
                                        <textarea
                                            rows="4"
                                            value={formData.careers}
                                            onChange={(e) => setFormData({ ...formData, careers: e.target.value })}
                                            className="w-full bg-zinc-950 border border-white/[0.05] rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm font-bold resize-none custom-scrollbar placeholder-zinc-700 font-mono"
                                            placeholder="PATH_01, PATH_02..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end px-8 py-6 border-t border-white/[0.05] bg-white/[0.01] space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all border border-transparent hover:border-white/10 hover:bg-white/[0.02]"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                                >
                                    <MdSave className="mr-2 text-lg" />
                                    {editMode ? 'Deploy Update' : 'Initialize Domain'}
                                </button>
                            </div>
                        </form>
                    </BentoCard>
                </div>
            )}

        </div>
    );
}
