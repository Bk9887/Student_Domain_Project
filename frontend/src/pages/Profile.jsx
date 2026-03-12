// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile({ ...profile, photo: reader.result });
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/profile",
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local storage so Navbar has the latest photo
      const existingUser = JSON.parse(localStorage.getItem("currentUser"));
      if (existingUser) {
        const updatedUser = { ...existingUser, photo: profile.photo };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }

      // Dispatch event to trigger Navbar update
      window.dispatchEvent(new Event("profilePhotoUpdated"));

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen relative text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10 mt-10">

        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white via-indigo-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-sm transition-all duration-300">Builder Profile</h1>

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Profile Photo */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-6 text-center transition-all">
            <img
              src={profile.photo || "https://i.imgur.com/HeIi0wU.png"}
              className="w-32 h-32 mx-auto rounded-full object-cover border border-zinc-800"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="mt-4"
            />
          </div>

          {/* Student Information */}
          <div className="md:col-span-2 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 transition-all">

            <h2 className="text-xl font-bold mb-6 text-indigo-100 tracking-tight">Student Information</h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                name="studentName"
                value={profile.studentName || ""}
                onChange={handleChange}
                placeholder="Student Name"
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner"
              />

              <input
                name="studentEmail"
                value={profile.studentEmail || ""}
                onChange={handleChange}
                placeholder="Student Email"
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner"
              />

              <input
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                placeholder="Student Phone"
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner"
              />

              <input
                name="college"
                value={profile.college || ""}
                onChange={handleChange}
                placeholder="College"
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner"
              />

            </div>

          </div>

        </div>

        {/* PARENT INFORMATION */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 transition-all">

          <h2 className="text-xl font-bold mb-6 text-indigo-100 tracking-tight">
            Parent / Guardian Information
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              name="parentName"
              value={profile.parentName || ""}
              onChange={handleChange}
              placeholder="Parent Name"
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner"
            />

            <input
              name="parentEmail"
              value={profile.parentEmail || ""}
              onChange={handleChange}
              placeholder="Parent Email"
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner"
            />

            <input
              name="parentPhone"
              value={profile.parentPhone || ""}
              onChange={handleChange}
              placeholder="Parent Phone"
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner"
            />

          </div>

        </div>

        {/* ADDRESS */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 transition-all">

          <h2 className="text-xl font-bold mb-6 text-indigo-100 tracking-tight">Address</h2>

          <textarea
            name="address"
            value={profile.address || ""}
            onChange={handleChange}
            placeholder="Enter Address"
            rows="3"
            className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner resize-none"
          />

        </div>

        {/* PROFESSIONAL LINKS */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 transition-all">

          <h2 className="text-xl font-bold mb-6 text-indigo-100 tracking-tight">Professional Links</h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              name="github"
              value={profile.github || ""}
              onChange={handleChange}
              placeholder="GitHub Profile URL"
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner"
            />

            <input
              name="linkedin"
              value={profile.linkedin || ""}
              onChange={handleChange}
              placeholder="LinkedIn Profile URL"
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner"
            />

            <input
              name="portfolio"
              value={profile.portfolio || ""}
              onChange={handleChange}
              placeholder="Portfolio Website"
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-zinc-500 transition-all shadow-inner"
            />

          </div>

        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-xl font-medium shadow-lg shadow-indigo-500/20
            bg-indigo-600 border border-indigo-500
            hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300 text-lg"
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}