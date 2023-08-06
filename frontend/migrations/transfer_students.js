const admin = require("firebase-admin");

const sourceApp = admin.initializeApp(
  {
    credential: admin.credential.cert(
      require("../.keys/musho-genshin-firebase-adminsdk-wuujw-9f53e2258c.json")
    ),
    databaseURL: "https://musho-genshin.firebaseapp.com",
  },
  "sourceApp"
);

const destinationApp = admin.initializeApp(
  {
    credential: admin.credential.cert(
      require("../.keys/dpgp-techart-firebase-adminsdk-1pzwt-ff1a0d3c2d.json")
    ),
    databaseURL: "https://dpgp-techart.firebaseapp.com",
  },
  "destinationApp"
);

const sourceDb = sourceApp.firestore();
const destinationDb = destinationApp.firestore();

async function copyCollection(collectionName) {
  const snapshot = await sourceDb.collection(collectionName).get();
  const writeBatch = destinationDb.batch();

  snapshot.docs.forEach((doc) => {
    const docRef = destinationDb.collection(collectionName).doc();
    writeBatch.set(docRef, doc.data());
  });

  return writeBatch.commit();
}

// Usage
copyCollection("students").then(() =>
  console.log("Collection copied successfully")
);
