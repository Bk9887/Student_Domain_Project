import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState(
    JSON.parse(localStorage.getItem("currentUser"))?.photo || null
  );

  const dropdownRef = useRef();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Fetch XP and streak
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/dashboard/${currentUser._id}?t=${Date.now()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPoints(res.data.points);
      setStreak(res.data.streak);
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Update stats on roadmap update
  useEffect(() => {
    const handleUpdate = () => fetchStats();
    window.addEventListener("roadmapUpdated", handleUpdate);
    return () => window.removeEventListener("roadmapUpdated", handleUpdate);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for profile photo updates
  useEffect(() => {
    const handlePhotoUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem("currentUser"));
      setProfilePhoto(updatedUser.photo || null);
    };
    window.addEventListener("profilePhotoUpdated", handlePhotoUpdate);
    return () => window.removeEventListener("profilePhotoUpdated", handlePhotoUpdate);
  }, []);

  return (
    <div className="flex justify-end items-center pb-6 relative z-50">
      <div className="flex items-center gap-6">

        {/* XP + Streak */}
        <div className="flex items-center gap-6 bg-white/[0.03] backdrop-blur-xl 
          border border-white/[0.08] px-6 py-2.5 rounded-full shadow-xl">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-zinc-950 text-xs font-bold px-2.5 py-0.5 rounded-full">XP</span>
            <span className="font-medium text-zinc-100">{points}</span>
          </div>
          <div className="w-px h-5 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <span className="font-medium text-zinc-100">{streak}</span>
          </div>
        </div>

        {/* Profile */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl
              border border-white/[0.08] px-3 py-2 rounded-xl transition-all hover:bg-white/[0.06] shadow-xl"
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle size={32} className="text-zinc-400" />
            )}
            <span className="text-zinc-400 text-xs">▾</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-48 
              bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl 
              overflow-hidden z-50 font-medium text-sm">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => navigate("/about")}
                className="w-full text-left px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors border-t border-white/5"
              >
                About Us
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full text-left px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors border-t border-white/5"
              >
                Contact Us
              </button>
              <button
                onClick={() => navigate("/help")}
                className="w-full text-left px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors border-t border-white/5"
              >
                Help Center
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}