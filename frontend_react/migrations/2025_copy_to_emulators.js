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
// console.log(
//   `Connected to Firestore emulator: ${JSON.stringify(emulatorDb._settings)}`
// );

// ------------------------------------------------------------
async function copyProdToEmulator(src, dst, collections) {
  for (const [coll, docIds] of Object.entries(collections)) {
    const prodCollectionRef = src.collection(coll);
    const emulatorCollectionRef = dst.collection(coll);

    for (const docId of docIds) {
      const docRef = prodCollectionRef.doc(docId);
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data();
        // console.log(`Document ${doc.id} from ${coll}:`, data);
        try {
          await emulatorCollectionRef.doc(doc.id).set(data);
          console.log(`Copied document ${doc.id} from ${coll}`);
        } catch (error) {
          console.error(
            `Error copying document ${doc.id} from ${coll}:`,
            error
          );
        }
      } else {
        console.log(`Document ${docId} does not exist in collection ${coll}`);
      }
    }
  }
}

const collections = {
  // users: ["0GC6YBv6pkNyZ72KQOy9uloFKI43"],
  classes: ["ACA02", "FAP03", "PYTA_2024"],
  modules: ["ACA02_mod1", "FAP03_trackA", "PYTA_2024_m1"],
  contents: [
    "ACA_intro_body_plan",
    "ACA_intro_head_skull",
    "FAP_intro_to_structure",
    "FAP_intro_to_skull",
    "PYTA_intro_mindset",
    "PYTA_2024_intro_mindset_2",
    "PYTA_2024_python_maya_intro",
  ],
};

// copyProdToEmulator(prodDb, emulatorDb, collections)
//   .then(() => {
//     console.log("Documents copied successfully");
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error("Error copying documents:", error);
//     process.exit(1);
//   });

// ------------------------------------------------------------
async function allowPeekAllFirstNLessons(db, n = 1, value = true) {
  const contentsRef = db.collection("contents");
  const snapshot = await contentsRef.get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  const promises = snapshot.docs.map(async (doc) => {
    const data = doc.data();
    if (data.lessons && data.lessons.length > 0) {
      for (let i = 0; i < Math.min(n, data.lessons.length); i++) {
        data.lessons[i].allows_peek = value;
      }
      await contentsRef.doc(doc.id).update({ lessons: data.lessons });
      console.log(`Updated document ${doc.id}`);
    }
  });

  await Promise.all(promises);
}

// // NOTE: change to Emulator Firestore for testing
// allowPeekAllFirstNLessons(prodDb, 2, true)
//   .then(() => {
//     console.log("Documents updated successfully");
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error("Error updating documents:", error);
//     process.exit(1);
//   });

// ------------------------------------------------------------
async function allowPeekForPrefixedDocs(db, prefixes, n = 1, value = true) {
  const contentsRef = db.collection("contents");
  const snapshot = await contentsRef.get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  const promises = snapshot.docs.map(async (doc) => {
    if (prefixes.some((prefix) => doc.id.startsWith(prefix))) {
      const data = doc.data();
      if (data.lessons && data.lessons.length > 0) {
        for (let i = 0; i < Math.min(n, data.lessons.length); i++) {
          data.lessons[i].allows_peek = value;
        }
        await contentsRef.doc(doc.id).update({ lessons: data.lessons });
        console.log(`Updated document ${doc.id}`);
      }
    }
  });

  await Promise.all(promises);
}

// NOTE: change to Emulator Firestore for testing
allowPeekForPrefixedDocs(prodDb, ["ACA", "DPRG_2023"], 2, false)
  .then(() => {
    console.log("Documents with specified prefixes updated successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error updating documents with specified prefixes:", error);
    process.exit(1);
  });
