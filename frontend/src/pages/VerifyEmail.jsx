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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">

      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl p-10 text-center w-[420px]">

        <div className="text-5xl mb-4">
          {success ? "✅" : "⏳"}
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          Email Verification
        </h2>

        <p className="text-white text-lg">
          {message}
        </p>

        {success && (
          <p className="text-white/70 mt-4 text-sm">
            Redirecting to login...
          </p>
        )}

      </div>

    </div>
  );
}