import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(config);
const ProjectFirestore = getFirestore(app);
// const ProjectAuth = getAuth(app);

// const google_provider = new GoogleAuthProvider();
// const signInWithGoogle = () => ProjectAuth.signInWithGoogle(google_provider);
// const signOut = () => ProjectAuth.signOut();

export { ProjectFirestore };
