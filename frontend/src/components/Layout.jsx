import Sidebar from "./Sidebar";
import Navbar from "../components/Navbar";

export default function Layout({ children, appConfig }) {
  return (
    <div className="relative min-h-screen flex text-white overflow-hidden bg-zinc-950 font-sans selection:bg-indigo-500/30 transition-colors duration-300">

      {/* Glow Orbs */}
      <div className="orb orb-1 opacity-100" />
      <div className="orb orb-2 opacity-100" />
      <div className="orb orb-3 opacity-100" />

      {/* Content Wrapper */}
      <div className="relative z-10 flex w-full">

        {/* Sidebar */}
        <Sidebar appConfig={appConfig} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto">

          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <div className="p-10 max-w-7xl mx-auto w-full">
            {children}
          </div>

        </div>

      </div>
    </div>
  );
}
