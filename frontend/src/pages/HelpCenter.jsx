import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { MdSend, MdBugReport, MdQuestionAnswer, MdCheckCircle } from "react-icons/md";

export default function HelpCenter() {
  const [form, setForm] = useState({ category: "bug", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const faqs = [
    {
      question: "How do I select a domain?",
      answer: "Go to the Dashboard and click on 'Choose a Domain' to select your preferred domain."
    },
    {
      question: "How can I track my progress?",
      answer: "Your progress is displayed on your Dashboard under the 'Progress' card."
    },
    {
      question: "How do I update my profile?",
      answer: "Visit the Profile page, make changes, and click 'Save Profile'."
    },
    {
      question: "Who can I contact for technical support?",
      answer: "Use the Contact page or the 'Report Bug' form below."
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message) return;

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/feedback`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus({ type: "success", message: "Signal recorded. Our technicians are investigating." });
      setForm({ ...form, message: "" });
    } catch (err) {
      setStatus({ type: "error", message: "Transmission failed. Frequency blocked." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden transition-colors">

      {/* Page Content */}
      <div className="relative max-w-4xl mx-auto space-y-8 pb-12 pt-10 px-4">

        <h1 className="text-4xl font-bold mb-6 text-white text-center italic tracking-tighter uppercase underline decoration-indigo-500 decoration-4 underline-offset-8">Help Center</h1>

        {/* FAQs */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 space-y-4 transition-colors">
          <h2 className="text-2xl font-bold mb-6 text-indigo-300 italic tracking-tight uppercase">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.05] shadow-inner transition-colors">
              <p className="font-bold text-zinc-100 transition-colors uppercase tracking-tight">{faq.question}</p>
              <p className="text-zinc-400 mt-2 leading-relaxed transition-colors font-medium">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Report Bug / Special Contact */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-indigo-300 italic tracking-tight uppercase">Support Transmission</h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Report anomalies or ask for guidance.</p>
            </div>
          </div>

          <div className="space-y-4">
            {status.message && (
              <div className={`p-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                {status.type === 'success' ? <MdCheckCircle className="text-xl" /> : null}
                {status.message}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setForm({ ...form, category: 'bug' })}
                className={`flex-1 p-4 rounded-xl border transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest ${form.category === 'bug' ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:text-white'}`}
              >
                <MdBugReport className="text-lg" /> Report Bug
              </button>
              <button
                onClick={() => setForm({ ...form, category: 'question' })}
                className={`flex-1 p-4 rounded-xl border transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest ${form.category === 'question' ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:text-white'}`}
              >
                <MdQuestionAnswer className="text-lg" /> Ask Question
              </button>
            </div>

            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Describe the anomaly or your query..."
              rows="4"
              className="w-full p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] outline-none focus:border-indigo-500/50 text-white placeholder-zinc-700 transition-all font-medium text-sm leading-relaxed"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !form.message}
              className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20
              bg-indigo-600 border border-indigo-500/50 hover:bg-indigo-500
              disabled:opacity-30 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <MdSend /> {loading ? "Broadcasting..." : "Initialize Transfer"}
            </button>
          </div>
        </div>

        {/* Guides */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 transition-colors">
          <h2 className="text-2xl font-bold mb-4 text-indigo-300 italic tracking-tight uppercase">Guides & Tutorials</h2>
          <ul className="list-disc list-inside text-zinc-400 space-y-2 transition-colors font-medium">
            <li>Getting Started with Your Domain</li>
            <li>Tracking Your Progress Efficiently</li>
            <li>Profile Management Tips</li>
            <li>Using the Dashboard Effectively</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
