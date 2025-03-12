const { db } = require("../config/firestore");

// ✅ Create Coach
const createCoach = async (req, res) => {
  try {
    const { uid, name, email, phone, sport, team } = req.body;

    if (!uid || !name || !email || !phone || !sport || !team) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const coachRef = db.collection("coaches").doc(uid);
    await coachRef.set({
      uid,
      name,
      email,
      phone,
      sport,
      team,
      role: "coach",
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Coach registered successfully", coach: req.body });
  } catch (error) {
    res.status(500).json({ message: "Error creating coach", error: error.message });
  }
};

// ✅ Get a Single Coach
const getCoach = async (req, res) => {
  try {
    const { uid } = req.params;
    const doc = await db.collection("coachs").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Coach not found" });
    }

    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ message: "Error fetching coach", error: error.message });
  }
};

// ✅ Get All Coaches (Only Admins & Managers)
const getAllCoaches = async (req, res) => {
  try {
    const snapshot = await db.collection("coachs").get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No coaches found" });
    }

    const coaches = [];
    snapshot.forEach((doc) => {
      coaches.push({ id: doc.id, ...doc.data() });
    });

    res.json(coaches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coaches", error: error.message });
  }
};

// ✅ Update Coach (Only Admins & Managers)
const updateCoach = async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = req.body;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    await db.collection("coachs").doc(uid).update(updateData);
    res.json({ message: "Coach updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating coach", error: error.message });
  }
};

// ✅ Delete Coach (Only Admins)
const deleteCoach = async (req, res) => {
  try {
    const { uid } = req.params;
    await db.collection("coachs").doc(uid).delete();

    res.json({ message: "Coach deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coach", error: error.message });
  }
};

module.exports = {
  createCoach,
  getCoach,
  getAllCoaches,
  updateCoach,
  deleteCoach,
};
