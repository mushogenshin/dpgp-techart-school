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

/**
 * Checks the number of pending enrollment tickets for a Discord user.
 * @param {User} discordUser - The Discord user to check.
 * @returns {Promise<number>} The number of pending tickets.
 */
const getNumPendingTickets = async (discordUser) => {
  //   console.log(
  //     `Checking pending tickets for Discord user ${discordUser.username}`
  //   );

  try {
    const userDocRef = db.collection("enrollment_tickets").doc(discordUser.id);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.log(`Discord user ${discordUser.username} has no ticket record`);
      return 0;
    }

    const userData = userDoc.data();
    const unResolvedTickets = (userData.tickets || []).filter(
      (ticket) => ticket.resolved === false || ticket.resolved === undefined
    );
    return unResolvedTickets.length;
  } catch (error) {
    console.error(
      `Error checking pending tickets for Discord user ${discordUser.username}`,
      error
    );
    return 0;
  }
};

/**
 * Adds an enrollment ticket for a Discord user.
 * @param {User} discordUser - The Discord user to add the ticket for.
 * @param {APIApplicationCommandOptionChoice<number>} product - The product to enroll in.
 * @param {APIApplicationCommandOptionChoice<string>} email - The email to enroll with.
 * @param {ApplicationCommandOptionType.Attachment} screenshot - The transaction screenshot.
 * @returns {Promise<boolean>} True if the ticket was added successfully.
 */
const addTicket = async (discordUser, product, email, screenshot) => {
  console.log(`Adding ticket for Discord user ${discordUser.username}`);

  try {
    const userDocRef = db.collection("enrollment_tickets").doc(discordUser.id);
    const userDoc = await userDocRef.get();

    const ticketData = {
      product: product.value,
      email: email.value,
      display_name: discordUser.displayName,
      screenshot: screenshot.attachment.url,
      created_at: new Date().toISOString(),
      created_at_local: new Date().toLocaleString(),
      resolved: false,
    };

    if (!userDoc.exists) {
      console.log(`Discord user ${discordUser.username} has no ticket record`);
      await userDocRef.set({
        tickets: [ticketData],
      });
      return true;
    }

    const userData = userDoc.data();
    const updatedTickets = [...(userData.tickets || []), ticketData];
    await userDocRef.update({
      tickets: updatedTickets,
    });
    return true;
  } catch (error) {
    console.error(
      `Error adding ticket for Discord user ${discordUser.username}`,
      error
    );
    return false;
  }
};

export { getNumPendingTickets, addTicket };
