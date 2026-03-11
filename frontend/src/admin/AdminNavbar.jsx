import { MdNotifications, MdAccountCircle } from "react-icons/md";

export default function AdminNavbar({ adminName, onLogout }) {
    return (
        <header className="h-16 bg-zinc-950/50 backdrop-blur-xl border-b border-white/[0.05] flex items-center justify-between px-8 fixed top-0 w-[calc(100%-16rem)] right-0 z-40 transition-all duration-300">

            {/* Dynamic Title Context */}
            <div className="flex items-center">
                <h1 className="text-lg font-black tracking-tight text-white uppercase italic">
                    <span className="text-indigo-500 mr-2">Admin</span> Console
                </h1>
            </div>

            {/* Right User Controls */}
            <div className="flex items-center space-x-6">

                {/* Mock Notifications */}
                <button className="relative text-zinc-400 hover:text-indigo-400 transition-all transform hover:scale-110 active:scale-95">
                    <MdNotifications className="text-2xl" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"></span>
                </button>

                {/* User Profile Dropdown */}
                <div className="flex items-center border-l pl-6 border-white/[0.05]">
                    <div className="flex items-center space-x-3 cursor-pointer group">
                        <div className="h-10 w-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 font-black border border-indigo-500/20 group-hover:bg-indigo-600/20 transition-all duration-300 shadow-inner">
                            {adminName?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white leading-tight tracking-tight">
                                {adminName || "Administrator"}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">
                                Super Admin
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="ml-6 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-rose-400 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-rose-500/10 hover:border-rose-500/20 transition-all duration-300"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </header>
    );
}
