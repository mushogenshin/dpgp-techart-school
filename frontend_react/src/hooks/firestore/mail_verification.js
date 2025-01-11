import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase_config";

const EXPIRATION_MINUTES = 2;

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

  await setDoc(doc(db, "mail_verification", sanitizeEmail(email)), {
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
const sendVerificationEmail = async (email, dryRun = false) => {
  if (dryRun) {
    console.log(
      `📦 Dry run: Queued verification email for delivery to ${email}`
    );
    return;
  }

  const verificationCode = await generateVerificationCode(email);

  await addDoc(collection(db, "mail"), {
    to: email,
    // using one of the templates in `mail_templates` collection
    template: {
      name: "verify_email",
      data: {
        verificationCode: verificationCode,
        timeOut: EXPIRATION_MINUTES,
      },
    },
  }).then(() =>
    console.log(`📦 Queued verification email for delivery to ${email}`)
  );
};

/**
 * Verifies the provided verification code for the given email.
 *
 * @param {string} email - The email address to verify the code for.
 * @param {string} code - The verification code to verify.
 * @returns {Promise<boolean>} True if the verification is successful, otherwise throws an error.
 */
const verifyCode = async (email, code) => {
  const docRef = doc(db, "mail_verification", sanitizeEmail(email));
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error(`👀 No verification code found for email ${email}`);
  }

  const data = docSnap.data();
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

export { sendVerificationEmail, verifyCode };
