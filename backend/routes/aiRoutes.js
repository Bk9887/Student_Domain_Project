const express = require("express");
const router = express.Router();

const { domainAdvisor } = require("../controllers/aiController");

// Route for AI domain recommendation
router.post("/domain-advisor", domainAdvisor);

module.exports = router;