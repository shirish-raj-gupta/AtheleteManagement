const express = require("express");
const router = express.Router();
const {
  getAllSchedulers,
  createScheduler,
  getScheduler,
  updateScheduler,
  deleteScheduler
} = require("../controllers/schedulerController");

const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Get All Schedulers (Only Admins)
router.get("/", verifyToken, authorizeRoles("admin"), getAllSchedulers);

// ✅ Create a Scheduler (Only Admins)
router.post("/", verifyToken, authorizeRoles("admin"), createScheduler);

// ✅ Get Scheduler by UID (Schedulers can only see their own profile)
router.get("/:uid", verifyToken, (req, res, next) => {
  if (req.user.role === "scheduler" && req.user.uid !== req.params.uid) {
    return res.status(403).json({ message: "Access Denied: Cannot view other schedulers' profiles." });
  }
  next();
}, getScheduler);

// ✅ Update Scheduler (Only Admins)
router.put("/:uid", verifyToken, authorizeRoles("admin"), updateScheduler);

// ✅ Delete Scheduler (Only Admins)
router.delete("/:uid", verifyToken, authorizeRoles("admin"), deleteScheduler);

module.exports = router;
