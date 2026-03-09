const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/auth");

// GET logged-in user profile
router.get("/", authMiddleware, profileController.getProfile);

// PUT update logged-in user profile
router.put("/:id", authMiddleware, profileController.updateProfile);

module.exports = router;