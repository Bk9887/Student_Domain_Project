import { useState, useEffect } from "react";
import { FaTrashAlt, FaPlus, FaEnvelope, FaGithub, FaLinkedin, FaBriefcase, FaCode, FaDownload, FaSave, FaFolderOpen, FaTimes } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import axios from "axios";

export default function PortfolioGenerator() {
    // Basic Information
    const [personalInfo, setPersonalInfo] = useState({
        name: "",
        role: "",
        email: "",
        github: "",
        linkedin: ""
    });

    const [bio, setBio] = useState("");

    // Arrays
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");

    const [experience, setExperience] = useState([]);
    const [newExperience, setNewExperience] = useState({
        role: "",
        company: "",
        duration: "",
        description: ""
    });

    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        title: "",
        technologies: "",
        description: "",
        link: ""
    });

    const [showPreview, setShowPreview] = useState(false);
    const [showPortfolioGallery, setShowPortfolioGallery] = useState(false);
    const [savedPortfolios, setSavedPortfolios] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch portfolios when gallery opens
    useEffect(() => {
        if (showPortfolioGallery) {
            fetchPortfolios();
        }
    }, [showPortfolioGallery]);

    const fetchPortfolios = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            const token = localStorage.getItem("token");
            if (!currentUser || !token) return;

            const res = await axios.get(`http://localhost:5000/api/dashboard/${currentUser._id}/portfolios`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedPortfolios(res.data);
        } catch (err) {
            console.error("Failed to fetch portfolios:", err);
        }
    };

    const handleSavePortfolio = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            const token = localStorage.getItem("token");
            if (!currentUser || !token) return alert("Please log in to save portfolios");

            setIsSaving(true);
            const portfolioData = { personalInfo, bio, skills, experience, projects };
            const portfolioName = `${personalInfo.name} - ${new Date().toLocaleDateString()}`;

            await axios.post(`http://localhost:5000/api/dashboard/${currentUser._id}/portfolios`,
                { name: portfolioName, data: portfolioData },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setIsSaving(false);
            alert("Portfolio Saved Successfully!");
        } catch (err) {
            console.error(err);
            setIsSaving(false);
            alert("Failed to save portfolio");
        }
    };

    const loadPortfolio = (data) => {
        setPersonalInfo(data.personalInfo || personalInfo);
        setBio(data.bio || bio);
        setSkills(data.skills || skills);
        setExperience(data.experience || experience);
        setProjects(data.projects || projects);
        setShowPortfolioGallery(false);
    };

    // Skill Handlers
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

    // Experience Handlers
    const handleAddExperience = (e) => {
        e.preventDefault();
        if (newExperience.role.trim() && newExperience.company.trim()) {
            setExperience([...experience, { ...newExperience, id: Date.now() }]);
            setNewExperience({ role: "", company: "", duration: "", description: "" });
        }
    };

    const removeExperience = (id) => {
        setExperience(experience.filter((exp) => exp.id !== id));
    };

    // Project Handlers
    const handleAddProject = (e) => {
        e.preventDefault();
        if (newProject.title.trim()) {
            setProjects([...projects, { ...newProject, id: Date.now() }]);
            setNewProject({ title: "", technologies: "", description: "", link: "" });
        }
    };

    const removeProject = (id) => {
        setProjects(projects.filter((proj) => proj.id !== id));
    };

    const exportToPDF = () => {
        const element = document.getElementById("portfolio-document");
        const opt = {
            margin: 10,
            filename: `${personalInfo.name.replace(/\s+/g, '_')}_Portfolio.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Portfolio Generator
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowPortfolioGallery(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                    >
                        <FaFolderOpen /> My Portfolios
                    </button>
                    <button
                        onClick={() => setShowPreview(true)}
                        className="px-5 py-2.5 rounded-xl font-medium bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 text-white"
                    >
                        Preview
                    </button>
                </div>
            </div>

            {/* Main Editor Container */}
            <div className="bg-[#111219]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-7 space-y-8">

                {/* --- Personal Information Section --- */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">1. Personal Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Add Full Name"
                                value={personalInfo.name}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Professional Role</label>
                            <input
                                type="text"
                                placeholder="Add Professional Role (e.g. Web Developer)"
                                value={personalInfo.role}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, role: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Add Email"
                                value={personalInfo.email}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">GitHub (optional)</label>
                            <input
                                type="text"
                                placeholder="Add GitHub Link (e.g. github.com/username)"
                                value={personalInfo.github}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-zinc-400 mb-1">LinkedIn (optional)</label>
                            <input
                                type="text"
                                placeholder="Add LinkedIn Link (e.g. linkedin.com/in/username)"
                                value={personalInfo.linkedin}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </section>

                {/* --- Bio Section --- */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">2. Bio & Summary</h2>
                    <textarea
                        placeholder="Add a short bio about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none leading-relaxed"
                    />
                </section>

                {/* --- Skills Section --- */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">3. Technical Skills</h2>
                    <div className="flex flex-wrap gap-3 mb-4">
                        {skills.map((skill) => (
                            <div
                                key={skill}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 hover:bg-blue-500/20 transition-colors cursor-pointer group"
                                onClick={() => removeSkill(skill)}
                            >
                                <span>{skill}</span>
                                <FaTrashAlt size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddSkill} className="flex gap-3 max-w-sm">
                        <input
                            type="text"
                            placeholder="Add a new skill (e.g. Python)..."
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <button type="submit" className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-colors text-white">
                            <FaPlus />
                        </button>
                    </form>
                </section>

                {/* --- Experience Section --- */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">4. Experience</h2>

                    {/* Render existing experience */}
                    <div className="space-y-4 mb-6">
                        {experience.map((exp) => (
                            <div key={exp.id} className="relative bg-black/40 border border-white/10 p-4 rounded-xl group transition-all hover:border-blue-500/30">
                                <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaTrashAlt />
                                </button>
                                <h3 className="font-bold text-white">{exp.role} <span className="text-zinc-500 font-normal">at</span> <span className="text-blue-400">{exp.company}</span></h3>
                                <p className="text-zinc-500 text-sm mb-2">{exp.duration}</p>
                                <p className="text-zinc-400 text-sm whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Add new experience form */}
                    <div className="bg-white/[0.02] border border-dashed border-white/10 p-4 rounded-xl">
                        <h3 className="text-sm font-medium text-zinc-300 mb-3">Add New Role</h3>
                        <div className="grid md:grid-cols-2 gap-3 mb-3">
                            <input
                                placeholder="Add Role (e.g. Frontend Engineer)"
                                value={newExperience.role}
                                onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                            <input
                                placeholder="Add Company (e.g. TechCorp)"
                                value={newExperience.company}
                                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <input
                            placeholder="Add Duration (e.g. Jan 2022 - Present)"
                            value={newExperience.duration}
                            onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                            className="w-full mb-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <textarea
                            placeholder="Add description of responsibilities and achievements..."
                            value={newExperience.description}
                            onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                            rows={3}
                            className="w-full mb-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                        />
                        <button onClick={handleAddExperience} className="text-sm px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg flex items-center gap-2 hover:bg-blue-500/30 transition-all">
                            <FaPlus size={12} /> Attach Experience
                        </button>
                    </div>
                </section>

                {/* --- Projects Section --- */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">5. Projects</h2>

                    {/* Render existing projects */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {projects.map((proj) => (
                            <div key={proj.id} className="relative bg-black/40 border border-white/10 p-4 rounded-xl group transition-all hover:border-blue-500/30">
                                <button onClick={() => removeProject(proj.id)} className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaTrashAlt />
                                </button>
                                <h3 className="font-bold text-white mb-1">{proj.title}</h3>
                                {proj.link && <p className="text-blue-400 text-xs mb-2 truncate">{proj.link}</p>}
                                <p className="text-emerald-400 font-mono text-xs mb-3">{proj.technologies}</p>
                                <p className="text-zinc-400 text-sm whitespace-pre-line line-clamp-3">{proj.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Add new project form */}
                    <div className="bg-white/[0.02] border border-dashed border-white/10 p-4 rounded-xl">
                        <h3 className="text-sm font-medium text-zinc-300 mb-3">Add New Project</h3>
                        <div className="grid md:grid-cols-2 gap-3 mb-3">
                            <input
                                placeholder="Add Project Title"
                                value={newProject.title}
                                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                            <input
                                placeholder="Add Technologies (e.g. React, Node, Tailwind)"
                                value={newProject.technologies}
                                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <input
                            placeholder="Add Live Link / GitHub Repo (optional)"
                            value={newProject.link}
                            onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                            className="w-full mb-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <textarea
                            placeholder="Add project description and features..."
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            rows={3}
                            className="w-full mb-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                        />
                        <button onClick={handleAddProject} className="text-sm px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg flex items-center gap-2 hover:bg-blue-500/30 transition-all">
                            <FaPlus size={12} /> Attach Project
                        </button>
                    </div>
                </section>

            </div>

            {/* --- PREVIEW MODAL --- */}
            {showPreview && (
                <div className="fixed inset-0 z-50 bg-[#070911] flex flex-col items-center overflow-y-auto w-full h-full pb-20">
                    {/* Modal Toolbar */}
                    <div className="w-full py-6 px-8 flex justify-between items-center bg-[#070911] sticky top-0 z-10 border-b border-white/5 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Portfolio Preview</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleSavePortfolio}
                                disabled={isSaving}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg ${isSaving ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20'}`}
                            >
                                <FaSave />
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={exportToPDF}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 transition-colors text-white shadow-lg shadow-blue-500/20"
                            >
                                <FaDownload /> Download PDF
                            </button>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="px-5 py-2.5 rounded-xl font-medium border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    {/* Actual Preview Canvas */}
                    <div className="w-full max-w-4xl mt-12 mb-20">
                        <div id="portfolio-document" className="bg-[#0f111a] rounded-3xl p-0 text-zinc-300 border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.1)] overflow-hidden">

                            {/* Personal Summary Header */}
                            <div className="p-10 md:p-14 flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-white/5 bg-gradient-to-b from-blue-900/10 to-transparent">
                                <div className="w-28 h-28 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-5xl font-black uppercase shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                    {personalInfo.name ? personalInfo.name[0] : 'A'}
                                </div>
                                <div className="text-center md:text-left flex-1 border-r border-white/5 pr-4 hidden md:block">
                                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">{personalInfo.name || "Your Name"}</h1>
                                    {personalInfo.role && <p className="text-blue-400 font-medium text-xl mb-4">{personalInfo.role}</p>}
                                </div>
                                <div className="flex-1 flex flex-col gap-3 justify-center text-sm font-medium">
                                    {personalInfo.email && (
                                        <div className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors">
                                            <FaEnvelope size={16} className="text-zinc-600" /> {personalInfo.email}
                                        </div>
                                    )}
                                    {personalInfo.github && (
                                        <div className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors">
                                            <FaGithub size={16} className="text-zinc-600" /> {personalInfo.github}
                                        </div>
                                    )}
                                    {personalInfo.linkedin && (
                                        <div className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors">
                                            <FaLinkedin size={16} className="text-zinc-600" /> {personalInfo.linkedin}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bio Layout */}
                            {bio && (
                                <div className="px-10 py-8 md:px-14 border-b border-white/5">
                                    <p className="text-zinc-400 text-lg leading-relaxed">{bio}</p>
                                </div>
                            )}

                            {/* Skills Layout */}
                            {skills.length > 0 && (
                                <div className="px-10 py-8 md:px-14 border-b border-white/5 bg-white/[0.01]">
                                    <h2 className="text-lg font-bold text-white mb-5 uppercase tracking-widest flex items-center gap-3">
                                        <FaCode className="text-blue-400" /> Technical Arsenal
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <span key={index} className="bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg px-4 py-1.5 text-sm font-bold shadow-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience Layout */}
                            {experience.length > 0 && (
                                <div className="px-10 py-10 md:px-14 border-b border-white/5">
                                    <h2 className="text-lg font-bold text-white mb-8 uppercase tracking-widest flex items-center gap-3">
                                        <FaBriefcase className="text-emerald-400" /> Experience
                                    </h2>
                                    <div className="space-y-8">
                                        {experience.map((exp) => (
                                            <div key={exp.id} className="relative pl-6 border-l-2 border-emerald-500/30 group">
                                                <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 mt-0.5">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                                                        <p className="text-emerald-400 font-medium">{exp.company}</p>
                                                    </div>
                                                    <span className="text-zinc-500 text-sm font-medium bg-white/5 px-3 py-1 rounded-full mt-2 md:mt-0 inline-block">{exp.duration}</span>
                                                </div>
                                                <p className="text-zinc-400 leading-relaxed whitespace-pre-line mt-3">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Projects Layout */}
                            {projects.length > 0 && (
                                <div className="px-10 py-10 md:px-14 bg-white/[0.01]">
                                    <h2 className="text-lg font-bold text-white mb-8 uppercase tracking-widest flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>
                                        Featured Projects
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {projects.map((proj) => (
                                            <div key={proj.id} className="bg-black/20 rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-colors group">
                                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">{proj.title}</h3>
                                                {proj.link && <p className="text-blue-400 text-sm mb-3 truncate hover:underline cursor-pointer">{proj.link}</p>}
                                                <div className="text-purple-400 text-xs font-mono font-bold mb-4 bg-purple-500/10 inline-block px-3 py-1 rounded-md">{proj.technologies}</div>
                                                <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{proj.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* Portfolio Gallery Modal */}
            {showPortfolioGallery && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#11131a] rounded-2xl w-full max-w-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <FaFolderOpen className="text-2xl text-indigo-400" />
                                <h2 className="text-2xl font-bold text-white tracking-tight">Saved Portfolios</h2>
                            </div>
                            <button onClick={() => setShowPortfolioGallery(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {savedPortfolios.length > 0 ? (
                                <div className="space-y-4">
                                    {savedPortfolios.map((port, idx) => (
                                        <div key={idx} className="bg-white/[0.02] border border-white/5 p-5 rounded-xl flex justify-between items-center hover:bg-white/[0.04] transition-colors group">
                                            <div>
                                                <h3 className="text-white font-semibold text-lg">{port.name}</h3>
                                                <p className="text-sm text-zinc-500">{new Date(port.timestamp).toLocaleString()}</p>
                                            </div>
                                            <button
                                                onClick={() => loadPortfolio(port.data)}
                                                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20 opacity-0 group-hover:opacity-100"
                                            >
                                                Load
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-zinc-500">You haven't saved any portfolios yet.</p>
                                    <p className="text-sm text-zinc-600 mt-2">Generate a portfolio and click "Save" in the Preview screen.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
