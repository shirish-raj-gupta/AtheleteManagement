const fetch = require("node-fetch");
const { db } = require("../config/firestore");

// ✅ Analyze Athlete Performance using AI
const analyzePerformance = async (req, res) => {
  try {
    const { athleteId  } = req.params;
    const athleteRef = db.collection("athletes").doc(athleteId );
    const athleteDoc = await athleteRef.get();

    if (!athleteDoc.exists) {
      return res.status(404).json({ message: "Athlete not found." });
    }

    const athleteData = athleteDoc.data();
    const performance = athleteData.stats || {};

    if (Object.keys(performance).length === 0) {
      return res.status(400).json({ message: "No performance data available for analysis." });
    }

    // 🔹 Send performance data to Gemini AI
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `Analyze the following athlete's performance stats: ${JSON.stringify(performance)}` }],
            },
          ],
        }),
      }
    );

    const aiResult = await aiResponse.json();

    if (!aiResponse.ok) {
      throw new Error(aiResult.error?.message || "AI Analysis failed");
    }

    res.json({ athleteId, performance, analysis: aiResult.candidates[0]?.content?.parts[0]?.text || "No response" });
  } catch (error) {
    console.error("❌ Error analyzing performance:", error);
    res.status(500).json({ message: "Error analyzing performance", error: error.message });
  }
};

// ✅ Predict Injury Risk using AI
const predictInjury = async (req, res) => {
  try {
    const { athleteId  } = req.params;
    const athleteRef = db.collection("athletes").doc(athleteId );
    const athleteDoc = await athleteRef.get();

    if (!athleteDoc.exists) {
      return res.status(404).json({ message: "Athlete not found." });
    }

    const athleteData = athleteDoc.data();
    const injuryHistory = athleteData.injuries || [];

    if (injuryHistory.length === 0) {
      return res.status(400).json({ message: "No injury history available for prediction." });
    }

    // 🔹 Send injury data to Gemini AI
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `Based on this athlete's past injuries and performance: ${JSON.stringify(athleteData)}, predict the likelihood of future injuries.` }],
            },
          ],
        }),
      }
    );

    const aiResult = await aiResponse.json();

    if (!aiResponse.ok) {
      throw new Error(aiResult.error?.message || "Injury Prediction failed");
    }

    res.json({ athleteId, injuryRisk: aiResult.candidates[0]?.content?.parts[0]?.text || "No response" });
  } catch (error) {
    console.error("❌ Error predicting injury:", error);
    res.status(500).json({ message: "Error predicting injury", error: error.message });
  }
};


// ✅ Analyze Real-Time Performance with AI
const analyzeRealTimePerformance = async (req, res) => {
  try {
    const { athleteId } = req.params;
    const athleteRef = db.collection("realTimeStats").doc(athleteId);
    const athleteDoc = await athleteRef.get();

    if (!athleteDoc.exists) {
      return res.status(404).json({ message: "No real-time performance data found." });
    }

    const realTimeStats = athleteDoc.data();

    // 🔹 Send live performance data to Gemini AI
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `Analyze the following athlete's live performance data: ${JSON.stringify(realTimeStats)}` }],
            },
          ],
        }),
      }
    );

    const aiResult = await aiResponse.json();

    if (!aiResponse.ok) {
      throw new Error(aiResult.error?.message || "AI Analysis failed");
    }

    res.json({
      athleteId,
      realTimeStats,
      analysis: aiResult.candidates[0]?.content?.parts[0]?.text || "No response",
    });
  } catch (error) {
    console.error("❌ Error analyzing real-time performance:", error);
    res.status(500).json({ message: "Error analyzing real-time performance", error: error.message });
  }
};

module.exports = { analyzePerformance, predictInjury, analyzeRealTimePerformance};
