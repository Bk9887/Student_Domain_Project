import { useState, useEffect } from "react";
import axios from "axios";
import { MdMap, MdEdit, MdSave, MdAdd, MdDelete, MdChevronRight, MdChevronLeft, MdLock, MdPlayCircle, MdQuiz } from "react-icons/md";
import BentoCard from "../components/BentoCard";

export default function ManageRoadmaps() {
    const [domains, setDomains] = useState([]);
    const [activeDomain, setActiveDomain] = useState(null);
    const [tiers, setTiers] = useState([
        { name: "beginner", modules: [] },
        { name: "intermediate", modules: [] },
        { name: "advanced", modules: [] }
    ]);
    const [activeTier, setActiveTier] = useState("beginner");
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

    const selectDomain = async (domain) => {
        setActiveDomain(domain);
        try {
            const res = await axios.get(`http://localhost:5000/api/roadmap/${domain.name}/videos`);
            if (res.data && res.data.tiers) {
                setTiers(res.data.tiers);
            } else {
                setTiers([
                    { name: "beginner", modules: [] },
                    { name: "intermediate", modules: [] },
                    { name: "advanced", modules: [] }
                ]);
            }
        } catch (err) {
            setTiers([
                { name: "beginner", modules: [] },
                { name: "intermediate", modules: [] },
                { name: "advanced", modules: [] }
            ]);
        }
    };

    const handleAddModule = () => {
        const updated = [...tiers];
        const tierIdx = updated.findIndex(t => t.name === activeTier);
        const newModule = {
            id: `module_${Date.now()}`,
            title: "New Module",
            description: "Module description",
            steps: []
        };
        updated[tierIdx].modules.push(newModule);
        setTiers(updated);
    };

    const handleAddStep = (moduleIdx) => {
        const updated = [...tiers];
        const tierIdx = updated.findIndex(t => t.name === activeTier);
        const newStep = {
            id: `step_${Date.now()}`,
            title: "New Step",
            description: "Step description",
            type: "video",
            xp: 50,
            videoId: ""
        };
        updated[tierIdx].modules[moduleIdx].steps.push(newStep);
        setTiers(updated);
    };

    const handleStepChange = (moduleIdx, stepIdx, field, value) => {
        const updated = [...tiers];
        const tierIdx = updated.findIndex(t => t.name === activeTier);
        updated[tierIdx].modules[moduleIdx].steps[stepIdx][field] = value;
        setTiers(updated);
    };

    const handleModuleChange = (moduleIdx, field, value) => {
        const updated = [...tiers];
        const tierIdx = updated.findIndex(t => t.name === activeTier);
        updated[tierIdx].modules[moduleIdx][field] = value;
        setTiers(updated);
    };

    const saveRoadmap = async () => {
        if (!activeDomain) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/admin/roadmaps/${activeDomain._id}`,
                { tiers },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Roadmap deployed successfully!");
        } catch (err) {
            alert("Failed to save roadmap.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
                <BentoCard className="sticky top-24" accentColor="indigo">
                    <div className="px-6 py-5 border-b border-white/[0.05]">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Select Domain</h3>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto">
                        {domains.map(d => (
                            <button key={d._id} onClick={() => selectDomain(d)} className={`w-full text-left px-6 py-4 text-sm transition-all border-l-4 ${activeDomain?._id === d._id ? "bg-indigo-600/10 border-indigo-500 text-indigo-400 font-bold" : "border-transparent text-zinc-500 hover:bg-white/[0.02]"}`}>
                                {d.name}
                            </button>
                        ))}
                    </div>
                </BentoCard>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
                {activeDomain ? (
                    <>
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">{activeDomain.name} Roadmap</h1>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Configure learning tiers</p>
                            </div>
                            <button onClick={saveRoadmap} disabled={saving} className="px-8 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                                {saving ? "Deploying..." : "Deploy Changes"}
                            </button>
                        </div>

                        {/* Tier Tabs */}
                        <div className="flex gap-4">
                            {["beginner", "intermediate", "advanced"].map(t => (
                                <button key={t} onClick={() => setActiveTier(t)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTier === t ? "bg-white text-black" : "bg-white/[0.05] text-zinc-500 hover:text-white"}`}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Tier Content */}
                        <div className="space-y-6">
                            {tiers.find(t => t.name === activeTier)?.modules.map((mod, modIdx) => (
                                <BentoCard key={mod.id} className="p-6 space-y-4" accentColor="cyan">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 space-y-2">
                                            <input value={mod.title} onChange={e => handleModuleChange(modIdx, 'title', e.target.value)} className="bg-transparent text-xl font-black text-white border-b border-white/10 w-full focus:outline-none focus:border-indigo-500" />
                                            <input value={mod.description} onChange={e => handleModuleChange(modIdx, 'description', e.target.value)} className="bg-transparent text-sm text-zinc-500 w-full focus:outline-none" />
                                        </div>
                                        <button onClick={() => {
                                            const updated = [...tiers];
                                            const tierIdx = updated.findIndex(t => t.name === activeTier);
                                            updated[tierIdx].modules.splice(modIdx, 1);
                                            setTiers(updated);
                                        }} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"><MdDelete /></button>
                                    </div>

                                    <div className="space-y-3">
                                        {mod.steps.map((step, stepIdx) => (
                                            <div key={step.id} className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-4">
                                                <div className="flex gap-4">
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex gap-3">
                                                            <select value={step.type} onChange={e => handleStepChange(modIdx, stepIdx, 'type', e.target.value)} className="bg-zinc-900 text-xs text-white border border-white/10 rounded-lg px-2 py-1 outline-none">
                                                                <option value="video">Video</option>
                                                                <option value="test">Test</option>
                                                            </select>
                                                            <input value={step.title} onChange={e => handleStepChange(modIdx, stepIdx, 'title', e.target.value)} className="flex-1 bg-transparent text-sm font-bold text-white border-b border-white/10 outline-none" placeholder="Step Title" />
                                                        </div>
                                                        {step.type === "video" && (
                                                            <input value={step.videoId} onChange={e => handleStepChange(modIdx, stepIdx, 'videoId', e.target.value)} className="w-full bg-zinc-900/50 text-xs text-indigo-400 border border-white/5 rounded-lg px-3 py-2 outline-none font-mono" placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" />
                                                        )}
                                                    </div>
                                                    <button onClick={() => {
                                                        const updated = [...tiers];
                                                        const tierIdx = updated.findIndex(t => t.name === activeTier);
                                                        updated[tierIdx].modules[modIdx].steps.splice(stepIdx, 1);
                                                        setTiers(updated);
                                                    }} className="text-zinc-600 hover:text-rose-500"><MdDelete /></button>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => handleAddStep(modIdx)} className="w-full py-3 border-2 border-dashed border-white/5 rounded-xl text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:border-indigo-500/30 hover:text-indigo-400 transition-all flex items-center justify-center gap-2">
                                            <MdAdd /> Add Step
                                        </button>
                                    </div>
                                </BentoCard>
                            ))}
                            <button onClick={handleAddModule} className="w-full py-6 border-2 border-dashed border-indigo-500/20 rounded-2xl text-indigo-500/50 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/5 hover:text-indigo-500 transition-all flex items-center justify-center gap-2 italic">
                                <MdAdd className="text-xl" /> Inject New Module into {activeTier} Tier
                            </button>
                        </div>
                    </>
                ) : (
                    <BentoCard className="h-[600px] flex flex-col items-center justify-center bg-black/10" accentColor="zinc">
                        <MdMap className="text-6xl text-zinc-800 mb-6" />
                        <h3 className="text-xl font-black text-white italic uppercase">No Sector Selected</h3>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-2">Pick a domain from the sidebar to start architecting</p>
                    </BentoCard>
                )}
            </div>
        </div>
    );
}
