const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerForEvent
} = require("../controllers/eventController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Get All Events (Everyone can view)
router.get("/", verifyToken, getAllEvents);

// ✅ Create Event (Only Schedulers & Planners)
router.post("/", verifyToken, authorizeRoles("scheduler", "planner"), createEvent);

// ✅ Get Event by ID (Everyone can view)
router.get("/:eventId", verifyToken, getEvent);

// ✅ Update Event (Only Schedulers, Planners, or Admins)
router.put("/:eventId", verifyToken, authorizeRoles("scheduler", "planner", "admin"), updateEvent);

// ✅ Delete Event (Only Admins & Creators)
router.delete("/:eventId", verifyToken, authorizeRoles("admin"), deleteEvent);


// ✅ Register for an Event (Athletes & Coaches)
router.post("/:eventId/register", verifyToken, authorizeRoles("athlete", "coach"), registerForEvent);

module.exports = router;
