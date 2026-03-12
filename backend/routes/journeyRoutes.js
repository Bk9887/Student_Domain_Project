const express = require("express");
const router = express.Router();
const journeyController = require("../controllers/journeyController");
const protect = require("../middleware/authMiddleware");

// Stats for the overview (charts/totals)
router.get("/stats/:userId", protect, journeyController.getJourneyData);

// List of all started domains
router.get("/my-journeys/:userId", protect, journeyController.getMyJourneys);

// Start or resume a journey
router.post("/start", protect, journeyController.startJourney);

// Delete a journey
router.delete("/:userId/:domain", protect, journeyController.deleteJourney);

module.exports = router;
