import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";
import axios from "axios";
import { MdSettings, MdSave, MdWarning, MdCheckCircle } from "react-icons/md";

export default function AdminSettings() {
    const [config, setConfig] = useState({
        maintenanceMode: false,
        showAiMentor: true,
        announcement: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/admin/config`);
                if (res.data) setConfig(res.data);
            } catch (error) {
                console.error("Failed to load config:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(`${API_BASE_URL}/admin/config`, config, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConfig(res.data);
            setMessage("Configuration updated successfully. Changes are now live globally!");

            // Dispatch event to force App.jsx to re-read config immediately without reload
            window.dispatchEvent(new Event("configUpdated"));
        } catch (error) {
            console.error("Failed to save config:", error);
            setMessage("Error updating configuration.");
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
        <div className="max-w-4xl mx-auto pb-10">

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white transition-colors">Global Configuration</h2>
                <p className="text-zinc-500 text-sm mt-1 transition-colors">Manage framework-level feature toggles and emergency states.</p>
            </div>

            <div className="bg-zinc-950 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-white/[0.05] overflow-hidden transition-colors">
                <div className="px-6 py-4 border-b border-white/[0.05] bg-white/[0.01] flex items-center">
                    <MdSettings className="text-zinc-500 text-xl mr-2" />
                    <h3 className="text-lg font-bold text-white italic tracking-tight uppercase">Application Parameters</h3>
                </div>

                <div className="p-6">
                    {message && (
                        <div className="mb-6 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-sm font-medium">
                            <MdCheckCircle className="text-emerald-500 text-lg" /> {message}
                        </div>
                    )}

                    <div className="space-y-6">

                        {/* Feature Toggles */}
                        <div className="space-y-4">

                            {/* AI Mentor Toggle */}
                            <label className="flex items-center justify-between p-5 rounded-xl border border-white/[0.05] bg-zinc-950 hover:border-indigo-500/30 hover:shadow-sm cursor-pointer transition-all">
                                <div>
                                    <div className="text-white font-bold text-base transition-colors">Activate AI Mentor Module</div>
                                    <div className="text-sm text-zinc-500 mt-1 max-w-lg transition-colors">If disabled, the Chatbot link will be completely hidden from the user Sidebar globally across all learner accounts.</div>
                                </div>
                                <div className="relative inline-block w-14 h-8 shrink-0">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={config.showAiMentor}
                                        onChange={(e) => setConfig({ ...config, showAiMentor: e.target.checked })}
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition-colors ${config.showAiMentor ? 'bg-indigo-500' : 'bg-zinc-800'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-zinc-300 w-6 h-6 rounded-full transition-transform shadow-sm ${config.showAiMentor ? 'transform translate-x-6' : ''}`}></div>
                                </div>
                            </label>

                            {/* Maintenance Mode Toggle */}
                            <label className="flex items-center justify-between p-5 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 cursor-pointer transition-all">
                                <div>
                                    <div className="text-rose-400 font-bold flex items-center gap-2 text-base transition-colors">
                                        <MdWarning className="text-lg" /> Global Maintenance Mode
                                    </div>
                                    <div className="text-sm text-rose-400/60 mt-1 max-w-lg transition-colors">If enabled, standard users will be locked out of the app entirely, seeing only a maintenance splash screen. Admins will still have access.</div>
                                </div>
                                <div className="relative inline-block w-14 h-8 shrink-0">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={config.maintenanceMode}
                                        onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition-colors ${config.maintenanceMode ? 'bg-rose-500' : 'bg-zinc-800'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-zinc-300 w-6 h-6 rounded-full transition-transform shadow-sm ${config.maintenanceMode ? 'transform translate-x-6' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer Save Area */}
                <div className="px-6 py-4 border-t border-white/[0.05] bg-white/[0.01] flex justify-end transition-colors">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-sm shadow-indigo-500/30 text-sm"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <MdSave className="text-lg" /> Save & Publish Settings
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
