const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

// GET logged-in user profile
router.get("/", authMiddleware, profileController.getProfile);

// UPDATE logged-in user profile
router.put("/", authMiddleware, profileController.updateProfile);

module.exports = router;