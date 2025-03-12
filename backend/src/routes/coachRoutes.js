const express = require("express");
const router = express.Router();
const {
  createCoach,
  getCoach,
  getAllCoaches,
  updateCoach,
  deleteCoach,
} = require("../controllers/coachController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Get All Coaches (Only Admins & Managers)
router.get("/", verifyToken, authorizeRoles("admin", "manager"), getAllCoaches);

// ✅ Create a Coach (Only Admins & Managers)
router.post("/", verifyToken, authorizeRoles("admin", "manager"), createCoach);

// ✅ Get Coach by UID (Only Self-View for Coaches, Others Need Permission)
router.get("/:uid", verifyToken, (req, res, next) => {
  if (req.user.role === "coach" && req.user.uid !== req.params.uid) {
    return res.status(403).json({ message: "Access Denied: Cannot view other coaches' profiles." });
  }
  next();
}, getCoach);

// ✅ Update Coach (Only Admins & Managers)
router.put("/:uid", verifyToken, authorizeRoles("admin", "manager"), updateCoach);

// ✅ Delete Coach (Only Admins)
router.delete("/:uid", verifyToken, authorizeRoles("admin"), deleteCoach);

module.exports = router;
