import admin from "firebase-admin";

// Initialize Firebase Admin SDK
import serviceAccount from "../.keys/dpgp-techart-daulauusau.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dpgp-techart.firebaseapp.com",
});

const db = admin.firestore();

export { admin, db };
