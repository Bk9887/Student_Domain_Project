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

export default function AdminSidebar() {
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
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#07162e]/95 backdrop-blur-xl text-sky-100/75 border-r border-sky-100/15 flex flex-col z-50 transition-all duration-300">
            {/* Brand Header */}
            <div className="h-16 flex items-center px-6 border-b border-sky-100/15 bg-[#0b1d39]/30">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-300 to-cyan-300 flex items-center justify-center shadow-[0_0_15px_rgba(47,185,169,0.4)] mr-3">
                    <FaLaptopCode className="text-[#09233e] text-lg" />
                </div>
                <span className="text-slate-100 font-black text-xl tracking-tight">Hub<span className="text-emerald-300">CMS</span></span>
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
                            className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
                                ? "bg-gradient-to-r from-emerald-300/20 to-cyan-300/10 text-slate-100 shadow-[inset_0_0_10px_rgba(47,185,169,0.15)] border border-emerald-200/20"
                                : "hover:bg-white/10 hover:text-slate-50 border border-transparent"
                                }`}
                        >
                            <span className={`text-xl mr-3 ${isActive ? "text-emerald-200" : "text-sky-100/45"}`}>{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Return to App Button */}
            <div className="p-4 border-t border-sky-100/15 bg-[#0b1d39]/30">
                <Link
                    to="/dashboard"
                    className="flex items-center justify-center w-full py-3 px-4 rounded-xl bg-white/10 border border-sky-100/20 hover:bg-white/15 text-slate-100 transition-all text-xs font-black uppercase tracking-widest shadow-sm"
                >
                    Exit to App
                </Link>
            </div>
        </aside>
    );
}
