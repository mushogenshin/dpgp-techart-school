import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

export { db };
