const fetch = require("node-fetch");

// ✅ AI Chatbot Function
const aiChatbot = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Query is required." });
    }

    // 🔹 Send user query to Google Gemini AI
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: query }],
            },
          ],
        }),
      }
    );

    const aiResult = await aiResponse.json();

    if (!aiResponse.ok) {
      throw new Error(aiResult.error?.message || "AI Chatbot Response Failed");
    }

    // ✅ Extract AI-generated response
    const responseText = aiResult.candidates[0]?.content?.parts[0]?.text || "No response from AI.";

    res.json({ query, response: responseText });
  } catch (error) {
    console.error("❌ Error in AI Chatbot:", error);
    res.status(500).json({ message: "Error in AI Chatbot", error: error.message });
  }
};

module.exports = { aiChatbot };
