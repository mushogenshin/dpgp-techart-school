const admin = require("firebase-admin");
const functions = require("firebase-functions/v1");
const logger = require("firebase-functions/logger");
const { setGlobalOptions } = require("firebase-functions/v2");
const {
  AuthUserRecord,
  AuthEventContext,
} = require("firebase-functions/identity");
// const { onRequest } = require("firebase-functions/v2/https");
// const { FieldValue } = require("firebase-admin/firestore");

// const dotenv = require("dotenv");
// const crypto = require("crypto");
// const express = require("express");
// const rateLimit = require("express-rate-limit");
// const cors = require("cors");

// // Load environment variables from .env file
// dotenv.config();

var serviceAccount = require("./.serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
setGlobalOptions({ region: "asia-southeast1" });

const db = admin.firestore();

// Connect to Firestore Emulator if running locally
if (process.env.FUNCTIONS_EMULATOR) {
  logger.info(
    "Running in local environment. Connecting to Firestore emulator."
  );
  db.settings({
    host: "localhost:8081",
    ssl: false,
  });
}

// const app = express();

// // Rate limiter middleware
// const limiter = rateLimit({
//   windowMs: 24 * 60 * 60 * 1000, // 1-day window
//   max: 20, // Limit each IP to N requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
// });

// app.use(limiter);
// app.use(
//   cors({
//     origin: "*",
//     allowedHeaders: ["Authorization", "Content-Type"],
//   })
// );

// const FRONTEND_URL = "https://school.dauphaigiaiphau.wtf";

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
        // use the migrated data if available
        userProfile.full_name = migrateData?.full_name ?? userProfile.full_name;
        userProfile.enrollments = migrateData?.enrollments ?? [];
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

/**
 * @param {AuthUserRecord} user
 * @param {AuthEventContext} context
 */
exports.updateLastSignInTime = functions
  .region("asia-southeast1")
  .auth.user()
  .beforeSignIn(async (user, context) => {
    logger.info(`beforeSignIn() -> user: ${JSON.stringify(user)}`);
    const uid = user.uid;

    try {
      const userDoc = await db.collection("users").doc(uid).get();
      if (userDoc.exists) {
        await db.collection("users").doc(uid).update({
          last_sign_in: new Date(),
        });
        console.log(`Updated last sign in time for user ${uid}`);
      } else {
        console.log(`User document for ${uid} does not exist`);
      }
    } catch (error) {
      console.error(`Error updating last sign in time for user ${uid}:`, error);
      // Optionally, you can return a response to block the sign-in if needed
      // return { status: 'BLOCK', message: 'Sign-in blocked' };
    }
  });

// // Handles a GET request triggered by the user clicking the unsubscribe link in the email.
// app.get("/unsubscribe", async (req, res) => {
//   const token = req.query.token;
//   if (!token) {
//     return res.status(400).send("Token is required");
//   }

//   const email = req.query.email;
//   if (!email) {
//     return res.status(400).send("Email is required");
//   }

//   const source = req.query.source || "unknown";
//   const generatedToken = generateSubscriptionToken(email, false);

//   if (token !== generatedToken) {
//     return res.status(400).send("Invalid token");
//   }

//   console.log(`Unsubscribing ${email}`);
//   const successRedirectUrl = `${FRONTEND_URL}/unsubscribe-success?email=${encodeURIComponent(
//     email
//   )}`;

//   await db
//     .collection("subscriptions")
//     .doc(email)
//     .set(
//       {
//         opted_out: true,
//         log: FieldValue.arrayUnion({
//           action: "unsubscribe",
//           at: new Date(),
//           source: source,
//         }),
//       },
//       { merge: true }
//     )
//     .then(() => {
//       // frontend success page
//       console.log(`Unsubscribed ${email} successfully`);
//       res.redirect(successRedirectUrl);
//     })
//     .catch((error) => {
//       console.log(`An error occured when unsubscribing: ${error}`);
//       res.status(500).send("Internal Server Error");
//     });
// });

// // Handles a POST request submitted by the user from the frontend form.
// app.post("/request-subscription", async (req, res) => {
//   const { email, source = "unknown" } = req.body;

//   if (!email) {
//     return res.status(400).send("Email is required");
//   }

//   try {
//     const approvalEndpoint =
//       "https://asia-southeast1-dpgp-techart.cloudfunctions.net/api/approve-subscription";
//     const token = generateSubscriptionToken(email, true);

//     await db.collection("mail").add({
//       to: email,
//       template: {
//         name: "request_subscription",
//         data: {
//           confirmationLink: `${approvalEndpoint}?token=${token}&email=${encodeURIComponent(
//             email
//           )}&source=${encodeURIComponent(source)}`,
//         },
//       },
//     });

//     res.status(200).send("Subscription confirmation email queued for delivery");
//   } catch (error) {
//     console.error("Error sending subscription confirmation email:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Handles a GET request triggered by the user clicking the confirmation link in the email.
// app.get("/approve-subscription", async (req, res) => {
//   const token = req.query.token;
//   if (!token) {
//     return res.status(400).send("Token is required");
//   }

//   const email = req.query.email;
//   if (!email) {
//     return res.status(400).send("Email is required");
//   }

//   const source = req.query.source || "unknown";
//   const generatedToken = generateSubscriptionToken(email, true);

//   if (token !== generatedToken) {
//     return res.status(400).send("Invalid token");
//   }

//   await db
//     .collection("subscriptions")
//     .doc(email)
//     .set(
//       {
//         opted_out: false,
//         log: FieldValue.arrayUnion({
//           action: "subscribe",
//           at: new Date(),
//           source: source,
//         }),
//       },
//       { merge: true }
//     )
//     .then(() => {
//       const successRedirectUrl = `${FRONTEND_URL}/subscribe-success?email=${encodeURIComponent(
//         email
//       )}`;
//       // frontend success page
//       res.redirect(successRedirectUrl);
//     })
//     .catch((error) => {
//       console.log(`An error occured when subscribing: ${error}`);
//       res.status(500).send("Internal Server Error");
//     });
// });

// const generateSubscriptionToken = (email, optingIn) => {
//   const SECRET_KEY = optingIn
//     ? process.env.EMAIL_SUBSCRIPTION_SECRET_KEY
//     : process.env.EMAIL_UNSUBSCRIPTION_SECRET_KEY;
//   return crypto.createHmac("sha256", SECRET_KEY).update(email).digest("hex");
// };

// exports.api = onRequest(app);
