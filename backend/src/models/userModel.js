const bcrypt = require("bcryptjs");

class User {
  constructor(uid, name, email, role, phone, password) {
    if (!uid || !name || !email || !role || !phone || !password) {
      throw new Error("All fields (uid, name, email, role, phone, password) are required.");
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
