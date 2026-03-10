import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Signup failed");
      }

      // ✅ Save token separately
      localStorage.setItem("token", data.token);

      // ✅ Save user info
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          domain: data.domain || null,
        })
      );

      // go to login
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Something went wrong during signup");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">

      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/[0.03] backdrop-blur-2xl
        border border-white/[0.08] p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-96"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Begin Your Journey
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          onChange={handleChange}
          className="w-full mb-4 p-3.5 rounded-xl bg-white/[0.03] text-white
          placeholder-zinc-500 border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="w-full mb-4 p-3.5 rounded-xl bg-white/[0.03] text-white
          placeholder-zinc-500 border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full mb-6 p-3.5 rounded-xl bg-white/[0.03] text-white
          placeholder-zinc-500 border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
        />

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-medium text-white
          bg-indigo-600 border border-indigo-500
          hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] shadow-lg shadow-indigo-500/20 transition-all duration-300"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-slate-400 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-400 cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}