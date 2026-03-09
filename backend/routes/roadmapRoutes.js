const express = require("express");
const router = express.Router();
const { getRoadmapByDomain } = require("../controllers/roadmapController");

router.get("/:domain", getRoadmapByDomain);

module.exports = router;