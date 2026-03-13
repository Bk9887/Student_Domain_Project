import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleExplore = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) navigate("/login");
    else navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden app-bg">

      {/* Glow Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 px-6 max-w-5xl mx-auto w-full">
        <div className="panel-strong p-8 md:p-12 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-sky-100/20 text-xs font-semibold tracking-[0.18em] uppercase text-sky-100/80 mb-7">
            Skill Operating System
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gradient leading-tight">
            Build A Career Pipeline, Not Just A To-Do List
          </h1>

          <p className="text-sky-100/75 mb-10 text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto">
            Discover your strongest domain, train with guided roadmaps, and stack proof of growth every week.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleExplore} className="btn-primary">
              Enter Student Hub
            </button>
            <button onClick={() => navigate('/about')} className="btn-ghost">
              See How It Works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}