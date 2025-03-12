const express = require("express");
const router = express.Router();
const { analyzePerformance, predictInjury } = require("../controllers/aiController");
const { verifyToken } = require("../middleware/authMiddleware");

// ✅ Route to analyze athlete's performance
router.get("/athletes/:athleteId/performance", verifyToken, analyzePerformance);

// ✅ Route to predict injury risk
router.get("/athletes/:athleteId/injury-prediction", verifyToken, predictInjury);

module.exports = router;
