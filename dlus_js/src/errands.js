import { db } from "./firebase_config";
import admin from "firebase-admin";

/**
 * Removes unwanted fields from a user document, i.e. createdTime, phoneNumber, and alias.
 */
const removedUnwantedFields = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    console.log("No such document!");
    return;
  }

  const userData = userDoc.data();
  const updateData = {};

  if (userData.createdTime) {
    const createdTimeString = userData.createdTime;
    const [time, date] = createdTimeString.split(" ");
    const [hours, minutes, seconds] = time.split(":");
    const [day, month, year] = date.split("/");

    const createdAt = new Date(year, month - 1, day, hours, minutes, seconds);

    updateData.created_at = createdAt;
    updateData.createdTime = admin.firestore.FieldValue.delete();
  }

  if (userData.phoneNumber === null) {
    updateData.phoneNumber = admin.firestore.FieldValue.delete();
  }

  if (userData.alias) {
    updateData.alias = admin.firestore.FieldValue.delete();
  }

  if (Object.keys(updateData).length > 0) {
    await userRef.update(updateData);
    console.log("Document successfully updated!");
  } else {
    console.log("No fields to update.");
  }
};

const cleanUpForAllUsers = async () => {
  const usersSnapshot = await db.collection("users").get();
  const promises = [];

  //   we already executed this
  //   usersSnapshot.forEach((doc) => {
  //     promises.push(removedUnwantedFields(doc.id));
  //   });

  await Promise.all(promises);
  console.log("All user documents have been processed.");
};

const duplicateCollection = async (sourceCollection, targetCollection) => {
  const sourceSnapshot = await db.collection(sourceCollection).get();
  const batch = db.batch();

  sourceSnapshot.forEach((doc) => {
    const targetDocRef = db.collection(targetCollection).doc(doc.id);
    batch.set(targetDocRef, doc.data());
  });

  await batch.commit();
  console.log(
    `Collection ${sourceCollection} has been duplicated to ${targetCollection}`
  );
};

// Example usage
// we already executed this
// duplicateCollection("enrollments_migration", "enrollment_migration");

const addMailTemplate = async () => {
  /** add a welcome email */
  await db.collection("mail_templates").doc("verify_email").set({
    subject: "👾 Your Verification Code",
    html: "<p>Your verification code is <strong>{{verificationCode}}</strong>. It will expire in {{timeOut}} minutes.</p>",
  });
};

// addMailTemplate();
