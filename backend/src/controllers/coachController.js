const { db } = require("../config/firestore");

// **Get All Coaches**
const getCoaches = async (req, res) => {
    try {
        const snapshot = await db.collection("coaches").get();
        const coaches = snapshot.docs.map(doc => doc.data());
        res.json({ coaches });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Get Single Coach by ID**
const getCoachById = async (req, res) => {
    try {
        const doc = await db.collection("coaches").doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ message: "Coach not found" });
        res.json(doc.data());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Update Coach**
const updateCoach = async (req, res) => {
    try {
        await db.collection("coaches").doc(req.params.id).update(req.body);
        res.json({ message: "Coach updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Delete Coach**
const deleteCoach = async (req, res) => {
    try {
        await db.collection("coaches").doc(req.params.id).delete();
        res.json({ message: "Coach deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCoaches, getCoachById, updateCoach, deleteCoach };
