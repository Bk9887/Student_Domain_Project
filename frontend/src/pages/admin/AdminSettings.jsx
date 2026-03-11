import { useState, useEffect } from "react";
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
                const res = await axios.get("http://localhost:5000/api/admin/config");
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
            const res = await axios.put("http://localhost:5000/api/admin/config", config, {
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
                <h2 className="text-2xl font-bold text-slate-800">Global Configuration</h2>
                <p className="text-slate-500 text-sm mt-1">Manage framework-level feature toggles and emergency states.</p>
            </div>

            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
                    <MdSettings className="text-slate-400 text-xl mr-2" />
                    <h3 className="text-lg font-bold text-slate-800">Application Parameters</h3>
                </div>

                <div className="p-6">
                    {message && (
                        <div className="mb-6 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
                            <MdCheckCircle className="text-emerald-500 text-lg" /> {message}
                        </div>
                    )}

                    <div className="space-y-6">

                        {/* Feature Toggles */}
                        <div className="space-y-4">

                            {/* AI Mentor Toggle */}
                            <label className="flex items-center justify-between p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm cursor-pointer transition-all">
                                <div>
                                    <div className="text-slate-800 font-bold text-base">Activate AI Mentor Module</div>
                                    <div className="text-sm text-slate-500 mt-1 max-w-lg">If disabled, the Chatbot link will be completely hidden from the user Sidebar globally across all learner accounts.</div>
                                </div>
                                <div className="relative inline-block w-14 h-8 shrink-0">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={config.showAiMentor}
                                        onChange={(e) => setConfig({ ...config, showAiMentor: e.target.checked })}
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition-colors ${config.showAiMentor ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform shadow-sm ${config.showAiMentor ? 'transform translate-x-6' : ''}`}></div>
                                </div>
                            </label>

                            {/* Maintenance Mode Toggle */}
                            <label className="flex items-center justify-between p-5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 cursor-pointer transition-all">
                                <div>
                                    <div className="text-red-700 font-bold flex items-center gap-2 text-base">
                                        <MdWarning className="text-lg" /> Global Maintenance Mode
                                    </div>
                                    <div className="text-sm text-red-600/80 mt-1 max-w-lg">If enabled, standard users will be locked out of the app entirely, seeing only a maintenance splash screen. Admins will still have access.</div>
                                </div>
                                <div className="relative inline-block w-14 h-8 shrink-0">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={config.maintenanceMode}
                                        onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition-colors ${config.maintenanceMode ? 'bg-red-600' : 'bg-slate-300'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform shadow-sm ${config.maintenanceMode ? 'transform translate-x-6' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer Save Area */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-sm shadow-indigo-500/30 text-sm"
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
