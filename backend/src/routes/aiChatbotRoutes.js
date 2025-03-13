const express = require("express");
const router = express.Router();
const { aiChatbot } = require("../controllers/aiChatbotController");
const { verifyToken } = require("../middleware/authMiddleware");

// ✅ Route for AI Chatbot
router.post("/chatbot", verifyToken, aiChatbot);

module.exports = router;
