const jwt = require("jsonwebtoken");
const { db } = require("../config/firestore");

// ✅ Middleware: Verify JWT Token
const verifyToken = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
  
      if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
      }
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: "Invalid Token", error: error.message });
      }
  
      req.user = decoded;
  
      // 🔍 Check User Role in Firestore
      const collections = ["athletes", "coaches", "schedulers", "managers", "planners"];
  
      let userRole = null;
      for (const collection of collections) {
        const doc = await db.collection(collection).doc(decoded.uid).get();
        if (doc.exists) {
          userRole = doc.data().role;
          req.user.role = userRole;
          return next(); // ✅ Exit after finding the correct role
        }
      }
  
      return res.status(403).json({ message: "Access Denied: User not found in any collection" });
    } catch (error) {
      res.status(401).json({ message: "Invalid Token", error: error.message });
    }
  };
  

// ✅ Middleware: Role-Based Access Control
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
