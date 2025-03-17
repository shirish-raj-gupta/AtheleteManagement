const express = require("express");
const router = express.Router();
const {
  createAthlete,
  getAthlete,
  getAllAthletes,
  updateAthlete,
  deleteAthlete,
  getAthletePerformance,
  analyzeAthletePerformance,
  predictInjury,
  getAthleteStats
} = require("../controllers/athleteController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Get All Athletes (Only Admin, Manager, Planner can Access)
router.get("/", verifyToken, authorizeRoles("admin", "manager", "planner"), getAllAthletes);

// ✅ Create an Athlete (Anyone can create)
router.post("/", verifyToken, authorizeRoles("admin", "manager"), createAthlete);


// Athlete Profile Routes
router.get('/:uid', verifyToken, getAthlete);


// ✅ Update Athlete (Only Admins & Managers)
router.put("/:uid", verifyToken, authorizeRoles("admin", "manager"), updateAthlete);

// ✅ Delete Athlete (Only Admins)
router.delete("/:uid", verifyToken, authorizeRoles("admin"), deleteAthlete);

// ✅ Fetch Athlete Performance
router.get('/:uid/performance', verifyToken, getAthletePerformance);

// ✅ Analyze Athlete Performance (Using AI)
router.post('/:uid/analyze', verifyToken, analyzeAthletePerformance);

// ✅ Injury Prediction Route
router.get('/:uid/injury', verifyToken, predictInjury);


// ✅ Athlete Stats Route
router.get('/:uid/stats', verifyToken, getAthleteStats);



module.exports = router;
