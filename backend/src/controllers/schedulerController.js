const { db } = require("../config/firestore");

// **Get All Schedulers**
const getSchedulers = async (req, res) => {
    try {
        const snapshot = await db.collection("schedulers").get();
        const schedulers = snapshot.docs.map(doc => doc.data());
        res.json({ schedulers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Get Single Scheduler by ID**
const getSchedulerById = async (req, res) => {
    try {
        const doc = await db.collection("schedulers").doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ message: "Scheduler not found" });
        res.json(doc.data());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Update Scheduler**
const updateScheduler = async (req, res) => {
    try {
        await db.collection("schedulers").doc(req.params.id).update(req.body);
        res.json({ message: "Scheduler updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Delete Scheduler**
const deleteScheduler = async (req, res) => {
    try {
        await db.collection("schedulers").doc(req.params.id).delete();
        res.json({ message: "Scheduler deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSchedulers, getSchedulerById, updateScheduler, deleteScheduler };
