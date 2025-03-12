const { db } = require("../config/firestore");

// ✅ Create Manager (Only Admins Can Create)
const createManager = async (req, res) => {
  try {
    const { uid, name, email, phone } = req.body;

    if (!uid || !name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const managerRef = db.collection("managers").doc(uid);
    await managerRef.set({
      uid,
      name,
      email,
      phone,
      role: "manager",
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Manager registered successfully", manager: req.body });
  } catch (error) {
    res.status(500).json({ message: "Error creating manager", error: error.message });
  }
};

// ✅ Get a Single Manager
const getManager = async (req, res) => {
  try {
    const { uid } = req.params;
    const doc = await db.collection("managers").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Manager not found" });
    }

    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ message: "Error fetching manager", error: error.message });
  }
};

// ✅ Get All Managers (Only Admins)
const getAllManagers = async (req, res) => {
  try {
    const snapshot = await db.collection("managers").get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No managers found" });
    }

    const managers = [];
    snapshot.forEach((doc) => {
      managers.push({ id: doc.id, ...doc.data() });
    });

    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching managers", error: error.message });
  }
};

// ✅ Update Manager (Only Admins)
const updateManager = async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = req.body;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    await db.collection("managers").doc(uid).update(updateData);
    res.json({ message: "Manager updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating manager", error: error.message });
  }
};

// ✅ Delete Manager (Only Admins)
const deleteManager = async (req, res) => {
  try {
    const { uid } = req.params;
    await db.collection("managers").doc(uid).delete();

    res.json({ message: "Manager deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting manager", error: error.message });
  }
};

module.exports = {
  createManager,
  getManager,
  getAllManagers,
  updateManager,
  deleteManager,
};
