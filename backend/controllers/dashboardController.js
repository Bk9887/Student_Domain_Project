const User = require("../models/user");

// Get dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const selectedDomain = user.domain || "Not Selected";

    let progress = 0;
    let points = 0;

    const domainData = user.domainProgress.find(
      (d) => d.domain === selectedDomain
    );

    if (domainData) {
      progress = domainData.progress;
      points = domainData.points;
    }

    const allUsers = await User.find({ domain: selectedDomain });

    const leaderboard = allUsers
      .map((u) => {
        const dp = u.domainProgress.find(
          (d) => d.domain === selectedDomain
        );

        return {
          id: u._id.toString(),
          points: dp ? dp.points : 0,
        };
      })
      .sort((a, b) => b.points - a.points);

    const rankIndex = leaderboard.findIndex((u) => u.id === userId);

    const rank = rankIndex !== -1 ? `#${rankIndex + 1}` : "—";

    res.json({
      selectedDomain,
      progress,
      points,
      rank,
      streak: user.streak,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update progress
exports.updateProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { domain, progress } = req.body;

    if (!domain)
      return res.status(400).json({ message: "Domain is required" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    let domainData = user.domainProgress.find(
      (d) => d.domain === domain
    );

    const points = Math.round(progress * 10);

    if (domainData) {
      domainData.progress = progress;
      domainData.points = points;
    } else {
      user.domainProgress.push({
        domain,
        progress,
        points,
      });
    }

    user.domain = domain;

    // 🔥 STREAK CALCULATION
    const today = new Date();
    today.setHours(0,0,0,0);

    const lastActive = user.lastActiveDate
      ? new Date(user.lastActiveDate)
      : null;

    if (!lastActive) {
      user.streak = 1;
    } else {
      lastActive.setHours(0,0,0,0);

      const diffDays = Math.floor(
        (today - lastActive) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        user.streak += 1;
      } 
      else if (diffDays > 1) {
        user.streak = 1;
      }
    }

    user.lastActiveDate = today;

    await user.save();

    res.json({ message: "Progress updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Change domain
exports.changeDomain = async (req, res) => {
  try {
    const { userId } = req.params;
    const { domain } = req.body;

    if (!domain)
      return res.status(400).json({ message: "Domain required" });

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.domain = domain;

    await user.save();

    res.json({
      message: "Domain updated",
      domain: user.domain,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};