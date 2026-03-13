export default function DomainCard({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="panel
      rounded-2xl p-6 cursor-pointer
      hover:bg-[#18365f]/80 hover:border-emerald-200/40 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0_20px_30px_rgba(47,185,169,0.2)] group"
    >
      <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-emerald-200 transition-colors">
        {title}
      </h3>

      <p className="text-sky-100/70 text-sm leading-relaxed">
        {description}
      </p>

      <button
        className="mt-6 w-full py-2.5 rounded-xl text-sm font-semibold text-slate-900
        bg-gradient-to-r from-emerald-300 to-cyan-300 border border-emerald-200/30
        group-hover:from-amber-300 group-hover:to-emerald-300 group-hover:shadow-[0_0_18px_rgba(47,185,169,0.35)] transition-all duration-300"
      >
        Explore
      </button>
    </div>
  );
}