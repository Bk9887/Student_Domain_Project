export default function BentoCard({ className = "", children, onClick, magnetic = false }) {
  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      className={`rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-xl hover:bg-white/[0.05] transition-all group ${className}`}
    >
      {children}
    </div>
  );
}
