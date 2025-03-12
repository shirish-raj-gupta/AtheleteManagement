const { db } = require("../config/firestore");

// ✅ Create Planner (Only Admins Can Create)
const createPlanner = async (req, res) => {
  try {
    const { uid, name, email, phone } = req.body;

    if (!uid || !name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const plannerRef = db.collection("planners").doc(uid);
    await plannerRef.set({
      uid,
      name,
      email,
      phone,
      role: "planner",
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Planner registered successfully", planner: req.body });
  } catch (error) {
    res.status(500).json({ message: "Error creating planner", error: error.message });
  }
};

// ✅ Get a Single Planner
const getPlanner = async (req, res) => {
  try {
    const { uid } = req.params;
    const doc = await db.collection("planners").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Planner not found" });
    }

    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ message: "Error fetching planner", error: error.message });
  }
};

// ✅ Get All Planners (Only Admins)
const getAllPlanners = async (req, res) => {
  try {
    const snapshot = await db.collection("planners").get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No planners found" });
    }

    const planners = [];
    snapshot.forEach((doc) => {
      planners.push({ id: doc.id, ...doc.data() });
    });

    res.json(planners);
  } catch (error) {
    res.status(500).json({ message: "Error fetching planners", error: error.message });
  }
};

// ✅ Update Planner (Only Admins)
const updatePlanner = async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = req.body;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    await db.collection("planners").doc(uid).update(updateData);
    res.json({ message: "Planner updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating planner", error: error.message });
  }
};

// ✅ Delete Planner (Only Admins)
const deletePlanner = async (req, res) => {
  try {
    const { uid } = req.params;
    await db.collection("planners").doc(uid).delete();

    res.json({ message: "Planner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting planner", error: error.message });
  }
};

module.exports = {
  createPlanner,
  getPlanner,
  getAllPlanners,
  updatePlanner,
  deletePlanner,
};
