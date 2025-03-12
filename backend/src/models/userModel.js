const bcrypt = require("bcryptjs");

class User {
  constructor(uid, name, email, role, phone, password) {
    const validRoles = ["athlete", "coach", "scheduler", "manager", "planner", "admin"];

    if (!uid || !name || !email || !role || !phone || !password) {
      throw new Error("All fields (uid, name, email, role, phone, password) are required.");
    }

    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role: ${role}. Allowed roles: ${validRoles.join(", ")}`);
    }

    this.uid = uid;
    this.name = name;
    this.email = email;
    this.role = role;
    this.phone = phone;
    this.password = password;
  }
}

module.exports = User;
