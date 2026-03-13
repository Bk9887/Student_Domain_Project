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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden app-bg">

      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 panel-strong p-6 lg:p-8 w-full max-w-[calc(100vw-2rem)] sm:max-w-[430px] flex flex-col"
      >
        {/* Role Toggle Selector */}
        <div className="flex bg-[#0a1b34]/80 p-1 rounded-xl mb-6 shadow-inner border border-sky-100/15">
          <button
            type="button"
            onClick={() => setIsAdminRole(false)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${!isAdminRole ? 'bg-gradient-to-r from-emerald-300 to-cyan-300 text-slate-900 shadow-[0_0_15px_rgba(47,185,169,0.35)]' : 'text-sky-100/70 hover:text-sky-50'}`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setIsAdminRole(true)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${isAdminRole ? 'bg-gradient-to-r from-emerald-300 to-cyan-300 text-slate-900 shadow-[0_0_15px_rgba(47,185,169,0.35)]' : 'text-sky-100/70 hover:text-sky-50'}`}
          >
            Administrator
          </button>
        </div>

        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-tight text-gradient">
          {isAdminRole ? "Admin Registration" : "Begin Your Journey"}
        </h2>

        {isAdminRole && (
          <input
            type="password"
            name="adminSecret"
            placeholder="System Passcode"
            required={isAdminRole}
            onChange={handleChange}
            className="w-full mb-4 p-3.5 rounded-xl bg-[#132645] text-slate-100 font-mono placeholder-sky-100/45 border border-sky-100/20 outline-none focus:border-emerald-200/60 focus:ring-1 focus:ring-emerald-200/50 transition-all shadow-inner"
          />
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          onChange={handleChange}
          className="w-full mb-4 p-3.5 rounded-xl bg-[#0b2342]/70 text-slate-100
          placeholder-sky-100/40 border border-sky-100/15 outline-none focus:border-emerald-200/50 focus:ring-1 focus:ring-emerald-200/50 transition-all shadow-inner"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="w-full mb-4 p-3.5 rounded-xl bg-[#0b2342]/70 text-slate-100
          placeholder-sky-100/40 border border-sky-100/15 outline-none focus:border-emerald-200/50 focus:ring-1 focus:ring-emerald-200/50 transition-all shadow-inner"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full mb-4 p-3.5 rounded-xl bg-[#0b2342]/70 text-slate-100
          placeholder-sky-100/40 border border-sky-100/15 outline-none focus:border-emerald-200/50 focus:ring-1 focus:ring-emerald-200/50 transition-all shadow-inner"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          onChange={handleChange}
          className="w-full mb-1 p-3.5 rounded-xl bg-[#0b2342]/70 text-slate-100
          placeholder-sky-100/40 border border-sky-100/15 outline-none focus:border-emerald-200/50 focus:ring-1 focus:ring-emerald-200/50 transition-all shadow-inner"
        />

        {errorMsg && (
          <p className="text-rose-200 text-xs font-medium mb-4 ml-1">
            {errorMsg}
          </p>
        )}

        {/* Adjust margin to account for error field */}
        <div className={errorMsg ? "mt-2" : "mt-6"}></div>

        <button
          type="submit"
          className="w-full btn-primary"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-sky-100/70 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-emerald-200 cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}