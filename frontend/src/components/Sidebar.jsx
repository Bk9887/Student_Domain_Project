import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaThList,
  FaBookOpen,
  FaTrophy,
  FaFileAlt,
  FaBriefcase,
  FaMapSigns
} from "react-icons/fa"; // FontAwesome icons
import { FaShieldAlt } from "react-icons/fa"; // Added security icon
import { FaRobot } from "react-icons/fa6";

export default function Sidebar({ appConfig, isOpen, onClose }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/");
  };

  const navStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300";

  let navItems = [
    { path: "/dashboard", label: "Home", icon: <FaHome /> },
    { path: "/domains", label: "Domains", icon: <FaThList /> },
    { path: "/roadmap", label: "Roadmap", icon: <FaBookOpen /> },
    { path: "/leaderboard", label: "Leaderboard", icon: <FaTrophy /> },
    { path: "/resume", label: "Resume Builder", icon: <FaFileAlt /> },
    { path: "/portfolio", label: "Portfolio", icon: <FaBriefcase /> },
    { path: "/journey", label: "My Journey", icon: <FaMapSigns /> }
  ];

  if (appConfig?.showAiMentor !== false) {
    navItems.push({ path: "/chat", label: "AI Mentor", icon: <FaRobot /> });
  }

  if (currentUser.isAdmin === true) {
    navItems.push({ path: "/admin", label: "Admin Panel", icon: <FaShieldAlt /> });
  }

  return (
    <aside className={`fixed lg:static inset-y-0 left-0 w-64 
      bg-zinc-950/90 lg:bg-zinc-950/50 backdrop-blur-2xl 
      border-r border-white/5 
      flex flex-col justify-between p-6
      shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-50 
      transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      transition-all duration-300 ease-in-out`}>

      {/* Logo */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-10 px-2 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <span className="text-white font-bold text-lg leading-none mt-[-2px]">S</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Student Hub
            </h1>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) =>
                `${navStyle} ${isActive
                  ? "bg-white/[0.06] text-white border border-white/[0.08] shadow-[0_0_15px_rgba(79,70,229,0.1)]"
                  : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200 border border-transparent"
                }`
              }
            >
              <span className="text-lg opacity-80">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2 relative">
        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center justify-center w-full gap-3 py-3 rounded-xl 
          bg-red-500/10 border border-red-500/20
          hover:bg-red-500/20 hover:border-red-500/30
          text-red-400 hover:text-red-300
          transition-all duration-300 shadow-lg"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}