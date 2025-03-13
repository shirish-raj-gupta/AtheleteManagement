const express = require("express");
const router = express.Router();
const { generateTrainingSchedule, generateEventSchedule } = require("../controllers/aiSchedulerController");
const { verifyToken } = require("../middleware/authMiddleware");

// ✅ Route to generate AI training schedule
router.get("/athletes/:athleteId/training-schedule", verifyToken, generateTrainingSchedule);

// ✅ Route to generate AI event schedule
router.get("/events/:eventId/event-schedule", verifyToken, generateEventSchedule);

module.exports = router;
