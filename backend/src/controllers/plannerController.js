const { db } = require("../config/firestore");

// **Get All Planners**
const getPlanners = async (req, res) => {
    try {
        const snapshot = await db.collection("planners").get();
        const planners = snapshot.docs.map(doc => doc.data());
        res.json({ planners });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Get Single Planner by ID**
const getPlannerById = async (req, res) => {
    try {
        const doc = await db.collection("planners").doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ message: "Planner not found" });
        res.json(doc.data());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Update Planner**
const updatePlanner = async (req, res) => {
    try {
        await db.collection("planners").doc(req.params.id).update(req.body);
        res.json({ message: "Planner updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Delete Planner**
const deletePlanner = async (req, res) => {
    try {
        await db.collection("planners").doc(req.params.id).delete();
        res.json({ message: "Planner deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPlanners, getPlannerById, updatePlanner, deletePlanner };
