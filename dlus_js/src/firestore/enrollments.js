import { admin, db } from "../firebase_config";
import { User } from "discord.js";

/**
 * @returns {Promise<Object>} The product code to module ID mapping object.
 */
const getProductsMapping = async () => {
  try {
    const productsRef = db.collection("enrollment_desc").doc("products");
    const productsDoc = await productsRef.get();

    if (!productsDoc.exists) {
      throw new Error("No products document found!");
    }

    const productsData = productsDoc.data();
    return productsData.mapping;
  } catch (error) {
    console.error("Error fetching products mapping:", error);
    throw error;
  }
};

/**
 * Prettifies the products mapping object into a string for Discord message.
 * @param {Object} mapping - The raw products mapping object.
 * @param {boolean} verbose - Whether to include module IDs in the output.
 * @returns {string} The prettified products mapping string.
 */
const prettifyProductsMapping = (mapping, verbose) => {
  let prettifiedString = "";

  for (const [productCode, desc] of Object.entries(mapping)) {
    if (verbose) {
      prettifiedString += `- **${productCode}**: ${desc.name}. Modules: \`${desc.module_ids}\`\n\n`;
    } else {
      prettifiedString += `- **${productCode}**: ${desc.name}\n\n`;
    }
  }

  return prettifiedString;
};

/**
 * @returns {Promise<number>} The next ticket number.
 */
const getNextTicketNumber = async () => {
  return await db.runTransaction(async (transaction) => {
    const statsRef = db.collection("enrollment_desc").doc("stats");
    const statsDoc = await transaction.get(statsRef);

    if (!statsDoc.exists) {
      console.log("No ticket stats document found!");
      transaction.set(statsRef, { count: 1 });
      return 1;
    } else {
      const statsData = statsDoc.data();
      const newCount = (statsData.count || 0) + 1;
      transaction.update(statsRef, { count: newCount });
      return newCount;
    }
  });
};

/**
 * Gets the enrollment description for a product code.
 * @param {number} productCode - The product code to query.
 * @returns {Promise<Object | null>} The enrollment desc in the form of:
 * { module_ids: string, website_access: boolean }
 * or null if not found.
 */
const getEnrollmentDescFromProduct = async (productCode) => {
  try {
    const productsRef = db.collection("enrollment_desc").doc("products");
    const productsDoc = await productsRef.get();

    if (!productsDoc.exists) {
      throw new Error("No products document found!");
    }

    const productsData = productsDoc.data();
    const desc = productsData.mapping[productCode];

    if (!desc) {
      console.log(`Product code ${productCode} not found in mapping.`);
      return null;
    }

    return {
      module_ids: desc.module_ids,
      requires_website_access: desc.requires_website_access || false,
    };
  } catch (error) {
    console.error(
      `Error fetching module ID for product ${productCode}:`,
      error
    );
    throw error;
  }
};

/**
 * Finds a user document by email. This applies only to users who have
 * registered.
 * @param {string} email - The email to query.
 * @returns {Promise<Object | null>} The user document or null if not found.
 */
const findExistingUserByEmail = async (email) => {
  // TODO: sanitize both input email and query email from dots?
  try {
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("email", "==", email).get();

    if (querySnapshot.empty) {
      console.log(`No user found with email ${email}`);
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error);
    throw error;
  }
};

/**
 * Merges enrollment values from "enrollment_migration" collection into "users"
 * collection.
 * @param {string} email - The email to migrate enrollments for.
 * @returns {Promise<void>}
 */
const migrateUserEnrollments = async (email) => {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const userRef = db.collection("users").doc(userRecord.uid);
    const historyRef = db.collection("enrollment_migration").doc(email);

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const historyDoc = await transaction.get(historyRef);

      const historyData = historyDoc.exists
        ? historyDoc.data()
        : { enrollments: [] };

      const userData = userDoc.exists ? userDoc.data() : { email: email };
      const currEnrollments = userData.enrollments || [];

      const mergedEnrollments = historyData.enrollments
        ? [...new Set([...currEnrollments, ...historyData.enrollments])]
        : currEnrollments;

      const userUpdate = {
        ...userData,
        ...Object.fromEntries(
          Object.entries(historyData).filter(
            ([key, value]) => value !== null && value !== "" && key !== "email"
          )
        ),
        enrollments: mergedEnrollments, // must be last
      };

      if (userDoc.exists) {
        transaction.update(userRef, userUpdate);
      } else {
        transaction.set(userRef, userUpdate);
      }
    });
  } catch (error) {
    console.error("Error migrating user enrollments:", error);
    throw error;
  }
};

/**
 * Merges a string of enrollment module IDs into the "enrollments" field of a
 * user document.
 * @param {string} userId - The user document ID.
 * @param {string} enrollmentModuleIds - The comma-separated string of
 * enrollment module IDs.
 * @returns {Promise<void>}
 */
const addEnrollments = async (userId, enrollmentModuleIds) => {
  try {
    const userRef = db.collection("users").doc(userId);
    const moduleIdsArray = enrollmentModuleIds
      .split(",")
      .map((id) => id.trim());

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new Error(`User with ID ${userId} not found!`);
      }

      const userData = userDoc.data();
      const currEnrollments = userData.enrollments || [];
      const mergedEnrollments = [
        ...new Set([...currEnrollments, ...moduleIdsArray]),
      ];

      transaction.update(userRef, { enrollments: mergedEnrollments });
    });
  } catch (error) {
    console.error(
      `Error merging enrollment module IDs for user ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * Updates the "discord" field on the user document.
 * @param {string} userId - The user document ID.
 * @param {User} discordUser - The Discord user.
 * @returns {Promise<void>}
 */
const updateDiscordInfo = async (userId, discordUser) => {
  try {
    const userRef = db.collection("users").doc(userId);

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new Error(`User with ID ${userId} not found!`);
      }

      transaction.update(userRef, {
        discord: {
          user_id: discordUser.id,
          username: discordUser.username,
          updated_at: new Date(),
        },
      });
    });
  } catch (error) {
    console.error(`Error updating Discord info for user ${userId}:`, error);
    throw error;
  }
};

export {
  getProductsMapping,
  prettifyProductsMapping,
  getNextTicketNumber,
  getEnrollmentDescFromProduct,
  findExistingUserByEmail,
  addEnrollments,
  migrateUserEnrollments,
  updateDiscordInfo,
};
