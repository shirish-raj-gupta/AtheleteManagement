require("dotenv").config();
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

// Export Firestore and Auth
const db = admin.firestore()
const auth = admin.auth();  // Ensure this is properly initialized

module.exports = { db, auth };