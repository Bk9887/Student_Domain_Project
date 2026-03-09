import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaThList, 
  FaBookOpen, 
  FaTrophy
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
  ];

  return (
    <aside className="h-screen w-64 
      bg-white/10 backdrop-blur-xl 
      border-r border-white/20 
      flex flex-col justify-between p-6
      shadow-2xl">

      {/* Logo */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-10 tracking-wide">
          Student Hub
        </h1>

        {/* Navigation */}
        <nav className="space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${navStyle} ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                    : "text-gray-300 hover:bg-indigo-500/20 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="flex items-center justify-center gap-3 py-3 rounded-xl 
        bg-gradient-to-r from-slate-700 to-slate-800
        hover:from-indigo-500 hover:to-purple-600
        text-gray-200 hover:text-white
        transition-all duration-300 shadow-md"
      >
        Logout
      </button>
    </aside>
  );
}