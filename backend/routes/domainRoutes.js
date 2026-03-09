const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { updateUserDomain } = require("../controllers/domainController");

router.put("/:userId", protect, updateUserDomain);

module.exports = router;