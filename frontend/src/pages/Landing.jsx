import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleExplore = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) navigate("/login");
    else navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden
    bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">

      {/* Glow Orbs */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-700/20 rounded-full blur-3xl -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-blue-700/20 rounded-full blur-3xl -bottom-40 -right-40" />

      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl font-bold text-white mb-6 tracking-wide">
          Student Domain Guidance Platform
        </h1>

        <p className="text-blue-300 mb-10 text-lg">
          Explore careers. Discover strengths. Build your future.
        </p>

        <button
          onClick={handleExplore}
          className="px-8 py-3 rounded-xl font-semibold text-white
          bg-gradient-to-r from-indigo-600 to-blue-600
          hover:from-indigo-700 hover:to-blue-700
          transition duration-300 shadow-lg shadow-indigo-900/40"
        >
          Explore Domains
        </button>
      </div>
    </div>
  );
}