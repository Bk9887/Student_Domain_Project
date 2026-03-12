import { useState, useEffect } from "react";
import { FaFileAlt, FaDownload, FaTrashAlt, FaPlus, FaSave, FaFolderOpen, FaTimes } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import axios from "axios";

export default function ResumeBuilder() {
    const [personalInfo, setPersonalInfo] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [education, setEducation] = useState({
        institution: "",
        degree: "",
        year: "",
    });

    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");

    const [experience, setExperience] = useState([]);
    const [newExperience, setNewExperience] = useState({
        role: "",
        company: "",
        location: "",
        duration: "",
        description: "" // Users can add bullet points using \n or bullet chars
    });

    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        title: "",
        technologies: "",
        duration: "",
        description: ""
    });

    const [showPreview, setShowPreview] = useState(false);
    const [showResumeGallery, setShowResumeGallery] = useState(false);
    const [savedResumes, setSavedResumes] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch resumes when gallery opens
    useEffect(() => {
        if (showResumeGallery) {
            fetchResumes();
        }
    }, [showResumeGallery]);

    const fetchResumes = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            const token = localStorage.getItem("token");
            if (!currentUser || !token) return;

            const res = await axios.get(`http://localhost:5000/api/dashboard/${currentUser._id}/resumes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedResumes(res.data);
        } catch (err) {
            console.error("Failed to fetch resumes:", err);
        }
    };

    const handleSaveResume = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            const token = localStorage.getItem("token");
            if (!currentUser || !token) return alert("Please log in to save resumes");

            setIsSaving(true);
            const resumeData = { personalInfo, education, skills, experience, projects };
            const resumeName = `${personalInfo.name} - ${new Date().toLocaleDateString()}`;

            await axios.post(`http://localhost:5000/api/dashboard/${currentUser._id}/resumes`,
                { name: resumeName, data: resumeData },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setIsSaving(false);
            alert("Resume Saved Successfully!");
        } catch (err) {
            console.error(err);
            setIsSaving(false);
            alert("Failed to save resume");
        }
    };

    const loadResume = (data) => {
        setPersonalInfo(data.personalInfo || personalInfo);
        setEducation(data.education || education);
        setSkills(data.skills || skills);
        setExperience(data.experience || experience);
        setProjects(data.projects || projects);
        setShowResumeGallery(false);
    };

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
            setNewExperience({ role: "", company: "", location: "", duration: "", description: "" });
        }
    };

    const removeExperience = (idToRemove) => {
        setExperience(experience.filter((exp) => exp.id !== idToRemove));
    };

    // Project Handlers
    const handleAddProject = (e) => {
        e.preventDefault();
        if (newProject.title.trim()) {
            setProjects([...projects, { ...newProject, id: Date.now() }]);
            setNewProject({ title: "", technologies: "", duration: "", description: "" });
        }
    };

    const removeProject = (idToRemove) => {
        setProjects(projects.filter((proj) => proj.id !== idToRemove));
    };

    const exportToPDF = () => {
        const element = document.getElementById("resume-document");
        const opt = {
            margin: 10,
            filename: `${personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`,
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
                <div className="flex items-center gap-3">
                    <FaFileAlt className="text-3xl text-indigo-400" />
                    <h1 className="text-3xl font-extrabold tracking-tight text-white transition-all duration-300">
                        Resume Builder
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowResumeGallery(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                    >
                        <FaFolderOpen /> My Resumes
                    </button>
                    <button
                        onClick={() => setShowPreview(true)}
                        className="px-5 py-2.5 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all font-bold"
                    >
                        Preview
                    </button>
                </div>
            </div>

            {/* Form Sections */}
            <div className="space-y-6">

                {/* Personal Information */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-7 transition-all">
                    <h2 className="text-lg font-bold text-white mb-6">Personal Information</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Name</label>
                            <input
                                type="text"
                                placeholder="Add Name"
                                value={personalInfo.name}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-zinc-600 shadow-inner"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="Add Email"
                                value={personalInfo.email}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-zinc-600 shadow-inner"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Phone</label>
                            <input
                                type="text"
                                placeholder="Add Phone"
                                value={personalInfo.phone}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-zinc-600 shadow-inner"
                            />
                        </div>
                    </div>
                </div>

                {/* Education */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-7 transition-all">
                    <h2 className="text-lg font-bold text-white mb-6">Education</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <input
                                type="text"
                                placeholder="Add Institution"
                                value={education.institution}
                                onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-zinc-600 shadow-inner"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Add Degree/Major"
                                value={education.degree}
                                onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-zinc-600 shadow-inner"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Add Year (e.g. 2024)"
                                value={education.year}
                                onChange={(e) => setEducation({ ...education, year: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-zinc-600 shadow-inner"
                            />
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-7 transition-all">
                    <h2 className="text-lg font-bold text-white mb-6">Skills</h2>

                    <div className="flex flex-wrap gap-3 mb-6">
                        {skills.map((skill) => (
                            <div
                                key={skill}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300 transition-colors hover:bg-indigo-500/20 shadow-sm"
                            >
                                <span>{skill}</span>
                                <button
                                    onClick={() => removeSkill(skill)}
                                    className="text-indigo-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <FaTrashAlt size={12} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddSkill} className="flex gap-3 max-w-sm">
                        <input
                            type="text"
                            placeholder="Add a skill..."
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-colors text-white"
                        >
                            <FaPlus />
                        </button>
                    </form>
                </div>

                {/* Experience */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-7 transition-all">
                    <h2 className="text-lg font-bold text-white mb-6">Professional Experience</h2>

                    {/* Render existing experiences */}
                    <div className="space-y-4 mb-6">
                        {experience.map((exp) => (
                            <div key={exp.id} className="bg-black/40 border border-white/10 rounded-xl p-4 flex justify-between items-start group hover:border-indigo-500/30 transition-all shadow-sm">
                                <div>
                                    <h3 className="font-bold text-white">{exp.role} <span className="text-indigo-400 font-normal">at {exp.company}</span></h3>
                                    <p className="text-sm text-zinc-400 font-medium">{exp.location} | {exp.duration}</p>
                                </div>
                                <button onClick={() => removeExperience(exp.id)} className="text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                    <FaTrashAlt />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add new experience form */}
                    <form onSubmit={handleAddExperience} className="space-y-4 border-t border-white/10 pt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Add Role (e.g. Software Engineer)"
                                value={newExperience.role}
                                onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Add Company (e.g. TechCorp)"
                                value={newExperience.company}
                                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Add Location (e.g. San Francisco, CA)"
                                value={newExperience.location}
                                onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Add Duration (e.g. Jun 2023 - Present)"
                                value={newExperience.duration}
                                onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <textarea
                            placeholder="Description (use bullet points or newlines for multiple items)"
                            rows={3}
                            value={newExperience.description}
                            onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                        ></textarea>
                        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/20 transition-colors">
                            <FaPlus /> Add Experience
                        </button>
                    </form>
                </div>

                {/* Projects */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-7 transition-all">
                    <h2 className="text-lg font-bold text-white mb-6">Projects & Extracurriculars</h2>

                    {/* Render existing projects */}
                    <div className="space-y-4 mb-6">
                        {projects.map((proj) => (
                            <div key={proj.id} className="bg-black/40 border border-white/10 rounded-xl p-4 flex justify-between items-start group hover:border-indigo-500/30 transition-all shadow-sm">
                                <div>
                                    <h3 className="font-bold text-white">{proj.title}</h3>
                                    <p className="text-sm text-indigo-400 mb-1 font-medium">{proj.technologies}</p>
                                    <p className="text-sm text-zinc-400 font-medium">{proj.duration}</p>
                                </div>
                                <button onClick={() => removeProject(proj.id)} className="text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                    <FaTrashAlt />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add new project form */}
                    <form onSubmit={handleAddProject} className="space-y-4 border-t border-white/10 pt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Add Project Title"
                                value={newProject.title}
                                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Add Technologies (e.g. React, Node.js)"
                                value={newProject.technologies}
                                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Add Duration (e.g. Fall 2023)"
                                value={newProject.duration}
                                onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                                className="md:col-span-2 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <textarea
                            placeholder="Description"
                            rows={3}
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                        ></textarea>
                        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/20 transition-colors">
                            <FaPlus /> Add Project
                        </button>
                    </form>
                </div>

            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 bg-[#0f111a] flex flex-col items-center overflow-y-auto transition-all duration-300">
                    {/* Preview Topbar */}
                    <div className="w-full max-w-5xl py-6 px-8 flex justify-between items-center bg-[#0f111a] sticky top-0 z-10 border-b border-white/5 shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <FaFileAlt className="text-2xl text-indigo-600" />
                            <h2 className="text-2xl font-bold text-white tracking-tight">Resume Builder</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleSaveResume}
                                disabled={isSaving}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg ${isSaving ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'}`}
                            >
                                <FaSave />
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={exportToPDF}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 transition-colors text-white shadow-lg shadow-indigo-600/20"
                            >
                                <FaDownload />
                                Export PDF
                            </button>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="px-5 py-2.5 rounded-xl font-medium border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    {/* Resume Document Area */}
                    <div className="w-full mt-8 mb-20 flex justify-center">
                        {/* A4 Width Approximation Container */}
                        <div id="resume-document" className="bg-white text-black font-sans p-12 sm:p-20 shadow-2xl w-full max-w-[210mm] min-h-[297mm] mx-4 relative border border-zinc-200">

                            {/* Header / Contact */}
                            <div className="mb-8">
                                <h1 className="text-5xl font-light tracking-tight text-black mb-3">{personalInfo.name}</h1>
                                <p className="text-sm font-bold text-black border-b-[1.5px] border-black pb-8">
                                    {personalInfo.email} <span className="mx-2">•</span> {personalInfo.phone}
                                </p>
                            </div>

                            {/* Education */}
                            <div className="mb-10 mt-6">
                                <h2 className="text-xs uppercase tracking-[0.2em] text-black border-b-[1.5px] border-black pb-2 mb-4 font-bold">Education</h2>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-base font-bold text-black">{education.institution}</h3>
                                    <span className="text-sm text-black">{education.year}</span>
                                </div>
                                <p className="text-sm text-black italic">{education.degree}</p>
                            </div>

                            {/* Professional Experience */}
                            {experience.length > 0 && (
                                <div className="mb-10 mt-6">
                                    <h2 className="text-[11px] uppercase tracking-[0.2em] text-black border-b-[1.5px] border-black pb-2 mb-4 font-bold">Professional Experience</h2>
                                    <div className="space-y-6">
                                        {experience.map(exp => (
                                            <div key={exp.id}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="text-[13px] font-bold text-black">{exp.company}, {exp.location}</h3>
                                                    <span className="text-[12px] font-bold text-black">{exp.duration}</span>
                                                </div>
                                                <p className="text-[13px] text-black italic mb-2">{exp.role}</p>
                                                {/* Split description safely by newlines into bullet points */}
                                                <ul className="list-disc list-outside ml-4 text-[13px] text-black space-y-1">
                                                    {exp.description.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
                                                        <li key={idx} className="leading-snug">{line.replace(/^[-•*]\s*/, '')}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Projects & Extracurriculars */}
                            {projects.length > 0 && (
                                <div className="mb-10 mt-6">
                                    <h2 className="text-[11px] uppercase tracking-[0.2em] text-black border-b-[1.5px] border-black pb-2 mb-4 font-bold">Projects & Extracurriculars</h2>
                                    <div className="space-y-6">
                                        {projects.map(proj => (
                                            <div key={proj.id}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="text-[13px] font-bold text-black">{proj.title}</h3>
                                                    <span className="text-[12px] font-bold text-black">{proj.duration}</span>
                                                </div>
                                                {proj.technologies && <p className="text-[12px] text-zinc-700 italic mb-2">Technologies: {proj.technologies}</p>}
                                                <ul className="list-disc list-outside ml-4 text-[13px] text-black space-y-1">
                                                    {proj.description.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
                                                        <li key={idx} className="leading-snug">{line.replace(/^[-•*]\s*/, '')}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            <div className="mb-10 mt-6">
                                <h2 className="text-[11px] uppercase tracking-[0.2em] text-black border-b-[1.5px] border-black pb-2 mb-4 font-bold">Skills</h2>
                                <p className="text-sm text-black leading-relaxed">
                                    <span className="font-bold">Core Competencies: </span>
                                    {skills.join(", ")}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            )}

            {/* Resume Gallery Modal */}
            {showResumeGallery && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-[#11131a] rounded-2xl w-full max-w-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <FaFolderOpen className="text-2xl text-indigo-400" />
                                <h2 className="text-2xl font-bold text-white tracking-tight">Saved Resumes</h2>
                            </div>
                            <button onClick={() => setShowResumeGallery(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {savedResumes.length > 0 ? (
                                <div className="space-y-4">
                                    {savedResumes.map((res, idx) => (
                                        <div key={idx} className="bg-white/[0.02] border border-white/5 p-5 rounded-xl flex justify-between items-center hover:bg-white/[0.04] shadow-sm transition-colors group">
                                            <div>
                                                <h3 className="text-white font-bold text-lg">{res.name}</h3>
                                                <p className="text-sm text-zinc-500 font-medium">{new Date(res.timestamp).toLocaleString()}</p>
                                            </div>
                                            <button
                                                onClick={() => loadResume(res.data)}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-indigo-600/20 opacity-0 group-hover:opacity-100"
                                            >
                                                Load
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-zinc-500 font-medium">You haven't saved any resumes yet.</p>
                                    <p className="text-sm text-zinc-600 mt-2">Generate a resume and click "Save to Profile" in the Preview screen.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
