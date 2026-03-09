const express = require("express");
const router = express.Router();
const {
  getDashboard,
  updateProgress,
  changeDomain,
} = require("../controllers/dashboardController");

// GET dashboard data for a user
router.get("/:userId", getDashboard);

// POST update progress for a domain
router.post("/:userId", updateProgress);

// PUT change selected domain
router.put("/:userId/domain", changeDomain);

module.exports = router;