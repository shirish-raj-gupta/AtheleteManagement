const jwt = require("jsonwebtoken");
const { db } = require("../config/firestore");

// ✅ Middleware: Verify Token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // ✅ Fetch User Role from Firestore
    const collections = ["athletes", "coachs", "schedulers", "managers", "planners", "admins"];

    for (const collection of collections) {
      const userDoc = await db.collection(collection).doc(decoded.uid).get();

      if (userDoc.exists) {
        req.user.role = userDoc.data().role;
        break;
      }
    }

    if (!req.user.role) {
      return res.status(403).json({ message: "Access Denied: User not found in any role collection" });
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid Token", error: error.message });
  }
};

// ✅ Role-Based Access Control
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
