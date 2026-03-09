import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0f2f] to-[#2a1b4d] text-white overflow-hidden">

      {/* Glow Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Contact Form */}
      <div className="relative max-w-3xl mx-auto space-y-6 pb-6 pt-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-white">Contact Us</h1>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="w-full p-3 rounded-lg bg-white/10 text-white outline-none h-32"
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-700 hover:to-purple-700 transition w-full"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}