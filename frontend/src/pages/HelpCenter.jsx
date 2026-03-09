import React from "react";

export default function HelpCenter() {
  const faqs = [
    {
      question: "How do I select a domain?",
      answer: "Go to the Dashboard and click on 'Choose a Domain' to select your preferred domain."
    },
    {
      question: "How can I track my progress?",
      answer: "Your progress is displayed on your Dashboard under the 'Progress' card."
    },
    {
      question: "How do I update my profile?",
      answer: "Visit the Profile page, make changes, and click 'Save Profile'."
    },
    {
      question: "Who can I contact for technical support?",
      answer: "Use the Contact page to reach out to our support team."
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0f2f] to-[#2a1b4d] text-white overflow-hidden">

      {/* Glow Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Page Content */}
      <div className="relative max-w-4xl mx-auto space-y-8 pb-12 pt-10 px-4">

        <h1 className="text-4xl font-bold mb-6 text-white text-center">Help Center</h1>

        {/* FAQs */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 rounded-xl bg-white/10">
              <p className="font-semibold text-white">{faq.question}</p>
              <p className="text-white/70 mt-1">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
          <p className="text-white/70 mb-2">
            If you need further help, you can reach out to our support team via the Contact page.
          </p>
          <button
            className="px-6 py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-indigo-700 hover:to-purple-700 transition"
          >
            Go to Contact Page
          </button>
        </div>

        {/* Guides */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Guides & Tutorials</h2>
          <ul className="list-disc list-inside text-white/70 space-y-1">
            <li>Getting Started with Your Domain</li>
            <li>Tracking Your Progress Efficiently</li>
            <li>Profile Management Tips</li>
            <li>Using the Dashboard Effectively</li>
          </ul>
        </div>

      </div>
    </div>
  );
}