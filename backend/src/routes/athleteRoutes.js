const express = require("express");
const router = express.Router();
const { createAthlete, getAthlete, updateAthlete, deleteAthlete } = require("../controllers/athleteController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// Only Admins, Managers, and Planners can get all athletes
router.get("/", verifyToken, authorizeRoles("admin", "manager", "planner"), getAthlete);

router.post("/athletes", createAthlete); // Create athlete

// Athletes can view only their own data
router.get("/:id", verifyToken, (req, res, next) => {
  if (req.user.role === "athlete" && req.user.uid !== req.params.id) {
      return res.status(403).json({ message: "Access Denied" });
  }
  next();
}, getAthlete);

// Only Admins and Managers can update athlete data
router.put("/:id", verifyToken, authorizeRoles("admin", "manager"), updateAthlete);

// Only Admins can delete an athlete
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteAthlete);

module.exports = router;