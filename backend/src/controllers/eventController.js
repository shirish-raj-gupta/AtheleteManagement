const { db } = require("../config/firestore");
const Event = require("../models/Events");

// ✅ Create Event (Schedulers & Planners only)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;

    if (!title || !description || !date || !time || !location) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const eventId = db.collection("events").doc().id; // Generate unique event ID

    const newEvent = new Event(eventId, title, description, date, time, location, req.user.uid);

// 🔹 Convert `Event` instance into a plain object before saving
const eventData = { ...newEvent };

await db.collection("events").doc(eventId).set(eventData);


    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error: error.message });
  }
};

// ✅ Get All Events (Everyone can view)
const getAllEvents = async (req, res) => {
  try {
    const snapshot = await db.collection("events").get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No events found" });
    }

    const events = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

// ✅ Get a Single Event (Everyone can view)
const getEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const doc = await db.collection("events").doc(eventId).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error: error.message });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.uid;

    // Get the event from Firestore
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    let eventData = eventDoc.data();

    // Check if user is already registered
    if (eventData.attendees.includes(userId)) {
      return res.status(400).json({ message: "User already registered for this event." });
    }

    // Add user to the attendees list
    eventData.attendees.push(userId);

    // Update Firestore
    await eventRef.update({ attendees: eventData.attendees });

    res.json({ message: "User registered for event successfully", attendees: eventData.attendees });
  } catch (error) {
    res.status(500).json({ message: "Error registering for event", error: error.message });
  }
};

// ✅ Update Event (Only Schedulers & Planners who created the event)
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;

    const eventDoc = await db.collection("events").doc(eventId).get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only the creator can update the event
    if (eventDoc.data().createdBy !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: You can only edit events you created." });
    }

    await db.collection("events").doc(eventId).update(updateData);
    res.json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
};

// ✅ Delete Event (Only Admins & Creators)
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventDoc = await db.collection("events").doc(eventId).get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (eventDoc.data().createdBy !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: You can only delete events you created." });
    }

    await db.collection("events").doc(eventId).delete();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, status } = req.body; // Status: "present" or "absent"

    if (!userId || !status) {
      return res.status(400).json({ message: "User ID and status are required." });
    }

    // Get event from Firestore
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    let eventData = eventDoc.data();

    // Check if user is registered
    if (!eventData.attendees.includes(userId)) {
      return res.status(400).json({ message: "User is not registered for this event." });
    }

    // Add attendance record
    if (!eventData.attendance) {
      eventData.attendance = {};
    }
    eventData.attendance[userId] = status;

    // Update Firestore
    await eventRef.update({ attendance: eventData.attendance });

    res.json({ message: `Attendance marked as ${status} for user ${userId}`, attendance: eventData.attendance });
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance", error: error.message });
  }
};

const getEventAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    const eventData = eventDoc.data();

    if (!eventData.attendance) {
      return res.json({ message: "No attendance records found for this event.", attendance: {} });
    }

    res.json({ eventId, attendance: eventData.attendance });
  } catch (error) {
    res.status(500).json({ message: "Error fetching event attendance", error: error.message });
  }
};

const getAthleteAttendance = async (req, res) => {
  try {
    const { athleteId } = req.params;

    const snapshot = await db.collection("events").get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No events found." });
    }

    const attendanceRecords = {};
    snapshot.forEach((doc) => {
      const eventData = doc.data();
      if (eventData.attendance && eventData.attendance[athleteId]) {
        attendanceRecords[doc.id] = {
          title: eventData.title,
          date: eventData.date,
          status: eventData.attendance[athleteId],
        };
      }
    });

    if (Object.keys(attendanceRecords).length === 0) {
      return res.json({ message: "No attendance records found for this athlete." });
    }

    res.json({ athleteId, attendance: attendanceRecords });
  } catch (error) {
    res.status(500).json({ message: "Error fetching athlete attendance", error: error.message });
  }
};


const getEventAttendanceSummary = async (req, res) => {
  try {
    const { eventId } = req.params;

    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: "Event not found." });
    }

    const eventData = eventDoc.data();
    const attendance = eventData.attendance || {};

    // Calculate summary
    const totalAttendees = Object.keys(attendance).length;
    const presentCount = Object.values(attendance).filter((a) => a.status === "present").length;
    const absentCount = Object.values(attendance).filter((a) => a.status === "absent").length;

    const summary = {
      eventId,
      title: eventData.title || "Untitled Event",
      date: eventData.date || "Unknown Date",
      location: eventData.location || "Unknown Location",
      totalAttendees,
      present: presentCount,
      absent: absentCount,
      attendees: attendance
    };

    res.json({ attendanceSummary: summary });
  } catch (error) {
    console.error("❌ Error generating attendance summary:", error);
    res.status(500).json({ message: "Error generating attendance summary", error: error.message });
  }
};



module.exports = {
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
};
