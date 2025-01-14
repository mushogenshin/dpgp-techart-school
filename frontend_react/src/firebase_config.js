import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const config = {
  apiKey: "AIzaSyCsnQ3U3Cz3f5mv31NXLgxUtruQCIujEt8",
  authDomain: "dpgp-techart.firebaseapp.com",
  projectId: "dpgp-techart",
  storageBucket: "dpgp-techart.appspot.com",
  messagingSenderId: "224532426867",
  appId: "1:224532426867:web:eafd8876307b18c48fba06",
  measurementId: "G-6WXJM0P8D6",
};

const app = initializeApp(config);
const db = getFirestore(app);
const storage = getStorage(app);

// console.log("HOAN: Firebase app initialized");

// // Connect to Firestore Emulator if running locally
// if (
//   window.location.hostname === "localhost" ||
//   window.location.hostname === "127.0.0.1"
// ) {
//   console.log(
//     "HOAN: Running in local environment. Connecting to Firestore emulator."
//   );
//   connectFirestoreEmulator(db, "localhost", 8081);
// }

export { db, storage };
