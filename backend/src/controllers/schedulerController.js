const { db } = require("../config/firestore");

// ✅ Create Scheduler (Only Admins Can Create)
const createScheduler = async (req, res) => {
  try {
    const { uid, name, email, phone } = req.body;

    if (!uid || !name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const schedulerRef = db.collection("schedulers").doc(uid);
    await schedulerRef.set({
      uid,
      name,
      email,
      phone,
      role: "scheduler",
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Scheduler registered successfully", scheduler: req.body });
  } catch (error) {
    res.status(500).json({ message: "Error creating scheduler", error: error.message });
  }
};

// ✅ Get a Single Scheduler
const getScheduler = async (req, res) => {
  try {
    const { uid } = req.params;
    const doc = await db.collection("schedulers").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Scheduler not found" });
    }

    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ message: "Error fetching scheduler", error: error.message });
  }
};

// ✅ Get All Schedulers (Only Admins)
const getAllSchedulers = async (req, res) => {
  try {
    const snapshot = await db.collection("schedulers").get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No schedulers found" });
    }

    const schedulers = [];
    snapshot.forEach((doc) => {
      schedulers.push({ id: doc.id, ...doc.data() });
    });

    res.json(schedulers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedulers", error: error.message });
  }
};

// ✅ Update Scheduler (Only Admins)
const updateScheduler = async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = req.body;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    await db.collection("schedulers").doc(uid).update(updateData);
    res.json({ message: "Scheduler updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating scheduler", error: error.message });
  }
};

// ✅ Delete Scheduler (Only Admins)
const deleteScheduler = async (req, res) => {
  try {
    const { uid } = req.params;
    await db.collection("schedulers").doc(uid).delete();

    res.json({ message: "Scheduler deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting scheduler", error: error.message });
  }
};

module.exports = {
  createScheduler,
  getScheduler,
  getAllSchedulers,
  updateScheduler,
  deleteScheduler,
};
