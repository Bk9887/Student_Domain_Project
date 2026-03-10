import { motion } from "framer-motion";

export default function GlowButton({ children, onClick, variant = "primary", className = "" }) {
    const baseStyles = "relative inline-flex items-center justify-center px-8 py-3.5 font-bold transition-all duration-300 rounded-xl overflow-hidden group outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f111a]";

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]",
        secondary: "bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 border border-white/10 focus:ring-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
    };

    const glows = {
        primary: "from-blue-400 via-cyan-400 to-blue-400",
        secondary: "from-white/20 via-white/10 to-transparent"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
        >
            <span className={`absolute inset-0 w-[200%] h-full bg-gradient-to-r ${glows[variant] || glows.primary} opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-[pulse_3s_ease-in-out_infinite]`} />
            <span className="relative tracking-wide">{children}</span>
        </motion.button>
    );
}
