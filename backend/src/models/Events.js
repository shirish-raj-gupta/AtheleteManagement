class Event {
  constructor(eventId, title, description, date, time, location, createdBy, attendees = []) {
    if (!eventId || !title || !description || !date || !time || !location || !createdBy) {
      throw new Error("All fields (eventId, title, description, date, time, location, createdBy) are required.");
    }
    this.eventId = eventId;
    this.title = title;
    this.description = description;
    this.date = date;
    this.time = time;
    this.location = location;
    this.createdBy = createdBy; // UID of the creator (scheduler/planner)
    this.attendees = attendees; // List of athlete & coach UIDs
    this.createdAt = new Date();
  }
}

module.exports = Event;
