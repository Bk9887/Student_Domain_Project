const User = require("../models/user");

// GET logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(req.user);
  } catch (err) {
    console.error("GET profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE logged-in user profile
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { phone, parentPhone, address, github, photo } = req.body;

    if (phone !== undefined) req.user.phone = phone;
    if (parentPhone !== undefined) req.user.parentPhone = parentPhone;
    if (address !== undefined) req.user.address = address;
    if (github !== undefined) req.user.github = github;
    if (photo !== undefined) req.user.photo = photo;

    const updatedUser = await req.user.save();

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("UPDATE profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};