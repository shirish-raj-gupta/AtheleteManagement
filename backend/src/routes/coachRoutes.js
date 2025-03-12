const express = require("express");
const router = express.Router();
const { getCoaches, getCoachById, updateCoach, deleteCoach } = require("../controllers/coachController");

// Only Admins and Managers can view all coaches
router.get("/", verifyToken, authorizeRoles("admin", "manager"), getCoaches);

// Coaches can view their own profile, but others require admin access
router.get("/:id", verifyToken, (req, res, next) => {
    if (req.user.role === "coach" && req.user.uid !== req.params.id) {
        return res.status(403).json({ message: "Access Denied" });
    }
    next();
}, getCoachById);

// Only Admins and Managers can update coach data
router.put("/:id", verifyToken, authorizeRoles("admin", "manager"), updateCoach);

// Only Admins can delete a coach
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteCoach);

module.exports = router;
module.exports = router;
