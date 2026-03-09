import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const domainsData = [
  { id: 1, name: "Web Development", description: "Frontend, Backend, Full-Stack development" },
  { id: 2, name: "Data Science", description: "Python, ML, AI, Data Analysis" },
  { id: 3, name: "Cyber Security", description: "Ethical Hacking, Network Security" },
  { id: 4, name: "Mobile Development", description: "Flutter, React Native, Android, iOS" },
  { id: 5, name: "Cloud Computing", description: "AWS, Azure, DevOps" },
];

export default function DomainSelection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedDomain");
    if (saved) setSelectedDomain(saved);
  }, []);

  const handleSelect = async (domainName) => {
    setSelectedDomain(domainName);

    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/domain/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ domain: domainName }),
      });

      if (!res.ok) {
        throw new Error("Failed to update domain");
      }

      // ✅ Update local user
      const updatedUser = {
        ...user,
        domain: domainName,
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      localStorage.setItem("selectedDomain", domainName);

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Something went wrong while selecting the domain.");
    }
  };

  const filteredDomains = domainsData.filter((domain) =>
    domain.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="text-white px-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Popular Domains
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {filteredDomains.map((domain) => (
          <div
            key={domain.id}
            onClick={() => handleSelect(domain.name)}
            className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 transform
                        bg-white/5 backdrop-blur-xl border border-white/10
                        ${
                          selectedDomain === domain.name
                            ? "scale-105 ring-4 ring-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
                            : "hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:shadow-lg"
                        }`}
          >
            <h2 className="text-xl font-semibold mb-3 text-white group-hover:text-white">
              {domain.name}
            </h2>

            <p className="text-blue-200 text-sm group-hover:text-white/90">
              {domain.description}
            </p>

            {selectedDomain === domain.name && (
              <div className="mt-4 text-sm font-semibold text-white">
                ✓ Selected
              </div>
            )}
          </div>
        ))}
      </div>

      <h1 className="text-3xl font-bold text-center mb-4">
        Choose Your Domain
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search domain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-5 py-3 rounded-xl
                     bg-white/5 backdrop-blur-xl border border-white/10
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     text-white placeholder-gray-400"
        />
      </div>

      {filteredDomains.length === 0 && (
        <div className="mt-2 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-center text-red-300">
          Domain not found
        </div>
      )}
    </div>
  );
}