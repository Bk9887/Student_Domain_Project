import React from "react";

export default function AboutUs() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden transition-colors">

      {/* Page Content */}
      <div className="relative max-w-4xl mx-auto space-y-8 pb-12 pt-10 px-4">

        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 tracking-tighter bg-gradient-to-br from-white via-indigo-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-sm transition-colors">Our Story</h1>

        {/* App Overview */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 transition-colors">
          <h2 className="text-2xl font-bold mb-4 text-indigo-300 tracking-tight transition-colors">The Hub</h2>
          <p className="text-zinc-400 leading-relaxed transition-colors">
            The Student Domain Guidance App is designed to help students explore,
            select, and track their preferred career domains. From learning resources
            to progress tracking and personalized recommendations, our app guides
            students in building a strong roadmap for their academic and professional journey.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 transition-colors">
          <h2 className="text-2xl font-bold mb-4 text-indigo-300 tracking-tight transition-colors">Our Mission</h2>
          <p className="text-zinc-400 leading-relaxed transition-colors">
            Our mission is to empower students by providing clear guidance on
            career paths, helping them make informed decisions, and tracking
            progress in a simple, interactive way.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 transition-colors">
          <h2 className="text-2xl font-bold mb-4 text-indigo-300 tracking-tight transition-colors">Our Vision</h2>
          <p className="text-zinc-400 leading-relaxed transition-colors">
            We envision a world where every student can easily find and follow
            a path aligned with their skills and interests, reducing uncertainty
            and building confidence in their future.
          </p>
        </div>

        {/* Team */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 transition-colors">
          <h2 className="text-2xl font-bold mb-4 text-indigo-300 tracking-tight transition-colors">Meet the Architects</h2>
          <ul className="list-disc list-inside text-zinc-400 space-y-2 transition-colors">
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