import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(config);
const db = getFirestore(app);
var isEmulator = false;
const storage = getStorage(app);

// Connect to Firestore Emulator if running locally
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log(
    "Running in local environment. Connecting to Firestore emulator."
  );
  isEmulator = true;
  connectFirestoreEmulator(db, "localhost", 8080);
}

export { db, isEmulator, storage };
