const express = require("express");
const router = express.Router();

const { domainAdvisor, interestTest } = require("../controllers/aiController");

// Route for AI domain recommendation
router.post("/domain-advisor", domainAdvisor);
router.post("/interest-test", interestTest);

module.exports = router;