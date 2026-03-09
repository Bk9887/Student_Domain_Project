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
        `http://localhost:5000/api/dashboard/${currentUser._id}`,
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
    <div className="flex justify-end items-center p-6 relative z-50">
      <div className="flex items-center gap-6">

        {/* XP + Streak */}
        <div className="flex items-center gap-8 bg-white/10 backdrop-blur-lg 
          border border-white/20 px-8 py-4 rounded-full shadow-lg">
          <div className="flex items-center gap-3">
            <span className="bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full">XP</span>
            <span className="font-semibold text-lg">{points}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="font-semibold text-lg">{streak}</span>
          </div>
        </div>

        {/* Profile */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-white/10 
              border border-white/20 px-3 py-2 rounded-lg"
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle size={36} className="text-gray-200" />
            )}
            <span>▾</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-44 
              bg-gray-900 border border-white/10 rounded-xl shadow-xl 
              overflow-hidden z-50">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-3 hover:bg-white/10"
              >
                Profile
              </button>
              <button
                onClick={() => navigate("/about")}
                className="w-full text-left px-4 py-3 hover:bg-white/10"
              >
                About Us
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full text-left px-4 py-3 hover:bg-white/10"
              >
                Contact Us
              </button>
              <button
                onClick={() => navigate("/help")}
                className="w-full text-left px-4 py-3 hover:bg-white/10"
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