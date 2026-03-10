const User = require("../models/user");

exports.updateUserDomain = async (req, res) => {
  try {
    const { userId } = req.params;
    const { domain } = req.body;

    if (!domain) return res.status(400).json({ message: "Domain is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.domain = domain;

    // Check if progress exists for this domain so the user appears on Leaderboard immediately
    const domainExists = user.domainProgress.find(d => d.domain === domain);
    if (!domainExists) {
      user.domainProgress.push({
        domain: domain,
        progress: 0,
        points: 0
      });
    }

    await user.save();

    res.json({ message: "Domain updated successfully", domain });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};