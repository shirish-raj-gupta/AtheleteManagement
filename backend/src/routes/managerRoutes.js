const express = require("express");
const router = express.Router();
const {
  createManager,
  getManager,
  getAllManagers,
  updateManager,
  deleteManager,
} = require("../controllers/managerController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Get All Managers (Only Admins)
router.get("/", verifyToken, authorizeRoles("admin"), getAllManagers);

// ✅ Create a Manager (Only Admins)
router.post("/", verifyToken, authorizeRoles("admin"), createManager);

// ✅ Get Manager by UID (Only Self-View for Managers, Others Need Permission)
router.get("/:uid", verifyToken, (req, res, next) => {
  if (req.user.role === "manager" && req.user.uid !== req.params.uid) {
    return res.status(403).json({ message: "Access Denied: Cannot view other managers' profiles." });
  }
  next();
}, getManager);

// ✅ Update Manager (Only Admins)
router.put("/:uid", verifyToken, authorizeRoles("admin"), updateManager);

// ✅ Delete Manager (Only Admins)
router.delete("/:uid", verifyToken, authorizeRoles("admin"), deleteManager);

module.exports = router;
