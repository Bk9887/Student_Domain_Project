const express = require("express");
const router = express.Router();
const { getRoadmapByDomain, getRoadmapVideos } = require("../controllers/roadmapController");

router.get("/:domain", getRoadmapByDomain);
router.get("/:domain/videos", getRoadmapVideos);

module.exports = router;