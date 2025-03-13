const express = require("express");
const router = express.Router();
const { updateRealTimePerformance, getRealTimePerformance } = require("../controllers/realTimeController");
const { analyzeRealTimePerformance } = require("../controllers/aiController");
const { verifyToken } = require("../middleware/authMiddleware");

// ✅ Update real-time performance
router.post("/athletes/:athleteId/performance", verifyToken, updateRealTimePerformance);

// ✅ Get real-time performance
router.get("/athletes/:athleteId/performance", verifyToken, getRealTimePerformance);

// ✅ AI Analysis for real-time performance
router.get("/athletes/:athleteId/performance-analysis", verifyToken, analyzeRealTimePerformance);

module.exports = router;
