const express = require("express");
const router = express.Router();
const { generateTrainingPlan } = require("../controllers/aiTrainingController");
const { verifyToken } = require("../middleware/authMiddleware");

// ✅ Route to generate AI training plan
router.get("/athletes/:athleteId/training-plan", verifyToken, generateTrainingPlan);

module.exports = router;
