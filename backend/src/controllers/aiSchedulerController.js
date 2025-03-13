const { db } = require("../config/firestore");

// ✅ AI-Powered Training Schedule
const generateTrainingSchedule = async (req, res) => {
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
      return res.status(400).json({ message: "No performance data available for scheduling." });
    }

    // 🔹 AI Request for Scheduling
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
                  text: `Based on this athlete's performance stats (${JSON.stringify(stats)}), past injuries (${JSON.stringify(injuries)}), and sport (${sport}), create an optimized weekly training schedule.`
                }
              ]
            }
          ]
        })
      }
    );

    const aiResult = await aiResponse.json();

    if (!aiResponse.ok) {
      throw new Error(aiResult.error?.message || "AI Scheduling failed");
    }

    // ✅ Extract AI-generated schedule
    const trainingSchedule = aiResult.candidates[0]?.content?.parts[0]?.text || "No response";

    // ✅ Save schedule in Firestore
    await athleteRef.update({ trainingSchedule });

    res.json({ athleteId, trainingSchedule });
  } catch (error) {
    console.error("❌ Error generating training schedule:", error);
    res.status(500).json({ message: "Error generating training schedule", error: error.message });
  }
};

// ✅ AI-Powered Event Scheduling
const generateEventSchedule = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 🔍 Fetch event data
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: "Event not found." });
    }

    const eventData = eventDoc.data();
    const { date, attendees, location } = eventData;

    if (!attendees || attendees.length === 0) {
      return res.status(400).json({ message: "No attendees available for scheduling." });
    }

    // 🔹 AI Request for Event Scheduling
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
                  text: `Optimize scheduling for this event on ${date} at ${location} for attendees (${JSON.stringify(attendees)}). Consider training fatigue & performance readiness.`
                }
              ]
            }
          ]
        })
      }
    );

    const aiResult = await aiResponse.json();

    if (!aiResponse.ok) {
      throw new Error(aiResult.error?.message || "AI Event Scheduling failed");
    }

    // ✅ Extract AI-generated event schedule
    const eventSchedule = aiResult.candidates[0]?.content?.parts[0]?.text || "No response";

    // ✅ Save schedule in Firestore
    await eventRef.update({ eventSchedule });

    res.json({ eventId, eventSchedule });
  } catch (error) {
    console.error("❌ Error generating event schedule:", error);
    res.status(500).json({ message: "Error generating event schedule", error: error.message });
  }
};

module.exports = { generateTrainingSchedule, generateEventSchedule };
