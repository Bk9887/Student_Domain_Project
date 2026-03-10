
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // ✅ Save token
      localStorage.setItem("token", response.data.token);

      // ✅ Create user object
      const user = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        domain: response.data.domain || null,
        photo: response.data.photo || null,
      };

      // ✅ Save user
      localStorage.setItem("currentUser", JSON.stringify(user));

      // ✅ Redirect logic
      navigate("/dashboard"); // returning user


    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950"
    >
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/[0.03] backdrop-blur-2xl
        border border-white/[0.08] p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-96"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Welcome Back to the Hub
        </h2>

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
          Login
        </button>

        <div className="text-right mt-3">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-indigo-400 hover:underline text-sm"
          >
            Forgot Password?
          </button>
        </div>

        <p className="text-center text-sm text-slate-400 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-400 cursor-pointer font-semibold"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}
