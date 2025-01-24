const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin SDK for production Firestore
const serviceAccount = require("../.keys/dpgp-techart-firebase-adminsdk-1pzwt-ff1a0d3c2d.json");
const prodApp = initializeApp(
  {
    credential: cert(serviceAccount),
    databaseURL: "https://dpgp-techart.firebaseapp.com",
  },
  "prodApp"
);

const prodDb = getFirestore(prodApp);
// console.log(
//   `Connected to production Firestore: ${JSON.stringify(prodDb._settings)}`
// );

// Initialize Firebase Admin SDK for Firestore emulator
const emulatorApp = initializeApp(
  {
    projectId: "dpgp-techart",
  },
  "emulatorApp"
);

const emulatorDb = getFirestore(emulatorApp);
emulatorDb.settings({
  host: "localhost:8080",
  ssl: false,
});
console.log(
  `Connected to Firestore emulator: ${JSON.stringify(emulatorDb._settings)}`
);

const collections = ["classes"];

async function copyDocuments(numOfDocs = 10) {
  for (const coll of collections) {
    const prodCollectionRef = prodDb.collection(coll);
    const emulatorCollectionRef = emulatorDb.collection(coll);

    const snapshot = await prodCollectionRef.limit(numOfDocs).get();
    for (const doc of snapshot.docs) {
      const data = doc.data();
      console.log(`Document ${doc.id} from ${coll}:`, data);
      try {
        await emulatorCollectionRef.doc(doc.id).set(data);
        console.log(`Copied document ${doc.id} from ${coll}`);
      } catch (error) {
        console.error(`Error copying document ${doc.id} from ${coll}:`, error);
      }
    }
  }
}

copyDocuments(2)
  .then(() => {
    console.log("Documents copied successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error copying documents:", error);
    process.exit(1);
  });
