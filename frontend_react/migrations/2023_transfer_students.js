// This script migrates data from the old "musho-genshin" Firebase Firestore
// database to the newer "dpgp-techart", copy the `students` collection from the
// source database to the `enrollment_migration` collection in the destination
// database, for each document it copies, it will transform the `enrollments`
// field to include only module IDs.

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

async function copyCollection(srcColl, dstColl) {
  const snapshot = await sourceDb.collection(srcColl).get();
  // NOTE: if you want to limit the number of documents copied, use this instead:
  // const snapshot = await sourceDb.collection(srcColl).limit(10).get();
  const writeBatch = destinationDb.batch();

  snapshot.docs.forEach((doc) => {
    const docRef = destinationDb.collection(dstColl).doc(doc.id);
    const student = doc.data();

    // map over the student's enrollments and return only the module IDs
    let enrollments = [];
    if (Array.isArray(student.enrollments)) {
      enrollments = student.enrollments.map((enrollment) => enrollment.module);
    }
    writeBatch.set(docRef, { ...student, enrollments });
  });

  return writeBatch.commit();
}

// Usage
copyCollection("students", "enrollment_migration").then(() =>
  console.log("Collection copied successfully")
);
