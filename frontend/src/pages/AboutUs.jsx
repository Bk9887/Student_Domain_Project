import React from "react";

export default function AboutUs() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0f2f] to-[#2a1b4d] text-white overflow-hidden">

      {/* Glow Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Page Content */}
      <div className="relative max-w-4xl mx-auto space-y-8 pb-12 pt-10 px-4">

        <h1 className="text-4xl font-bold mb-4 text-white text-center">About Us</h1>

        {/* App Overview */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-2">Our App</h2>
          <p className="text-white/70">
            The Student Domain Guidance App is designed to help students explore,
            select, and track their preferred career domains. From learning resources
            to progress tracking and personalized recommendations, our app guides
            students in building a strong roadmap for their academic and professional journey.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
          <p className="text-white/70">
            Our mission is to empower students by providing clear guidance on
            career paths, helping them make informed decisions, and tracking
            progress in a simple, interactive way.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
          <p className="text-white/70">
            We envision a world where every student can easily find and follow
            a path aligned with their skills and interests, reducing uncertainty
            and building confidence in their future.
          </p>
        </div>

        {/* Team */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-2">Meet the Team</h2>
          <ul className="list-disc list-inside text-white/70 space-y-1">
            <li>Boomika Bhushan – Project Lead</li>
            <li>Jane Doe – UI/UX Designer</li>
            <li>John Smith – Backend Developer</li>
            <li>Emily Lee – Frontend Developer</li>
          </ul>
        </div>

      </div>
    </div>
  );
}