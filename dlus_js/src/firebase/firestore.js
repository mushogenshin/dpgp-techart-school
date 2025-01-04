import { db } from "../firebase_config";

const { User } = require("discord.js");

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

/**
 * Checks the number of pending tickets for a Discord user.
 * @param {User} discordUser - The Discord user to check.
 * @returns {Promise<number>} The number of pending tickets.
 */
const getNumPendingTickets = async (discordUser) => {
  console.log(
    "Checking pending tickets for Discord user",
    discordUser.username
  );

  try {
    const userDocRef = db.collection("enrollment_tickets").doc(discordUser.id);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.log(`Discord user ${discordUser.username} has no ticket record.`);
      return 0;
    }

    const userData = userDoc.data();
    const tickets = userData.tickets || [];
    return tickets.length;
  } catch (error) {
    console.error(
      "Error checking pending tickets for Discord user",
      discordUser.username,
      error
    );
    return 0;
  }
};

export { getNumPendingTickets };
