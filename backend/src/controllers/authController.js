const { auth, db } = require("../config/firestore");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ✅ Generate Token
const generateToken = (uid, email, role) => {
  return jwt.sign({ uid, email, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Register User
const register = async (req, res) => {
  try {
    const { email, password, name, role, phone } = req.body;

    if (!email || !password || !name || !role || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const validRoles = ["athlete", "coach", "scheduler", "manager", "planner", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await auth.createUser({ email, password, displayName: name });

    const collectionName = `${role}s`;
    await db.collection(collectionName).doc(user.uid).set({
      uid: user.uid,
      name,
      email,
      role,
      phone,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const token = generateToken(user.uid, email, role);
    res.status(201).json({ message: "User registered", token, userId: user.uid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const collections = ["athletes", "coachs", "schedulers", "managers", "planners", "admins"];

    let userData = null;
    let userId = null;
    let userRole = null;

    for (const collection of collections) {
      const snapshot = await db.collection(collection).where("email", "==", email).get();

      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          userData = doc.data();
          userId = doc.id;
          userRole = userData.role;
        });
        break;
      }
    }

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(userId, email, userRole);
    res.json({ message: "Login successful", token, userId, role: userRole });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **Logout User (Handled on frontend by removing token)**
const logout = async (req, res) => {
    try {
        res.json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { register, login, logout };
