export default function BentoCard({ className = "", children, onClick, magnetic = false, accentColor = "indigo" }) {
  const colorMap = {
    indigo: "bg-[#4f7cff] shadow-[0_0_20px_#4f7cff]",
    emerald: "bg-[#2fb9a9] shadow-[0_0_20px_#2fb9a9]",
    amber: "bg-[#f4b400] shadow-[0_0_20px_#f4b400]",
    rose: "bg-[#ff6e5e] shadow-[0_0_20px_#ff6e5e]",
    cyan: "bg-[#57d5ff] shadow-[0_0_20px_#57d5ff]",
    violet: "bg-[#b2a0ff] shadow-[0_0_20px_#b2a0ff]",
    "cyber-lime": "bg-[#ccff00] shadow-[0_0_20px_#ccff00]",
  };

  const style = colorMap[accentColor] || colorMap.indigo;

  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      className={`relative rounded-2xl panel hover:bg-[#193863]/80 transition-all group overflow-hidden ${className} hover:scale-[1.01] hover:shadow-2xl active:scale-[0.99] duration-300`}
    >
      {/* Coloured Surrounding (Top Bar Glow) */}
      <div className={`absolute top-0 left-0 w-full h-[3px] opacity-40 group-hover:opacity-100 transition-all duration-500 ${style}`}></div>

      {children}
    </div>
  );
}
