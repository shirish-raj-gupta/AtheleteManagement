const { auth, db } = require("../config/firestore");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (uid, email) => {
    return jwt.sign({ uid, email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// **Register User**
const register = async (req, res) => {
    try {
      const { email, password, name, role, phone } = req.body;
  
      if (!email || !password || !name || !role || !phone) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // 🔥 Ensure valid role
      const validRoles = ["athlete", "coach", "scheduler", "manager", "planner" , "admin"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
  
      // Hash Password 🔒
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // ✅ Create User in Firebase Authentication
      const user = await auth.createUser({
        email,
        password,
        displayName: name
      });
  
      // ✅ Determine Firestore Collection Based on Role
      const collectionName = `${role}s`;  // Dynamically assigns collection like "athletes", "coaches"
  
      // ✅ Save User in Firestore
      await db.collection(collectionName).doc(user.uid).set({
        uid: user.uid,
        name,
        email,
        role,
        phone,
        password: hashedPassword,
        createdAt: new Date()
      });
  
      // ✅ Generate Token
      const token = generateToken(user.uid, email);
  
      res.status(201).json({ message: "User registered successfully", token, userId: user.uid });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// **Login User (Firestore Password Validation)**
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
  
        // List of role-based collections
        const collections = ["athletes", "coachs", "schedulers", "managers", "planners" , "admins"];
        
        let userData = null;
        let userId = null;
        let userRole = null;
  
        // Search for the user in each collection
        for (const collection of collections) {
            const usersRef = db.collection(collection);
            const snapshot = await usersRef.where("email", "==", email).get();
  
            if (!snapshot.empty) {
                snapshot.forEach(doc => {
                    userData = doc.data();
                    userId = doc.id;
                    userRole = userData.role;
                });
                break; // Exit loop once user is found
            }
        }
  
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
  
        // Compare Password 🔐
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
  
        // Generate Token
        const token = generateToken(userId, email);
  
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
