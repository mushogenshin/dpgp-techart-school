import admin from "firebase-admin";

// Initialize Firebase Admin SDK
import serviceAccount from "../.keys/dpgp-techart-daulauusau.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dpgp-techart.firebaseapp.com",
});

const db = admin.firestore();

// Function to access Firebase DB
const getClassData = async (classId) => {
  try {
    const userRef = db.collection("classes").doc(classId);
    const doc = await userRef.get();
    if (!doc.exists) {
      console.log("No such document!");
      return null;
    } else {
      return doc.data();
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

export { db, getClassData };
