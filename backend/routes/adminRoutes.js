const express = require("express");
const router = express.Router();

const {
    getStats, getUsers, getConfig, updateConfig,
    deleteUser, getDomains, createDomain, updateDomain, deleteDomain,
    updateRoadmap, getFeedback, resolveFeedback
} = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const { adminAuth } = require("../middleware/adminAuth");

// Public (so ANY user can read it on mount to hide/show features globally)
router.get("/config", getConfig);
router.get("/domains", getDomains); // Needs to be public for Student app to fetch

// Protected Admin Routes
router.put("/config", protect, adminAuth, updateConfig);
router.get("/stats", protect, adminAuth, getStats);
router.get("/users", protect, adminAuth, getUsers);
router.delete("/users/:id", protect, adminAuth, deleteUser);

router.post("/domains", protect, adminAuth, createDomain);
router.put("/domains/:id", protect, adminAuth, updateDomain);
router.delete("/domains/:id", protect, adminAuth, deleteDomain);

router.put("/roadmaps/:domainId", protect, adminAuth, updateRoadmap);

router.get("/feedback", protect, adminAuth, getFeedback);
router.put("/feedback/:id/resolve", protect, adminAuth, resolveFeedback);

module.exports = router;
