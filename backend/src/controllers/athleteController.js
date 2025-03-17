const bcrypt = require("bcryptjs");
const {auth , db} = require("../config/firestore"); // Ensure this points to your Firestore config
const { GoogleGenerativeAI } = require("@google/generative-ai");


// ✅ Create Athlete
const createAthlete = async (req, res) => {
  try {
    const { uid, name, email, phone, age, password, sport, team, stats, injuries , role } = req.body;

    // ✅ Check for missing fields
    if (!uid || !name || !email || !phone || !age || !password || !sport || !team) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Define athlete object
    const athlete = {
      uid,
      name,
      email,
      phone,
      age,
      password: hashedPassword, // Store hashed password
      sport,
      team,
      role,
      stats: stats || { speed: 0, stamina: 0, strength: 0, agility: 0, reaction_time: 0 }, // Default values
      injuries: injuries || [], // Ensure it's an array
      createdAt: new Date().toISOString(),
    };

    // ✅ Save to Firestore
    await db.collection("athletes").doc(uid).set(athlete);

    res.status(201).json({ message: "Athlete created successfully", athlete });
  } catch (error) {
    res.status(500).json({ message: "Error creating athlete", error: error.message });
  }
};

// ✅ Fetch Athlete Profile by UID
const getAthlete = async (req, res) => {
  try {
    const { uid } = req.params;

    const athleteRef = db.collection('athletes').doc(uid);
    const doc = await athleteRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Athlete not found' });
    }

    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching athlete profile' });
  }
};


// ✅ Update Athlete
const updateAthlete = async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;

    await db.collection("athletes").doc(uid).update(updates);

    res.status(200).json({ message: "Athlete updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating athlete", error: error.message });
  }
};

// ✅ Delete Athlete
const deleteAthlete = async (req, res) => {
  try {
    const { uid } = req.params;

    await db.collection("athletes").doc(uid).delete();

    res.status(200).json({ message: "Athlete deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting athlete", error: error.message });
  }
};


// ✅ Get All Athletes (Restricted to Admins, Managers, Planners)
const getAllAthletes = async (req, res) => {
  try {
    const snapshot = await db.collection("athletes").get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No athletes found" });
    }

    const athletes = [];
    snapshot.forEach((doc) => {
      athletes.push({ id: doc.id, ...doc.data() });
    });

    res.json(athletes);
  } catch (error) {
    console.error("Error fetching athletes:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Fetch Athlete Performance Data
const getAthletePerformance = async (req, res) => {
  try {
    const { uid } = req.params;

    const athleteRef = db.collection('athletes').doc(uid);
    const doc = await athleteRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Athlete not found' });
    }

    const athleteData = doc.data();
    const performanceData = athleteData.stats || {};

    res.status(200).json({ stats: performanceData });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance data' });
  }
};

// ✅ Analyze Athlete Performance Using Gemini API


// ✅ Analyze Athlete Performance Using Gemini API
const analyzeAthletePerformance = async (req, res) => {
  try {
    const { uid } = req.params;

    const athleteRef = db.collection('athletes').doc(uid);
    const doc = await athleteRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Athlete not found' });
    }

    const performanceData = doc.data().stats || {};

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze the following athlete performance data and suggest improvements:\n\n${JSON.stringify(performanceData)}`;

    const result = await model.generateContent(prompt);

    const analysis = result.response.candidates[0].content.parts[0].text;

    res.status(200).json({ analysis });
  } catch (error) {
    console.error("Error in performance analysis:", error);
    res.status(500).json({ message: 'Error analyzing performance' });
  }
};





// ✅ Predict Injury Risk Using Gemini API
const predictInjury = async (req, res) => {
  const { uid } = req.params;

  const athleteRef = db.collection('athletes').doc(uid);
  const doc = await athleteRef.get();

  if (!doc.exists) {
    return res.status(404).json({ message: 'Athlete not found' });
  }

  const performanceData = doc.data().performance || {};

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Based on the following athlete performance data, predict the risk of injury and suggest preventive measures:\n\n${JSON.stringify(performanceData)}`;

  const result = await model.generateContent(prompt);

  const response = await result.response;

  res.status(200).json({ injuryRisk: response.text() });
};


// ✅ Fetch Athlete Stats
const getAthleteStats = async (req, res) => {
  const { uid } = req.params;

  const athleteRef = db.collection('athletes').doc(uid);
  const doc = await athleteRef.get();

  if (!doc.exists) {
    return res.status(404).json({ message: 'Athlete not found' });
  }

  const athleteData = doc.data();

  // ✅ Return only the `stats` field from Firestore
  res.status(200).json(athleteData.stats || {});
};




module.exports = {
  createAthlete,
  getAthlete,
  getAllAthletes,
  updateAthlete,
  deleteAthlete,
  getAthletePerformance,
  analyzeAthletePerformance,
  predictInjury,
  getAthleteStats
};
