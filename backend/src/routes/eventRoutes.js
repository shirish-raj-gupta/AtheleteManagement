const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  markAttendance,
  getEventAttendance,
  getAthleteAttendance,
  getEventAttendanceSummary
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

// ✅ Mark Attendance (Only Admins & Event Creators)
router.post("/:eventId/attendance", verifyToken, authorizeRoles("admin", "scheduler", "planner"), markAttendance);

// ✅ Get Attendance for a Single Event
router.get("/:eventId/attendance", verifyToken, getEventAttendance);

// ✅ Get an Athlete’s Attendance Record
router.get("/athlete/:athleteId", verifyToken, getAthleteAttendance);

// ✅ Get Attendance Summary for All Events
router.get("/summary", verifyToken, getEventAttendanceSummary);

module.exports = router;
