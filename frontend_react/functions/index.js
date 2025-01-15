const admin = require("firebase-admin");
const functions = require("firebase-functions/v1");
const logger = require("firebase-functions/logger");
const { setGlobalOptions } = require("firebase-functions/v2");
// const { onRequest } = require("firebase-functions/v2/https");

admin.initializeApp();
setGlobalOptions({ region: "asia-southeast1" });

const db = admin.firestore();

// Connect to Firestore Emulator if running locally
if (process.env.FUNCTIONS_EMULATOR) {
  console.log(
    "Running in local environment. Connecting to Firestore emulator."
  );
  db.settings({
    host: "localhost:8081",
    ssl: false,
  });
}

/**
 * This `auth.user().onCreate` trigger stays in v1 as it is not yet supported in v2.
 */
exports.migrateEnrollmentHistory = functions
  .region("asia-southeast1")
  .auth.user()
  .onCreate(async (user) => {
    logger.info(`auth.user().onCreate() -> user: ${JSON.stringify(user)}`);

    const uid = user.uid;
    const email = user.email;
    const displayName = user.displayName;

    await setEnrollmentFromHistory(uid, email, displayName, () => {
      return Promise.resolve();
    });
  });

/**
 * Creates a new user profile whose enrollments are migrated from the old user profile.
 */
const setEnrollmentFromHistory = async (uid, email, displayName, callback) => {
  await db
    .collection("enrollment_migration")
    .doc(email)
    .get()
    .then(async (migrateUserDoc) => {
      const userProfile = {
        email: email,
        full_name: displayName,
        created_at: new Date(),
      };
      let migrateData = migrateUserDoc.data();
      if (migrateData) {
        userProfile.full_name = migrateData.full_name || userProfile.full_name;
        userProfile.enrollments =
          migrateData.enrollments || userProfile.enrollments;
      }
      db.collection("users")
        .doc(uid)
        .set(userProfile)
        .then(function () {
          callback();
        })
        .catch((error) => {
          logger.error(`An error occured when registering account: ${error}`);
        });
    })
    .catch((error) => {
      logger.error(
        `An error occured when migrating enrollment history: ${error}`
      );
    });
};
