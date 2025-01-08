import { admin, db } from "../firebase_config";

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
    console.log(`📦 Dry run: Queued email for delivery to ${email}`);
    return;
  }

  const verificationCode = await generateVerificationCode(email);

  await db
    .collection("mail")
    .add({
      to: email,
      message: {
        subject: "👾 Your Verification Code",
        text: `Your verification code is ${verificationCode}. It will expire in ${EXPIRATION_MINUTES} minutes.`,
        html: `<p>Your verification code is <strong>${verificationCode}</strong>. It will expire in ${EXPIRATION_MINUTES} minutes.</p>`,
      },
    })
    .then(() => console.log(`📦 Queued email for delivery to ${email}`));
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

  console.log("✅ Verification successful!");
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
