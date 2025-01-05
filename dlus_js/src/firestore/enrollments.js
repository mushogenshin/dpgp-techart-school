import { db } from "../firebase_config";

const {
  User,
  ApplicationCommandOptionType,
  APIApplicationCommandOptionChoice,
} = require("discord.js");

/**
 * Fetches class data from Firestore.
 * @param {string} classId - The ID of the class to fetch.
 * @returns {Promise<Object|null>} The class data or null if no such document exists.
 */
const getClassData = async (classId) => {
  try {
    const userRef = db.collection("classes").doc(classId);
    const doc = await userRef.get();
    if (!doc.exists) {
      console.log("No such document!");
      return null;
    } else {
      return doc.data();
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};
