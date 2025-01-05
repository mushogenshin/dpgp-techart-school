import { db } from "../firebase_config";

// const {
//   User,
//   ApplicationCommandOptionType,
//   APIApplicationCommandOptionChoice,
// } = require("discord.js");

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
 * Gets the enrollment module ID for a product code.
 * @param {number} productCode - The product code to query.
 * @returns {Promise<string | null>} The enrollment module ID or null if not found.
 */
const getEnrollmentModuleId = async (productCode) => {
  try {
    const productsRef = db.collection("enrollment_desc").doc("products");
    const productsDoc = await productsRef.get();

    if (!productsDoc.exists) {
      throw new Error("No products document found!");
    }

    const productsData = productsDoc.data();
    const moduleId = productsData.mapping[productCode];

    if (!moduleId) {
      console.log(`Product code ${productCode} not found in mapping.`);
      return null;
    }

    return moduleId;
  } catch (error) {
    console.error(
      `Error fetching module ID for product ${productCode}:`,
      error
    );
    throw error;
  }
};

export { getProductsMapping, getNextTicketNumber, getEnrollmentModuleId };
