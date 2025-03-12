const { db } = require("../config/firestore");
const Athlete = require("../models/Athlete");

const createAthlete = async (req, res) => {
  try {
      const { uid, name, age, sport, team } = req.body;

      const athleteRef = db.collection("athletes").doc(uid);
      await athleteRef.set({
          uid,
          name,
          age,
          sport,
          team,
          stats: {},
          injuries: [],
          createdAt: new Date()
      });

      res.status(201).json({ message: "Athlete added successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const getAthlete = async (req, res) => {
  try {
      const { uid } = req.params;
      const doc = await db.collection("athletes").doc(uid).get();

      if (!doc.exists) {
          return res.status(404).json({ message: "Athlete not found" });
      }

      res.json(doc.data());
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


// **Update Athlete**
const updateAthlete = async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = req.body;

    await db.collection("athletes").doc(uid).update(updateData);

    res.json({ message: "Athlete updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **Delete Athlete**
const deleteAthlete = async (req, res) => {
  try {
    const { uid } = req.params;
    await db.collection("athletes").doc(uid).delete();

    res.json({ message: "Athlete deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAthlete, getAthlete, updateAthlete, deleteAthlete };
