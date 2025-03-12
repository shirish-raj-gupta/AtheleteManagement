const db = require("../config/firestore");
const User = require("../models/userModel");

const addUser = async (req, res) => {
  try {
    const { uid, name, email, role, phone } = req.body;

    // Create a new User object
    const newUser = new User(uid, name, email, role, phone);

    // Save user to Firestore
    await db.collection("users").doc(uid).set({ ...newUser });

    res.status(201).json({ message: "User added successfully!", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addUser };
