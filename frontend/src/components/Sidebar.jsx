import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaThList,
  FaBookOpen,
  FaTrophy,
  FaFileAlt,
  FaBriefcase
} from "react-icons/fa"; // FontAwesome icons

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const navStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300";

  const navItems = [
    { path: "/dashboard", label: "Home", icon: <FaHome /> },
    { path: "/domains", label: "Domains", icon: <FaThList /> },
    { path: "/roadmap", label: "Roadmap", icon: <FaBookOpen /> },
    { path: "/leaderboard", label: "Leaderboard", icon: <FaTrophy /> },
    { path: "/resume", label: "Resume Builder", icon: <FaFileAlt /> },
    { path: "/portfolio", label: "Portfolio", icon: <FaBriefcase /> },
  ];

  return (
    <aside className="h-screen w-64 
      bg-zinc-950/50 backdrop-blur-2xl 
      border-r border-white/5 
      flex flex-col justify-between p-6
      shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-40 relative">

      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <span className="text-white font-bold text-lg leading-none mt-[-2px]">S</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Student Hub
          </h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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

      {/* Logout Button */}
      <button
        onClick={logout}
        className="flex items-center justify-center gap-3 py-3 rounded-xl 
        bg-white/[0.03] border border-white/[0.08]
        hover:bg-white/[0.06] hover:border-white/[0.12]
        text-zinc-300 hover:text-white
        transition-all duration-300 shadow-lg"
      >
        Logout
      </button>
    </aside>
  );
}