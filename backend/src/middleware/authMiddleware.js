const { auth, db } = require("../config/firestore");

// Middleware to verify token and get user role
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided" });

        // Verify token
        const decoded = await auth.verifyIdToken(token);
        req.user = decoded; // Store user info in request

        // Define all possible user collections
        const collections = ["athletes", "coaches", "schedulers", "managers", "planners"];
        
        let userDoc;
        let userRole = null;

        for (const collection of collections) {
            const docRef = db.collection(collection).doc(decoded.uid);
            const doc = await docRef.get();
            if (doc.exists) {
                userDoc = doc;
                userRole = collection.slice(0, -1); // Convert "athletes" -> "athlete"
                break;
            }
        }

        if (!userDoc) return res.status(403).json({ message: "User not found in any collection" });

        req.user.role = userRole; // Attach role to request
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

// Middleware for Role-Based Access
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
        }
        next();
    };
};

module.exports = { verifyToken, authorizeRoles };
