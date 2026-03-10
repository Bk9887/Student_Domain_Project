import { useState } from "react";
import { FaTrashAlt, FaPlus, FaTimes } from "react-icons/fa";

export default function PortfolioGenerator() {
    const [bio, setBio] = useState(
        "Hi, I'm abcd. A passionate web developer building modern applications."
    );

    const [skills, setSkills] = useState(["HTML", "CSS", "JavaScript", "React", "Node.js", "TypeScript"]);
    const [newSkill, setNewSkill] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Portfolio Generator
                </h1>
                <button
                    onClick={() => setShowPreview(true)}
                    className="px-5 py-2.5 rounded-xl font-medium bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 text-white"
                >
                    Preview
                </button>
            </div>

            {/* Main Container */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-7">

                {/* Bio Section */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-zinc-400 mb-3">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
                    />
                </div>

                {/* Skills Section */}
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-4">Skills</label>

                    <div className="flex flex-wrap gap-3 mb-6">
                        {skills.map((skill) => (
                            <div
                                key={skill}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 hover:bg-blue-500/20 transition-colors cursor-pointer group"
                                onClick={() => removeSkill(skill)}
                                title="Click to remove"
                            >
                                <span>{skill}</span>
                                <FaTrashAlt size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddSkill} className="flex gap-3 max-w-sm">
                        <input
                            type="text"
                            placeholder="Add a skill..."
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-colors text-white"
                        >
                            <FaPlus />
                        </button>
                    </form>
                </div>

            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 bg-[#0f111a] flex flex-col items-center overflow-y-auto w-full h-full">
                    <div className="w-full py-6 px-8 flex justify-between items-center bg-[#0f111a] sticky top-0 z-10 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Portfolio Generator</h2>
                        </div>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="px-5 py-2.5 rounded-xl font-medium bg-blue-500 hover:bg-blue-600 transition-colors text-white shadow-lg shadow-blue-500/20"
                        >
                            Edit
                        </button>
                    </div>

                    <div className="w-full max-w-4xl mt-8 mb-20">
                        <div className="bg-[#1a1b26] rounded-2xl p-0 text-zinc-300 border border-white/5 mx-4 overflow-hidden">

                            <div className="p-10 flex items-center gap-6 border-b border-white/5">
                                <div className="w-24 h-24 rounded-full bg-blue-900/40 text-blue-400 flex items-center justify-center text-4xl font-black uppercase">
                                    {bio ? bio[0] : 'A'}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-1">abcd</h1>
                                    <p className="text-zinc-400 mb-3 text-lg">Web Development Developer</p>
                                    <div className="flex items-center gap-4 text-zinc-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 border-b border-white/5">
                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    About
                                </h2>
                                <p className="text-zinc-400 text-lg">{bio}</p>
                            </div>

                            <div className="p-10 border-b border-white/5">
                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                                    Skills
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {skills.map((skill, index) => (
                                        <span key={index} className="bg-zinc-800/50 text-blue-400 border border-transparent rounded-full px-4 py-1 text-sm font-medium transition-colors hover:bg-zinc-700">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-10">
                                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>
                                    Projects
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-[#111219] rounded-xl p-6 border border-white/5">
                                        <h3 className="text-white font-bold mb-2">TaskFlow App</h3>
                                        <p className="text-zinc-500 text-sm mb-4">A Kanban board with drag-and-drop</p>
                                        <div className="text-emerald-400 text-xs font-mono">React TypeScript Tailwind</div>
                                    </div>
                                    <div className="bg-[#111219] rounded-xl p-6 border border-white/5">
                                        <h3 className="text-white font-bold mb-2">WeatherNow</h3>
                                        <p className="text-zinc-500 text-sm mb-4">Real-time weather dashboard</p>
                                        <div className="text-emerald-400 text-xs font-mono">React OpenWeather API</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
