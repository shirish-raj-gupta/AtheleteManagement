const { db } = require("../config/firestore");

// **Get All Managers**
const getManagers = async (req, res) => {
    try {
        const snapshot = await db.collection("managers").get();
        const managers = snapshot.docs.map(doc => doc.data());
        res.json({ managers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Get Single Manager by ID**
const getManagerById = async (req, res) => {
    try {
        const doc = await db.collection("managers").doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ message: "Manager not found" });
        res.json(doc.data());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Update Manager**
const updateManager = async (req, res) => {
    try {
        await db.collection("managers").doc(req.params.id).update(req.body);
        res.json({ message: "Manager updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Delete Manager**
const deleteManager = async (req, res) => {
    try {
        await db.collection("managers").doc(req.params.id).delete();
        res.json({ message: "Manager deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getManagers, getManagerById, updateManager, deleteManager };
