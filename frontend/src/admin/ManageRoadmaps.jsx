import { useState, useEffect } from "react";
import axios from "axios";
import { MdMap, MdEdit, MdSave, MdAdd, MdDelete, MdDragIndicator } from "react-icons/md";
import BentoCard from "../components/BentoCard";

export default function ManageRoadmaps() {
    const [domains, setDomains] = useState([]);
    const [activeDomain, setActiveDomain] = useState(null);
    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/domains");
            setDomains(res.data);
            if (res.data.length > 0) {
                selectDomain(res.data[0]);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const selectDomain = (domain) => {
        setActiveDomain(domain);
        // Deep clone the roadmap array to avoid direct state mutation issues when editing deep objects
        setRoadmap(JSON.parse(JSON.stringify(domain.roadmap || [])));
    };

    const handleAddStep = () => {
        const newStep = {
            title: "New Learning Step",
            description: "Describe what the student will learn in this phase.",
            duration: "1 Week",
            isEditing: true, // Custom UI state flag
            resources: [],
        };
        setRoadmap([...roadmap, newStep]);
    };

    const handleRemoveStep = (index) => {
        const updated = [...roadmap];
        updated.splice(index, 1);
        setRoadmap(updated);
    };

    const handleStepChange = (index, field, value) => {
        const updated = [...roadmap];
        updated[index][field] = value;
        setRoadmap(updated);
    };

    const toggleStepEdit = (index) => {
        const updated = [...roadmap];
        updated[index].isEditing = !updated[index].isEditing;
        setRoadmap(updated);
    };

    const saveRoadmap = async () => {
        if (!activeDomain) return;
        setSaving(true);

        try {
            const token = localStorage.getItem("token");

            // Clean out the UI-only `isEditing` flags before sending to Mongo
            const cleanRoadmap = roadmap.map(step => {
                const { isEditing, ...rest } = step;
                return rest;
            });

            await axios.put(
                `http://localhost:5000/api/admin/roadmaps/${activeDomain._id}`,
                { roadmap: cleanRoadmap },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local domain cache to reflect the save
            const updatedDomains = domains.map(d =>
                d._id === activeDomain._id ? { ...d, roadmap: cleanRoadmap } : d
            );
            setDomains(updatedDomains);

            alert("Roadmap saved successfully!");
        } catch (err) {
            alert("Failed to save roadmap data.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

            {/* Sidebar: Domain Selector */}
            <div className="w-full lg:w-80 flex-shrink-0">
                <BentoCard className="sticky top-24 overflow-hidden" accentColor="indigo">
                    <div className="px-6 py-5 border-b border-white/[0.05] bg-white/[0.01]">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Select Sector</h3>
                    </div>
                    <div className="divide-y divide-white/[0.02] max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {domains.map(domain => (
                            <button
                                key={domain._id}
                                onClick={() => selectDomain(domain)}
                                className={`w-full text-left px-6 py-4 text-sm transition-all relative group ${activeDomain?._id === domain._id
                                    ? "bg-indigo-600/10 text-indigo-400 font-black italic"
                                    : "text-zinc-500 font-bold hover:bg-white/[0.02] hover:text-zinc-300"
                                    }`}
                            >
                                {activeDomain?._id === domain._id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_#6366f1]"></div>
                                )}
                                <span className="relative z-10">{domain.name}</span>
                                <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-zinc-700 text-[10px]">&rarr;</span>
                                </div>
                            </button>
                        ))}
                        {domains.length === 0 && (
                            <div className="p-8 text-xs text-zinc-600 text-center font-bold italic">No data found in core...</div>
                        )}
                    </div>
                </BentoCard>
            </div>

            {/* Main Content: Roadmap Editor */}
            <div className="flex-1">
                {activeDomain ? (
                    <BentoCard className="overflow-hidden min-h-[600px] flex flex-col" accentColor="cyan">
                        {/* Header */}
                        <div className="px-8 py-7 border-b border-white/[0.05] bg-white/[0.01] flex justify-between items-end z-10 sticky top-0 backdrop-blur-md">
                            <div>
                                <h1 className="text-3xl font-black text-white italic tracking-tighter flex items-center">
                                    <MdMap className="text-cyan-500 mr-3 drop-shadow-[0_0_8px_#22d3ee]" />
                                    {activeDomain.name.toUpperCase()} <span className="text-zinc-700 ml-3 not-italic text-sm tracking-widest font-black">STREAMS</span>
                                </h1>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Architecting learning trajectories</p>
                            </div>

                            <button
                                onClick={saveRoadmap}
                                disabled={saving}
                                className="flex items-center px-8 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 active:scale-95"
                            >
                                <MdSave className="mr-2 text-lg" />
                                {saving ? "Updating..." : "Deploy Roadmap"}
                            </button>
                        </div>

                        {/* Editor Canvas */}
                        <div className="p-10 bg-black/[0.1] flex-1">
                            <div className="max-w-3xl mx-auto space-y-6 relative">

                                {/* Visual Timeline Line */}
                                <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-indigo-500/50 via-cyan-500/50 to-indigo-500/50 z-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]"></div>

                                {roadmap.map((step, index) => (
                                    <div key={index} className="relative z-10 flex gap-6">
                                        {/* Step Number Dot */}
                                        <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)] flex items-center justify-center text-indigo-400 font-black text-lg flex-shrink-0 mt-2 relative overflow-hidden group/dot">
                                            <div className="absolute inset-0 bg-indigo-500/5 group-hover/dot:bg-indigo-500/10 transition-colors"></div>
                                            <span className="relative z-10">{index + 1}</span>
                                        </div>

                                        {/* Step Card */}
                                        <div className="flex-1 bg-zinc-950/50 border border-white/[0.05] rounded-2xl shadow-xl overflow-hidden transition-all hover:border-indigo-500/30 group/step">
                                            {step.isEditing ? (
                                                <div className="p-6 space-y-6">
                                                    <input
                                                        type="text"
                                                        value={step.title}
                                                        onChange={(e) => handleStepChange(index, "title", e.target.value)}
                                                        className="w-full text-xl font-black text-white bg-transparent border-b border-white/[0.05] pb-3 focus:outline-none focus:border-indigo-500 placeholder-zinc-700 tracking-tight"
                                                        placeholder="Step Title..."
                                                    />
                                                    <textarea
                                                        value={step.description}
                                                        onChange={(e) => handleStepChange(index, "description", e.target.value)}
                                                        rows="3"
                                                        className="w-full text-sm text-zinc-400 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 focus:outline-none focus:border-indigo-500 resize-none font-medium leading-relaxed"
                                                        placeholder="Topic coordinates..."
                                                    />
                                                    <div className="flex items-center justify-between pt-2">
                                                        <div className="flex items-center space-x-3 w-1/2">
                                                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Duration</span>
                                                            <input
                                                                type="text"
                                                                value={step.duration}
                                                                onChange={(e) => handleStepChange(index, "duration", e.target.value)}
                                                                className="w-full text-sm font-bold text-zinc-300 bg-transparent border-b border-white/[0.05] focus:outline-none focus:border-indigo-500 pb-1"
                                                                placeholder="e.g. 2 Weeks"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => toggleStepEdit(index)}
                                                            className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-white bg-indigo-500/5 px-5 py-2.5 rounded-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all"
                                                        >
                                                            Commit
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h4 className="text-xl font-black text-white tracking-tight group-hover/step:text-indigo-400 transition-colors">{step.title}</h4>
                                                        <div className="flex space-x-2 opacity-0 group-hover/step:opacity-100 transition-all translate-x-4 group-hover/step:translate-x-0">
                                                            <button onClick={() => toggleStepEdit(index)} className="p-2.5 text-zinc-500 hover:text-white bg-white/[0.03] border border-white/[0.05] rounded-xl hover:border-indigo-500/40 transition-all">
                                                                <MdEdit />
                                                            </button>
                                                            <button onClick={() => handleRemoveStep(index)} className="p-2.5 text-zinc-500 hover:text-rose-400 bg-white/[0.03] border border-white/[0.05] rounded-xl hover:border-rose-500/40 transition-all">
                                                                <MdDelete />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed font-medium italic">"{step.description}"</p>
                                                    <div className="flex items-center">
                                                        <div className="text-[10px] font-black text-cyan-400 bg-cyan-400/5 px-3 py-1.5 rounded-lg border border-cyan-400/10 uppercase tracking-widest">
                                                            Timeline: {step.duration || "UNDEFINED"}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Add Step Action */}
                                <div className="relative z-10 flex gap-6 pt-4">
                                    <div className="h-12 w-12 rounded-2xl border-2 border-dashed border-zinc-800 flex items-center justify-center flex-shrink-0 mt-2 bg-zinc-950/30">
                                        <MdAdd className="text-zinc-700 text-xl" />
                                    </div>
                                    <button
                                        onClick={handleAddStep}
                                        className="flex-1 border-2 border-dashed border-white/[0.05] rounded-2xl h-16 flex items-center justify-center text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all active:scale-[0.99]"
                                    >
                                        Inject New Learning Node
                                    </button>
                                </div>
                            </div>
                        </div>
                    </BentoCard>
                ) : (
                    <BentoCard className="h-[600px] flex flex-col items-center justify-center bg-black/[0.05]" accentColor="zinc">
                        <MdMap className="text-6xl text-zinc-800 mb-6 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
                        <h3 className="text-xl font-black text-white italic tracking-tight uppercase">No Sector Selected</h3>
                        <p className="text-zinc-600 mt-4 font-bold tracking-widest text-[10px] uppercase">Initialize a dataset from the sidebar to begin architecture</p>
                    </BentoCard>
                )}
            </div>
        </div>
    );
}
