const BaseUser = require("./BaseUser");

class Athlete extends BaseUser {
  constructor(uid, name, email, phone, age, sport, team, stats = {}, injuries = []) {
    super(uid, name, email, "athlete", phone); // Default role = "athlete"
    
    if (!age || !sport || !team) {
      throw new Error("All fields (age, sport, team) are required.");
    }
    
    this.age = age;
    this.sport = sport;
    this.team = team;
    this.stats = stats;  // Performance stats (optional)
    this.injuries = injuries;  // Injury history (optional)
  }
}

module.exports = Athlete;
