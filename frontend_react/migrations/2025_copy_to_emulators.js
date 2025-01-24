const admin = require("firebase-admin");

const productionApp = admin.initializeApp(
  {
    credential: admin.credential.cert(
      require("../.keys/dpgp-techart-firebase-adminsdk-1pzwt-ff1a0d3c2d.json")
    ),
    databaseURL: "https://dpgp-techart.firebaseapp.com",
  },
  "productionApp"
);

const sourceDb = productionApp.firestore();
const destinationDb = productionApp.firestore();

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
