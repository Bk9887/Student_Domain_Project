const express = require("express");
const router = express.Router();
const {
  getDashboard,
  updateProgress,
  changeDomain,
  getRoadmapProgress,
  saveResume,
  getResumes,
  savePortfolio,
  getPortfolios
} = require("../controllers/dashboardController");

// GET dashboard data for a user
router.get("/:userId", getDashboard);

// POST update progress for a domain
router.post("/:userId", updateProgress);

// PUT change selected domain
router.put("/:userId/domain", changeDomain);

// GET specific Roadmap progress
router.get("/progress/:userId/:domain", getRoadmapProgress);

// POST save a resume snapshot
router.post("/:userId/resumes", saveResume);

// GET all saved resumes
router.get("/:userId/resumes", getResumes);

// POST save a portfolio snapshot
router.post("/:userId/portfolios", savePortfolio);

// GET all saved portfolios
router.get("/:userId/portfolios", getPortfolios);

module.exports = router;