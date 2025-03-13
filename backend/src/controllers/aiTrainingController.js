const { db } = require("../config/firestore");

// ✅ Generate AI Training Plan
const generateTrainingPlan = async (req, res) => {
  try {
    const { athleteId } = req.params;
    
    // 🔍 Fetch athlete data
    const athleteRef = db.collection("athletes").doc(athleteId);
    const athleteDoc = await athleteRef.get();

    if (!athleteDoc.exists) {
      return res.status(404).json({ message: "Athlete not found." });
    }

    const athleteData = athleteDoc.data();
    const { stats, injuries, sport } = athleteData;

    if (!stats || Object.keys(stats).length === 0) {
      return res.status(400).json({ message: "No performance data available for training plan." });
    }

    // 🧠 Generate AI Request
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Based on this athlete's performance stats (${JSON.stringify(stats)}) and past injuries (${JSON.stringify(injuries)}), generate a personalized ${sport} training plan to improve weaknesses and avoid injuries.`
                }
              ]
            }
          ]
        })
      }
    );

    const aiResult = await aiResponse.json();

    if (!aiResponse.ok) {
      throw new Error(aiResult.error?.message || "AI Training Plan Generation Failed");
    }

    // ✅ Extract AI-generated training plan
    const trainingPlan = aiResult.candidates[0]?.content?.parts[0]?.text || "No response";

    // ✅ Save training plan in Firestore
    await athleteRef.update({ trainingPlan });

    res.json({ athleteId, trainingPlan });
  } catch (error) {
    console.error("❌ Error generating training plan:", error);
    res.status(500).json({ message: "Error generating training plan", error: error.message });
  }
};

module.exports = { generateTrainingPlan };
