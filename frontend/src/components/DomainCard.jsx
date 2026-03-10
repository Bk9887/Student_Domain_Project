export default function DomainCard({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]
      rounded-2xl p-6 cursor-pointer
      hover:bg-white/[0.06] hover:border-indigo-500/50 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-indigo-500/20 group"
    >
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>

      <p className="text-zinc-400 text-sm leading-relaxed">
        {description}
      </p>

      <button
        className="mt-6 w-full py-2.5 rounded-xl text-sm font-medium text-white
        bg-white/[0.05] border border-white/[0.05]
        group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all duration-300"
      >
        Explore
      </button>
    </div>
  );
}