import { Link, useLocation } from "react-router-dom";
import {
    MdDashboard,
    MdPeople,
    MdSchool,
    MdMap,
    MdFeedback,
    MdSettings
} from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa";

export default function AdminSidebar({ isOpen, onClose }) {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/admin", icon: <MdDashboard /> },
        { name: "Students", path: "/admin/manage-students", icon: <MdPeople /> },
        { name: "Domains", path: "/admin/manage-domains", icon: <MdSchool /> },
        { name: "Roadmaps", path: "/admin/manage-roadmaps", icon: <MdMap /> },
        { name: "Feedback", path: "/admin/manage-feedback", icon: <MdFeedback /> },
        { name: "Global Config", path: "/admin/global-config", icon: <MdSettings /> },
    ];

    return (
        <aside className={`fixed lg:static left-0 top-0 h-screen w-64 bg-zinc-900/50 backdrop-blur-xl text-zinc-400 border-r border-white/[0.05] flex flex-col z-50 transition-all duration-300 
            ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
            
            {/* Brand Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/[0.05] bg-zinc-950/20">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] mr-3">
                        <FaLaptopCode className="text-white text-lg" />
                    </div>
                    <span className="text-white font-black text-xl tracking-tight">Hub<span className="text-indigo-500">CMS</span></span>
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

            {/* Navigation Links */}
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = item.path === "/admin"
                        ? location.pathname === "/admin"
                        : location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                            className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
                                ? "bg-indigo-600/10 text-indigo-400 shadow-[inset_0_0_10px_rgba(99,102,241,0.1)] border border-indigo-500/20"
                                : "hover:bg-white/[0.03] hover:text-white border border-transparent"
                                }`}
                        >
                            <span className={`text-xl mr-3 ${isActive ? "text-indigo-400" : "text-zinc-500"}`}>{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Return to App Button */}
            <div className="p-4 border-t border-white/[0.05] bg-zinc-950/20">
                <Link
                    to="/dashboard"
                    className="flex items-center justify-center w-full py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] text-zinc-300 transition-all text-xs font-black uppercase tracking-widest shadow-sm"
                >
                    Exit to App
                </Link>
            </div>
        </aside>
    );
}
