import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {

  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {

    const verify = async () => {
      try {

        const res = await axios.get(
          `http://localhost:5000/api/auth/verify-email/${token}`
        );

        setMessage(res.data.message);
        setSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 3000);

      } catch (error) {

        setMessage("Verification failed or link expired.");
        setSuccess(false);

      }
    };

    verify();

  }, [token, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 bg-white/[0.03] backdrop-blur-2xl
        border border-white/[0.08] p-10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-[420px] text-center">

        <div className="text-5xl mb-6">
          {success ? "✅" : "⏳"}
        </div>

        <h2 className="text-3xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Email Verification
        </h2>

        <p className="text-zinc-300 text-lg">
          {message}
        </p>

        {success && (
          <p className="text-zinc-500 mt-6 text-sm">
            Redirecting to login...
          </p>
        )}
      </div>
    </div>
  );
}