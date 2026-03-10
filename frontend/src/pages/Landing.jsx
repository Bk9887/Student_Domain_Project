import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleExplore = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) navigate("/login");
    else navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 selection:bg-indigo-500/30">

      {/* Glow Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tighter bg-gradient-to-br from-white via-indigo-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-sm">
          Forge Your Path in Tech
        </h1>

        <p className="text-zinc-400 mb-10 text-xl md:text-2xl leading-relaxed tracking-wide">
          Master your potential. Discover the domain that defines your future, guided by AI.
        </p>

        <button
          onClick={handleExplore}
          className="px-8 py-3.5 rounded-xl font-medium text-white
          bg-indigo-600 border border-indigo-500
          hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]
          transition-all duration-300 shadow-lg shadow-indigo-500/20"
        >
          Start Building Now
        </button>
      </div>
    </div>
  );
}