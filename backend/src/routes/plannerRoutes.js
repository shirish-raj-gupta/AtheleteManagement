const express = require("express");
const router = express.Router();
const {
  getAllPlanners,
  createPlanner,
  getPlanner,
  updatePlanner,
  deletePlanner
} = require("../controllers/plannerController");

const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Get All Planners (Only Admins)
router.get("/", verifyToken, authorizeRoles("admin"), getAllPlanners);

// ✅ Create a Planner (Only Admins)
router.post("/", verifyToken, authorizeRoles("admin"), createPlanner);

// ✅ Get Planner by UID (Planners can only see their own profile)
router.get("/:uid", verifyToken, (req, res, next) => {
  if (req.user.role === "planner" && req.user.uid !== req.params.uid) {
    return res.status(403).json({ message: "Access Denied: Cannot view other planners' profiles." });
  }
  next();
}, getPlanner);

// ✅ Update Planner (Only Admins)
router.put("/:uid", verifyToken, authorizeRoles("admin"), updatePlanner);

// ✅ Delete Planner (Only Admins)
router.delete("/:uid", verifyToken, authorizeRoles("admin"), deletePlanner);

module.exports = router;
