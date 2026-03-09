// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  // Fetch logged-in user profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/profile/${currentUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle profile photo upload
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedProfile = { ...profile, photo: reader.result };
      setProfile(updatedProfile);

      // Update localStorage immediately
      const updatedUser = { ...currentUser, photo: reader.result };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Dispatch event for Navbar
      window.dispatchEvent(new Event("profilePhotoUpdated"));
    };
    reader.readAsDataURL(file);
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/profile/${currentUser._id}`,
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Profile update response:", res);

      // Update localStorage for Navbar sync
      const updatedUser = { ...currentUser, photo: profile.photo };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Dispatch event for Navbar
      window.dispatchEvent(new Event("profilePhotoUpdated"));

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0f2f] to-[#2a1b4d] text-white overflow-hidden">
      {/* Glow Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Page Content */}
      <div className="relative max-w-3xl mx-auto space-y-6 pb-6 pt-10 px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Profile</h1>

        {/* Profile Photo */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full">
          <p className="text-white/70 mb-4 font-semibold">Profile Photo</p>
          <div className="flex items-center gap-6">
            <img
              src={profile.photo || "https://i.imgur.com/HeIi0wU.png"}
              className="w-28 h-28 rounded-full object-cover border border-white/20"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="text-white"
            />
          </div>
        </div>

        {/* Student Contact */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full">
          <p className="text-white/70 mb-4 font-semibold">Student Contact</p>
          <input
            name="phone"
            value={profile.phone || ""}
            onChange={handleChange}
            placeholder="Student Phone Number"
            className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
          />
        </div>

        {/* Parent / Guardian Contact */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full">
          <p className="text-white/70 mb-4 font-semibold">
            Parent / Guardian Contact
          </p>
          <input
            name="parentPhone"
            value={profile.parentPhone || ""}
            onChange={handleChange}
            placeholder="Parent Phone Number"
            className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
          />
        </div>

        {/* Address */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full">
          <p className="text-white/70 mb-4 font-semibold">Address</p>
          <textarea
            name="address"
            value={profile.address || ""}
            onChange={handleChange}
            placeholder="Enter Address"
            className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
          />
        </div>

        {/* GitHub */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full">
          <p className="text-white/70 mb-4 font-semibold">GitHub Repository</p>
          <input
            name="github"
            value={profile.github || ""}
            onChange={handleChange}
            placeholder="GitHub Repository Link"
            className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-xl font-semibold text-white
          bg-gradient-to-r from-indigo-600 to-purple-600
          hover:from-indigo-700 hover:to-purple-700 transition w-full"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}