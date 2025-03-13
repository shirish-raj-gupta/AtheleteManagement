const { db } = require("../config/firestore");

// ✅ Update Athlete's Real-Time Performance
const updateRealTimePerformance = async (req, res) => {
  try {
    const { athleteId } = req.params;
    const { speed, stamina, agility, reaction_time } = req.body;

    if (!speed || !stamina || !agility || !reaction_time) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const performanceData = {
      speed,
      stamina,
      agility,
      reaction_time,
      timestamp: new Date().toISOString(),
    };

    // 🔹 Store in `realTimeStats` collection instead of `athletes`
    await db.collection("realTimeStats").doc(athleteId).set(performanceData);

    res.status(200).json({ message: "Real-time performance updated successfully", performanceData });
  } catch (error) {
    res.status(500).json({ message: "Error updating real-time performance", error: error.message });
  }
};

// ✅ Get Athlete's Real-Time Performance
const getRealTimePerformance = async (req, res) => {
  try {
    const { athleteId } = req.params;
    const doc = await db.collection("realTimeStats").doc(athleteId).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "No real-time data found for this athlete." });
    }

    res.json({ athleteId, realTimeStats: doc.data() });
  } catch (error) {
    res.status(500).json({ message: "Error fetching real-time performance", error: error.message });
  }
};

module.exports = { updateRealTimePerformance, getRealTimePerformance };
