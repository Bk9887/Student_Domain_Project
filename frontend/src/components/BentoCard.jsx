export default function BentoCard({ className = "", children, onClick, magnetic = false, accentColor = "indigo" }) {
  const colorMap = {
    indigo: "bg-indigo-500 shadow-[0_0_20px_#6366f1]",
    emerald: "bg-emerald-500 shadow-[0_0_20px_#10b981]",
    amber: "bg-amber-500 shadow-[0_0_20px_#f59e0b]",
    rose: "bg-rose-500 shadow-[0_0_20px_#f43f5e]",
    cyan: "bg-cyan-500 shadow-[0_0_20px_#06b6d4]",
    violet: "bg-violet-500 shadow-[0_0_20px_#8b5cf6]",
    "cyber-lime": "bg-[#ccff00] shadow-[0_0_20px_#ccff00]",
  };

  const style = colorMap[accentColor] || colorMap.indigo;

  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      className={`relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl hover:bg-white/[0.05] transition-all group overflow-hidden ${className} hover:scale-[1.01] hover:shadow-2xl active:scale-[0.99]`}
    >
      {/* Coloured Surrounding (Top Bar Glow) */}
      <div className={`absolute top-0 left-0 w-full h-[2px] opacity-40 group-hover:opacity-100 transition-all duration-500 ${style}`}></div>

      {children}
    </div>
  );
}
