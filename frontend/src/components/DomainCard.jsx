export default function DomainCard({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white/5 backdrop-blur-xl border border-white/10
      rounded-2xl p-6 cursor-pointer
      hover:bg-white/10 transition duration-300 shadow-lg"
    >
      <h3 className="text-xl font-semibold text-white mb-3">
        {title}
      </h3>

      <p className="text-blue-200 text-sm">
        {description}
      </p>

      <button
        className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold text-white
        bg-gradient-to-r from-indigo-600 to-blue-600
        hover:from-indigo-700 hover:to-blue-700 transition"
      >
        Explore
      </button>
    </div>
  );
}