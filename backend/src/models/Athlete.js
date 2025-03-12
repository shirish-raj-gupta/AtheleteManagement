class Athlete {
  constructor(uid, name, age, sport, team, stats = {}, injuries = [], createdAt = new Date()) {
    if (!uid || !name || !age || !sport || !team) {
      throw new Error("All fields (uid, name, age, sport, team) are required.");
    }
    this.uid = uid;
    this.name = name;
    this.age = age;
    this.sport = sport;
    this.team = team;
    this.stats = stats;  // Performance stats (optional)
    this.injuries = injuries;  // Injury history (optional)
    this.createdAt = createdAt;
  }
}

module.exports = Athlete;
