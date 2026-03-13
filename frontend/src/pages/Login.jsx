
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isAdminRole, setIsAdminRole] = useState(false);

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
      const { email, password } = formData;
      const res = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password }
      );

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Create user object
      const user = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        domain: res.data.domain || null,
        photo: res.data.photo || null,
        isAdmin: !!res.data.isAdmin,
      };

      // ✅ Save user
      localStorage.setItem("currentUser", JSON.stringify(user));

      // ✅ Redirect logic: Selection-aware authorization
      if (isAdminRole) {
        // User attempted to login as Admin
        if (res.data.isAdmin === true) {
          navigate("/admin");
        } else {
          // Student trying to enter Admin portal
          alert("Access Denied: You do not have administrator privileges.");
          // Clear storage to prevent partial login state
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          return;
        }
      } else {
        // User logged in as Student (even if they have Admin rights, they chose the Student path)
        navigate("/dashboard");
      }

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
          {isAdminRole ? "Admin Portal" : "Welcome Back"}
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

        <p className="text-center text-sm text-zinc-400 mt-4">
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
