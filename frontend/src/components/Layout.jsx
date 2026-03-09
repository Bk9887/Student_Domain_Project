import Sidebar from "./Sidebar";
import Navbar from "../components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen flex text-white overflow-hidden">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#1e40af]" />

      {/* Glow Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Content Wrapper */}
      <div className="relative z-10 flex w-full">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">

          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <div className="p-10">
            {children}
          </div>

        </div>

      </div>
    </div>
  );
}
