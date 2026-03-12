import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import axios from "axios";

export default function ResetPassword() {

  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      return setErrorMsg("Passwords do not match!");
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return setErrorMsg("Password must be at least 6 characters long and include 1 uppercase letter, 1 number, and 1 special character.");
    }

    try {

      const response = await axios.post(
        `${API_BASE_URL}/auth/reset-password/${token}`,
        { password: newPassword }
      );

      alert(response.data.message);
      navigate("/login");

    } catch (error) {

      alert(error.response?.data?.message || "Error resetting password");

    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 bg-white/[0.03] backdrop-blur-2xl
        border border-white/[0.08] p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-96">

        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Reset Password
        </h2>

        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="Enter new password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3.5 mb-4 rounded-xl bg-white/[0.03] text-white
            placeholder-zinc-500 border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3.5 mb-1 rounded-xl bg-white/[0.03] text-white
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
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}