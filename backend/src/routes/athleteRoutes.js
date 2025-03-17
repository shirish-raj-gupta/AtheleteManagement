const express = require("express");
const router = express.Router();
const {
  createAthlete,
  getAthlete,
  getAllAthletes,
  updateAthlete,
  deleteAthlete,
} = require("../controllers/athleteController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Get All Athletes (Only Admin, Manager, Planner can Access)
router.get("/", verifyToken, authorizeRoles("admin", "manager", "planner"), getAllAthletes);

// ✅ Create an Athlete (Anyone can create)
router.post("/", verifyToken, authorizeRoles("admin", "manager"), createAthlete);


// ✅ Get Athlete (Athletes can only view their own profile)
router.get("/:uid", verifyToken, (req, res, next) => {
  if (req.user.role === "athlete" && req.user.uid !== req.params.uid) {
    return res.status(403).json({ message: "Access Denied: Cannot view other profiles." });
  }
  next();
}, getAthlete);

// ✅ Update Athlete (Only Admins & Managers)
router.put("/:uid", verifyToken, authorizeRoles("admin", "manager"), updateAthlete);

// ✅ Delete Athlete (Only Admins)
router.delete("/:uid", verifyToken, authorizeRoles("admin"), deleteAthlete);

module.exports = router;
