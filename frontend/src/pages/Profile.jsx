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

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f2f] to-[#2a1b4d] text-white p-8">

      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold">Profile</h1>

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Profile Photo */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <img
              src={profile.photo || "https://i.imgur.com/HeIi0wU.png"}
              className="w-32 h-32 mx-auto rounded-full object-cover border"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="mt-4"
            />
          </div>

          {/* Student Information */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">

            <h2 className="text-xl font-semibold mb-4">Student Information</h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                name="studentName"
                value={profile.studentName || ""}
                onChange={handleChange}
                placeholder="Student Name"
                className="p-3 rounded bg-white/10"
              />

              <input
                name="studentEmail"
                value={profile.studentEmail || ""}
                onChange={handleChange}
                placeholder="Student Email"
                className="p-3 rounded bg-white/10"
              />

              <input
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                placeholder="Student Phone"
                className="p-3 rounded bg-white/10"
              />

              <input
                name="college"
                value={profile.college || ""}
                onChange={handleChange}
                placeholder="College"
                className="p-3 rounded bg-white/10"
              />

            </div>

          </div>

        </div>

        {/* PARENT INFORMATION */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">

          <h2 className="text-xl font-semibold mb-4">
            Parent / Guardian Information
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              name="parentName"
              value={profile.parentName || ""}
              onChange={handleChange}
              placeholder="Parent Name"
              className="p-3 rounded bg-white/10"
            />

            <input
              name="parentEmail"
              value={profile.parentEmail || ""}
              onChange={handleChange}
              placeholder="Parent Email"
              className="p-3 rounded bg-white/10"
            />

            <input
              name="parentPhone"
              value={profile.parentPhone || ""}
              onChange={handleChange}
              placeholder="Parent Phone"
              className="p-3 rounded bg-white/10"
            />

          </div>

        </div>

        {/* ADDRESS */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">

          <h2 className="text-xl font-semibold mb-4">Address</h2>

          <textarea
            name="address"
            value={profile.address || ""}
            onChange={handleChange}
            placeholder="Enter Address"
            className="w-full p-3 rounded bg-white/10"
          />

        </div>

        {/* PROFESSIONAL LINKS */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">

          <h2 className="text-xl font-semibold mb-4">Professional Links</h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              name="github"
              value={profile.github || ""}
              onChange={handleChange}
              placeholder="GitHub"
              className="p-3 rounded bg-white/10"
            />

            <input
              name="linkedin"
              value={profile.linkedin || ""}
              onChange={handleChange}
              placeholder="LinkedIn"
              className="p-3 rounded bg-white/10"
            />

            <input
              name="portfolio"
              value={profile.portfolio || ""}
              onChange={handleChange}
              placeholder="Portfolio"
              className="p-3 rounded bg-white/10"
            />

          </div>

        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl font-semibold
          bg-gradient-to-r from-indigo-600 to-purple-600
          hover:from-indigo-700 hover:to-purple-700"
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}