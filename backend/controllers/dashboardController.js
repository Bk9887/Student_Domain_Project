const User = require("../models/user");

// Get dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const selectedDomain = user.domain || "Not Selected";

    let progress = 0;
    // Base points includes the 50 point signup bonus + streak increments
    let points = user.points || 0;

    // Sum points from all domains for a global total
    user.domainProgress.forEach(d => {
      points += (d.points || 0);
    });

    const domainData = user.domainProgress.find(
      (d) => d.domain === selectedDomain
    );

    if (domainData) {
      progress = domainData.progress;
    }

    const allUsers = await User.find({ domain: selectedDomain });

    const leaderboard = allUsers
      .map((u) => {
        const dp = u.domainProgress.find(
          (d) => d.domain === selectedDomain
        );

        // Leaderboard MUST sort by compiled total score, not just domain score!
        const totalScore = (u.points || 0) + (dp ? dp.points : 0);

        return {
          id: u._id.toString(),
          points: totalScore,
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
    const { domain, progress, points, isRawPoints, completedVideos } = req.body;

    if (!domain)
      return res.status(400).json({ message: "Domain is required" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    let domainData = user.domainProgress.find(
      (d) => d.domain === domain
    );

    // If frontend sends new payload format (points and percentage explicitly)
    let earnedPoints = isRawPoints && points !== undefined ? points : Math.round((progress || 0) * 10);
    let progressPercentage = isRawPoints ? (progress || 0) : (progress || 0);

    // Failsafe sanitization against NaN corruption from older UI bugs
    if (isNaN(earnedPoints) || earnedPoints === null) earnedPoints = 0;
    if (isNaN(progressPercentage) || progressPercentage === null) progressPercentage = 0;

    if (domainData) {
      domainData.progress = progressPercentage;
      domainData.points = earnedPoints;
      if (completedVideos) domainData.completedVideos = completedVideos;
    } else {
      user.domainProgress.push({
        domain,
        progress: progressPercentage,
        points: earnedPoints,
        completedVideos: completedVideos || []
      });
    }

    user.domain = domain;

    // 🔥 STREAK CALCULATION AND BONUS
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = user.lastActiveDate
      ? new Date(user.lastActiveDate)
      : null;

    if (!lastActive) {
      user.streak = 1;
    } else {
      lastActive.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (today - lastActive) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        user.streak += 1;
        // Apply +5 global points for continuing a streak!
        user.points = (user.points || 0) + 5;
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

// Get strictly the completed videos array for Roadmap persistence
exports.getRoadmapProgress = async (req, res) => {
  try {
    const { userId, domain } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const domainData = user.domainProgress.find((d) => d.domain === domain);

    res.json({
      completedVideos: domainData && domainData.completedVideos ? domainData.completedVideos : []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching roadmap progress" });
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

// Save a new Resume
exports.saveResume = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, data } = req.body;

    if (!name || !data) return res.status(400).json({ message: "Resume name and data are required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.savedResumes.push({ name, data });
    await user.save();

    res.status(201).json({ message: "Resume saved successfully", resumes: user.savedResumes });
  } catch (error) {
    console.error("Resume Save Error:", error);
    res.status(500).json({ message: "Server error saving resume" });
  }
};

// Fetch all saved Resumes
exports.getResumes = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.savedResumes || []);
  } catch (error) {
    console.error("Resume Fetch Error:", error);
    res.status(500).json({ message: "Server error fetching resumes" });
  }
};

// Save a new Portfolio
exports.savePortfolio = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, data } = req.body;

    if (!name || !data) return res.status(400).json({ message: "Portfolio name and data are required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.savedPortfolios.push({ name, data });
    await user.save();

    res.status(201).json({ message: "Portfolio saved successfully", portfolios: user.savedPortfolios });
  } catch (error) {
    console.error("Portfolio Save Error:", error);
    res.status(500).json({ message: "Server error saving portfolio" });
  }
};

// Fetch all saved Portfolios
exports.getPortfolios = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.savedPortfolios || []);
  } catch (error) {
    console.error("Portfolio Fetch Error:", error);
    res.status(500).json({ message: "Server error fetching portfolios" });
  }
};