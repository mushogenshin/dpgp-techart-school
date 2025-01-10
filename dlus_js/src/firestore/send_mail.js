import { db } from "../firebase_config";
import crypto from "crypto";

const EXPIRATION_MINUTES = 2;
const CLOUD_FN_ENDPOINT = "https://asia-southeast1-dpgp-techart.cloudfunctions.net";

const sendNewsletterEmail = async (email) => {
  // SECURITY: must add a token to the unsubscribe link
  const unsubscribeToken = generateUnsubscribeToken(email);

  const unsubscribeLink = `${CLOUD_FN_ENDPOINT}/unsubscribe?token=${unsubscribeToken}`;
  await db.collection("mail").add({
    to: email,
    message: {
      subject: "📰 Your Cúc Cu Weekly Newsletter",
      html: `<p>Here's your weekly newsletter!</p>
<small>Don't want to receive these emails anymore? <a href="${unsubscribeLink}">Unsubscribe</a>.</small>`,
      },
  }).then(() => console.log(`Queued newsletter for delivery to ${email}!`));
};

const generateUnsubscribeToken = (email) => {
  const SECRET_KEY = process.env.EMAIL_UNSUBSCRIPTION_SECRET_KEY;
  return crypto.createHmac('sha256', SECRET_KEY)
               .update(email)
               .digest('hex');
}

/**
 * Generates a verification code and stores it in Firestore.
 *
 * @param {string} email - The email address to generate the verification code for.
 * @returns {Promise<string>} The generated verification code.
 */
const generateVerificationCode = async (email) => {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString(); // Generate a 6-digit code as a string
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + EXPIRATION_MINUTES);

  await db.collection("mail_verification").doc(sanitizeEmail(email)).set({
    code: verificationCode,
    expires_at: expirationTime,
  });

  return verificationCode;
};

/**
 * Sends an email with the verification code.
 *
 * @param {string} email - The email address to send the verification code to.
 * @param {boolean} dryRun - Whether to simulate sending the email.
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (email, dryRun) => {
  if (dryRun) {
    console.log(`📦 Dry run: Queued verification email for delivery to ${email}`);
    return;
  }

  const verificationCode = await generateVerificationCode(email);

  await db
    .collection("mail")
    .add({
      to: email,
      // using one of the templates in `mail_templates` collection
      template: {
        name: "verify_email",
        data: {
          verificationCode: verificationCode,
          timeOut: EXPIRATION_MINUTES,
        },
      },
    })
    .then(() => console.log(`📦 Queued verification email for delivery to ${email}`));
};

/**
 * Verifies the provided verification code for the given email.
 *
 * @param {string} email - The email address to verify the code for.
 * @param {string} code - The verification code to verify.
 * @returns {Promise<boolean>} True if the verification is successful, otherwise throws an error.
 */
const verifyCode = async (email, code) => {
  const docRef = db.collection("mail_verification").doc(sanitizeEmail(email));
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error(`👀 No verification code found for email ${email}`);
  }

  const data = doc.data();
  const currentTime = new Date();

  if (currentTime > data.expires_at.toDate()) {
    throw new Error("⌛️ Verification code has expired.");
  }

  if (data.code !== code.toString()) {
    throw new Error("⛔️ Invalid verification code.");
  }

  console.log("✅ Email verification successful!");
  return true;
};

/**
 * Removes the dots from the local part of the email address.
 *
 * @param {string} email - The email address to sanitize.
 * @returns {string} The sanitized email address.
 */
const sanitizeEmail = (email) => {
  const [localPart, domainPart] = email.split("@");
  return `${localPart.replace(/\./g, "")}@${domainPart}`;
};

// Example usage
// sendVerificationEmail("hoan.sgn@gmail.com").catch(console.error);
// verifyCode("hoansgn@gmail.com", "835422").catch(console.error);
sendNewsletterEmail("hoansgn@gmail.com").catch(console.error);

export { sendVerificationEmail, verifyCode };
