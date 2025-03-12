const { db } = require("../config/firestore");
const Athlete = require("../models/Athlete");

// ✅ Create Athlete
const createAthlete = async (req, res) => {
  try {
    const { uid, name, email, phone, age, sport, team, stats, injuries } = req.body;

    if (!uid || !name || !email || !phone || !age || !sport || !team) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const athlete = new Athlete(uid, name, email, phone, age, sport, team, stats, injuries);

    await db.collection("athletes").doc(uid).set({ ...athlete });

    res.status(201).json({ message: "Athlete created successfully", athlete });
  } catch (error) {
    res.status(500).json({ message: "Error creating athlete", error: error.message });
  }
};

// ✅ Read (Fetch) Athlete by UID
const getAthlete = async (req, res) => {
  try {
    const { uid } = req.params;
    const doc = await db.collection("athletes").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).json({ message: "Error fetching athlete", error: error.message });
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

module.exports = { createAthlete, getAthlete, updateAthlete, deleteAthlete };


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

module.exports = {
  createAthlete,
  getAthlete,
  getAllAthletes,
  updateAthlete,
  deleteAthlete,
};
