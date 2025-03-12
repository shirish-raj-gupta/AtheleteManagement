class User {
  constructor(uid, name, email, role, phone) {
    if (!uid || !name || !email || !role || !phone) {
      throw new Error("All fields (uid, name, email, role, phone) are required.");
    }
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.role = role;
    this.phone = phone;
  }
}

module.exports = User;
