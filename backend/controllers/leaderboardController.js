const User = require("../models/user");

exports.getLeaderboard = async (req, res) => {
  try {
    const { domain } = req.query;

    if (!domain) {
      return res.status(400).json({ message: "Domain is required" });
    }

    // Get ALL users who selected this domain
    const users = await User.find({ domain });

    const leaderboard = users
      .map((user) => {
        const dp = user.domainProgress.find((d) => d.domain === domain);

        return {
          _id: user._id,
          name: user.name,
          domain: user.domain,
          progress: dp?.progress || 0,
          points: dp?.points || 0,
        };
      })
      .sort((a, b) => b.points - a.points); // sort by points

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};