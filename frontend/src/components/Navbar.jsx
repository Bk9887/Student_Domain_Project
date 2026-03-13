import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../utils/api';
import { FaUserCircle } from "react-icons/fa";

export default function Navbar({ onMenuClick }) {
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
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const authToken = localStorage.getItem("token");

    if (!user?._id || !authToken) return;

    try {
      const res = await axios.get(
        `${API_BASE_URL}/dashboard/${user._id}?t=${Date.now()}`,
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
    <div className="flex justify-between lg:justify-end items-center px-3 md:px-4 py-2 relative z-40">
      {/* Hamburger Menu - Only Mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2.5 rounded-xl bg-[#153052]/80 border border-sky-100/20 text-sky-100 hover:text-white transition-all shadow-xl"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <div className="flex items-center gap-3 lg:gap-4">

        {/* XP + Streak */}
        <div className="flex items-center gap-4 lg:gap-5 bg-[#132b4b]/80 backdrop-blur-xl 
          border border-sky-100/20 px-4 lg:px-5 py-2.5 rounded-full shadow-xl">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 text-slate-900 text-[10px] lg:text-xs font-black px-2 py-0.5 rounded-full uppercase">XP</span>
            <span className="font-extrabold text-slate-100 text-sm lg:text-base">{points}</span>
          </div>
          <div className="w-px h-5 bg-sky-100/20 hidden xs:block"></div>
          <div className="flex items-center gap-2">
            <span className="text-base lg:text-lg">🔥</span>
            <span className="font-extrabold text-slate-100 text-sm lg:text-base">{streak}</span>
          </div>
        </div>

        {/* Profile */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-[#132b4b]/80 backdrop-blur-xl
              border border-sky-100/20 px-3 py-2 rounded-xl transition-all hover:bg-[#1b3b64] shadow-xl"
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle size={32} className="text-sky-200/80" />
            )}
            <span className="text-sky-200/80 text-xs">▾</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-48 
              bg-[#0c1e38]/95 backdrop-blur-xl border border-sky-100/20 rounded-xl shadow-2xl 
              overflow-hidden z-50 font-medium text-sm">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-3 text-sky-100/90 hover:text-white hover:bg-white/10 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => navigate("/about")}
                className="w-full text-left px-4 py-3 text-sky-100/90 hover:text-white hover:bg-white/10 transition-colors border-t border-sky-100/10"
              >
                About Us
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full text-left px-4 py-3 text-sky-100/90 hover:text-white hover:bg-white/10 transition-colors border-t border-sky-100/10"
              >
                Contact Us
              </button>
              <button
                onClick={() => navigate("/help")}
                className="w-full text-left px-4 py-3 text-sky-100/90 hover:text-white hover:bg-white/10 transition-colors border-t border-sky-100/10"
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