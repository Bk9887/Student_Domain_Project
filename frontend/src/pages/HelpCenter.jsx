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
    <div className="relative min-h-screen text-white overflow-hidden">


      {/* Page Content */}
      <div className="relative max-w-4xl mx-auto space-y-8 pb-12 pt-10 px-4">

        <h1 className="text-4xl font-bold mb-6 text-white text-center">Help Center</h1>

        {/* FAQs */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.05] shadow-inner">
              <p className="font-semibold text-zinc-100">{faq.question}</p>
              <p className="text-zinc-400 mt-2 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
          <p className="text-zinc-400 mb-6">
            If you need further help, you can reach out to our support team via the Contact page.
          </p>
          <button
            className="px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-500/20
            bg-indigo-600 border border-indigo-500
            hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300"
          >
            Go to Contact Page
          </button>
        </div>

        {/* Guides */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Guides & Tutorials</h2>
          <ul className="list-disc list-inside text-zinc-400 space-y-2">
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