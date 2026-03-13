import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminSecret: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isAdminRole, setIsAdminRole] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== formData.confirmPassword) {
      return setErrorMsg("Passwords do not match!");
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      return setErrorMsg("Password must be at least 6 characters long and include 1 uppercase letter, 1 number, and 1 special character.");
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isAdmin: isAdminRole,
        adminSecret: isAdminRole ? formData.adminSecret : undefined
      };

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Signup failed");
      }

      // Backend requires Email Verification first, so we only receive a success message, not an active token.
      alert(data.message);

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
        border border-white/[0.08] p-6 lg:p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full max-w-[calc(100vw-2rem)] sm:max-w-[400px] flex flex-col"
      >
        {/* Role Toggle Selector */}
        <div className="flex bg-black/20 p-1 rounded-xl mb-6 shadow-inner border border-white/5">
          <button
            type="button"
            onClick={() => setIsAdminRole(false)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${!isAdminRole ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setIsAdminRole(true)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${isAdminRole ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Administrator
          </button>
        </div>

        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          {isAdminRole ? "Admin Registration" : "Begin Your Journey"}
        </h2>

        {isAdminRole && (
          <input
            type="password"
            name="adminSecret"
            placeholder="System Passcode"
            required={isAdminRole}
            onChange={handleChange}
            className="w-full mb-4 p-3.5 rounded-xl bg-indigo-500/10 text-white font-mono placeholder-indigo-300/50 border border-indigo-500/30 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all shadow-inner"
          />
        )}

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
          className="w-full mb-4 p-3.5 rounded-xl bg-white/[0.03] text-white
          placeholder-zinc-500 border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          onChange={handleChange}
          className="w-full mb-1 p-3.5 rounded-xl bg-white/[0.03] text-white
          placeholder-zinc-500 border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
        />

        {errorMsg && (
          <p className="text-red-400 text-xs font-medium mb-4 ml-1">
            {errorMsg}
          </p>
        )}

        {/* Adjust margin to account for error field */}
        <div className={errorMsg ? "mt-2" : "mt-6"}></div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-medium text-white
          bg-indigo-600 border border-indigo-500
          hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] shadow-lg shadow-indigo-500/20 transition-all duration-300"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-zinc-400 mt-4">
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