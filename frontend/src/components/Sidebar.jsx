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
    "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300";

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
      bg-[#07162e]/95 lg:bg-[#0b1d39]/85 backdrop-blur-2xl 
      border-r border-sky-100/15 
      flex flex-col justify-between p-6
      shadow-[4px_0_24px_rgba(0,0,0,0.45)] z-50 
      transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      transition-all duration-300 ease-in-out`}>

      {/* Logo */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-10 px-2 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-300 to-amber-300 flex items-center justify-center shadow-[0_0_15px_rgba(47,185,169,0.5)]">
              <span className="text-[#06243e] font-black text-lg leading-none mt-[-2px]">S</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 tracking-wide">
              Student Hub
            </h1>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-sky-100/70 hover:text-white transition-colors"
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
                  ? "bg-gradient-to-r from-emerald-300/20 to-cyan-300/10 text-slate-100 border border-emerald-200/30 shadow-[0_0_20px_rgba(47,185,169,0.2)]"
                  : "text-sky-100/75 hover:bg-white/10 hover:text-sky-50 border border-transparent"
                }`
              }
            >
              <span className="text-lg opacity-90">{item.icon}</span>
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
          bg-[#3d1521] border border-rose-300/20
          hover:bg-[#52202e] hover:border-rose-300/35
          text-rose-200 hover:text-rose-100
          transition-all duration-300 shadow-lg"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}