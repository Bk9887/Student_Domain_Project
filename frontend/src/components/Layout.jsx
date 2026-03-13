import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../components/Navbar";

export default function Layout({ children, appConfig }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const scrollRef = useRef(null);

  // Reset scroll to top on route change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="relative min-h-screen flex text-white overflow-hidden bg-zinc-950 font-sans selection:bg-indigo-500/30 transition-colors duration-300">

      {/* Glow Orbs */}
      <div className="orb orb-1 opacity-100" />
      <div className="orb orb-2 opacity-100" />
      <div className="orb orb-3 opacity-100" />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        appConfig={appConfig}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Content Wrapper */}
      <div className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden">

        {/* Navbar Section - Persistent */}
        <div className="z-40">
          <div className="p-4 lg:p-0 lg:pt-6 lg:pr-10">
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto w-full scroll-smooth"
        >
          {/* Page Content */}
          <div className="px-5 pb-20 lg:p-10 lg:pt-0 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
