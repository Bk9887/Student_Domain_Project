import { useState } from "react";
import axios from "axios";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message) return;

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/feedback",
        { ...form, category: "question" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus({ type: "success", message: "Your message has been received! Our team will get back to you shortly." });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: "Failed to send message. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden transition-colors">

      {/* Contact Form */}
      <div className="relative max-w-3xl mx-auto space-y-6 pb-6 pt-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-white transition-colors tracking-tight italic uppercase">Contact Us</h1>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 w-full space-y-5 transition-colors">
          {status.message && (
            <div className={`p-4 rounded-xl text-sm font-bold ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {status.message}
            </div>
          )}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="5"
            className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-xl font-medium shadow-lg shadow-indigo-500/20
            bg-indigo-500 border border-indigo-500
            hover:bg-indigo-400 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300 text-lg disabled:opacity-50"
          >
            {loading ? "Sending Signal..." : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}