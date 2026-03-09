import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/reset-password"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Email not found.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden
    bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">

      <div className="absolute w-[500px] h-[500px] bg-indigo-700/20 rounded-full blur-3xl -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-blue-700/20 rounded-full blur-3xl -bottom-40 -right-40" />

      <div className="relative z-10 bg-slate-900/60 backdrop-blur-xl
      border border-slate-700 p-8 rounded-2xl shadow-2xl w-96">

        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-xl bg-slate-800 text-white
            placeholder-slate-400 border border-slate-700 outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-indigo-600 to-blue-600
            hover:from-indigo-700 hover:to-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-slate-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}