
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden
      bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950"
    >
      <div className="absolute w-[500px] h-[500px] bg-indigo-700/20 rounded-full blur-3xl -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-blue-700/20 rounded-full blur-3xl -bottom-40 -right-40" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-slate-900/60 backdrop-blur-xl
        border border-slate-700 p-8 rounded-2xl shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-xl bg-slate-800 text-white
          placeholder-slate-400 border border-slate-700 outline-none focus:border-indigo-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full mb-6 p-3 rounded-xl bg-slate-800 text-white
          placeholder-slate-400 border border-slate-700 outline-none focus:border-indigo-500"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-white
          bg-gradient-to-r from-indigo-600 to-blue-600
          hover:from-indigo-700 hover:to-blue-700 transition"
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
