import { db } from "../firebase_config";
import crypto from "crypto";

// const CLOUD_FN_ENDPOINT = "https://asia-southeast1-dpgp-techart.cloudfunctions.net";
const CLOUD_FN_ENDPOINT = "https://unsubscribe-sddsnmo5oq-as.a.run.app";

/**
 * Sends a newsletter email to the specified email address.
 * @param {string} email - The email address to send the newsletter to.
 * @returns {Promise<void>}
 */
const sendSingleNewsletter = async (email) => {
  // SECURITY: must add a token to the unsubscribe link
  const unsubscribeToken = generateUnsubscribeToken(email);

  // Firebase gives us two flavors of the endpoint, region path or a unique app path
  const endpoint = CLOUD_FN_ENDPOINT.includes("cloudfunctions.net")
    ? `${CLOUD_FN_ENDPOINT}/unsubscribe`
    : CLOUD_FN_ENDPOINT;
  // the query string needs the token and email
  const unsubscribeLink = `${endpoint}/?token=${unsubscribeToken}&email=${encodeURIComponent(
    email
  )}`;

  await db
    .collection("mail")
    .add({
      to: email,
      message: {
        subject: "📰 Your Weekly Newsletter",
        html: `<p>Here's your weekly newsletter!</p>
<small>Don't want to receive these emails anymore? <a href="${unsubscribeLink}">Unsubscribe</a>.</small>`,
      },
    })
    .then(() => console.log(`Queued newsletter for delivery to ${email}!`));
};

/**
 * Sends a batch of newsletter emails.
 * @param {string[]} batch - The batch of email addresses to send the newsletter to.
 * @returns {Promise<void>}
 */
const sendBatchNewsletter = async (batch, identifier = "") => {
  console.log("First 5 emails:", batch.slice(0, 5));
  console.log("Last 5 emails:", batch.slice(-5));

  const batchWrite = db.batch();
  batch.forEach((email) => {
    const unsubscribeToken = generateUnsubscribeToken(email);
    const unsubscribeLink = `${CLOUD_FN_ENDPOINT}/?token=${unsubscribeToken}&email=${encodeURIComponent(
      email
    )}`;
    const docRef = db.collection("mail").doc();
    batchWrite.set(docRef, {
      to: email,
      message: {
        subject: `📰 Your Delayed Weekly Newsletter (${identifier})`,
        html: `<p>Here's your weekly newsletter!</p>
  <small>Don't want to receive these emails anymore? <a href="${unsubscribeLink}">Unsubscribe</a>.</small>`,
      },
    });
  });
  await batchWrite.commit();
};

/**
 * Sends a batch, then waits for a specified interval before sending the next batch.
 * @param {string[]} emails - The list of email addresses to send the newsletter to.
 * @param {number} batchSize - The number of emails to send in each batch.
 * @param {number} interval - The interval in milliseconds to wait between batches.
 * @returns {Promise<void>}
 */
const sendNewsletterBatchesWithInterval = async (
  emails,
  batchSize = 100,
  interval = 5000
) => {
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const batchIdentifier = `${i / batchSize + 1}`;
    await sendBatchNewsletter(batch, batchIdentifier);
    console.log(`Batch ${batchIdentifier} sent successfully.`);
    if (i + batchSize < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
};

/**
 * Generates a secure token with a secret key for email unsubscription.
 * @param {string} email - The email address to generate the unsubscribe token for.
 */
const generateUnsubscribeToken = (email) => {
  const SECRET_KEY = process.env.EMAIL_UNSUBSCRIPTION_SECRET_KEY;
  return crypto.createHmac("sha256", SECRET_KEY).update(email).digest("hex");
};

/**
 * Retrieves a list of unique email addresses from the "users",
 * "enrollment_migration", and "subscriptions" collections in Firestore.
 *   - `users` collection contains all registered users, and may contain guests
 *     who have not enrolled in any course. This is dynamic and may change over
 *     time.
 *   - `enrollment_migration` contains students from the old enrollment systems.
 *     This is static and will not change.
 *   - `subscriptions` contains anyone who have opted in for receiving emails.
 * @param {string[]} cc - An array of email addresses to CC on the newsletter.
 * @param {boolean} dryRun - Whether to skip big collections for testing.
 * @returns {Promise<string[]>} A promise that resolves to an array of unique
 * email addresses.
 */
const getMailingList = async (cc = [], dryRun = false) => {
  const emails = new Set(cc);
  const subscriptionsSnapshot = await db.collection("subscriptions").get();

  subscriptionsSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.opted_out) {
      console.log(`🤷‍♂️ User opted out: ${doc.id}`);
      emails.delete(doc.id); // overrides CC list
    } else {
      emails.add(doc.id);
    }
  });

  if (!dryRun) {
    // massive collections, so we need to be careful
    const usersSnapshot = await db.collection("users").get();
    const enrollmentSnapshot = await db
      .collection("enrollment_migration")
      .get();

    usersSnapshot.forEach((doc) => {
      const email = doc.data().email;
      if (email) {
        emails.add(email);
      }
    });

    enrollmentSnapshot.forEach((doc) => {
      emails.add(doc.id);
    });
  }

  return Array.from(emails);
};

// Example usage
// sendNewsletterEmail("hoansgn@gmail.com").catch(console.error);

getMailingList(["hoansgn@gmail.com", "mushogenshin@gmail.com"], true)
  .then((emails) => {
    console.log(`Total emails: ${emails.length}`);

    // emails.forEach((email) => {
    //   sendSingleNewsletter(email).catch(console.error);
    // });

    sendNewsletterBatchesWithInterval(emails, 1, 5000).catch(console.error);
  })
  .catch(console.error);

export {};
