const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const User = require("../models/user");

// Get profile
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// Update points
router.put("/points", protect, async (req, res) => {
  try {
    const { points } = req.body;

    if (typeof points !== "number") {
      return res.status(400).json({ message: "Points must be a number" });
    }

    const user = await User.findById(req.user._id);
    user.points += points;

    await user.save();

    res.json({
      message: "Points updated",
      totalPoints: user.points
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;