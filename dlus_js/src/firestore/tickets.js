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
  console.log(`[1/2] Checking pending tickets of user ${discordUser.username}`);

  try {
    const userDocRef = db.collection("enrollment_tickets").doc(discordUser.id);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.log(`[2/2] User ${discordUser.username} has no ticket record`);
      return 0;
    }

    const userData = userDoc.data();
    const unResolvedTickets = (userData.tickets || []).filter(
      (ticket) => ticket.resolved === false || ticket.resolved === undefined
    );

    console.log(
      `[2/2] User ${interaction.user.username} has ${unResolvedTickets.length} pending tickets.`
    );
    return unResolvedTickets.length;
  } catch (error) {
    console.error(
      `[2/2] Error checking pending tickets for Discord user ${discordUser.username}`,
      error
    );
    return 0;
  }
};

/**
 * @returns {Promise<number>} The next ticket number.
 */
const getNextTicketNumber = async () => {
  return await db.runTransaction(async (transaction) => {
    const statsRef = db.collection("enrollment_stats").doc("stats");
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
 * Adds an enrollment ticket for a Discord user.
 * @param {User} discordUser - The Discord user to add the ticket for.
 * @param {string} channelId - The Discord channel ID where the ticket was requested.
 * @param {APIApplicationCommandOptionChoice<number>} product - The product to enroll in.
 * @param {APIApplicationCommandOptionChoice<string>} email - The email to enroll with.
 * @param {ApplicationCommandOptionType.Attachment} screenshot - The transaction screenshot.
 * @returns {Promise<number | undefined>} The ticket number.
 */
const addTicket = async (
  discordUser,
  channelId,
  product,
  email,
  screenshot
) => {
  console.log(`[1/2] Checking ticket record of user ${discordUser.username}`);

  try {
    const ticketNumber = await getNextTicketNumber();
    const userDocRef = db.collection("enrollment_tickets").doc(discordUser.id);
    const userDoc = await userDocRef.get();

    // make the ticket data from the command options
    const ticketData = {
      number: ticketNumber,
      product: product.value,
      email: email.value,
      display_name: discordUser.displayName,
      proof: screenshot.attachment.url,
      channel: channelId,
      created_at: new Date().toISOString(),
      created_at_local: new Date().toLocaleString(),
      resolved: false,
    };

    // if the user has no ticket record, create one
    if (!userDoc.exists) {
      await userDocRef.set({
        tickets: [ticketData],
        username: discordUser.username,
      });
      console.log(
        `[2/2] Created new ticket record for user ${discordUser.username}`
      );
      return ticketNumber;
    }

    // otherwise, append to the existing record
    const userData = userDoc.data();
    const updatedTickets = [...(userData.tickets || []), ticketData];
    await userDocRef.update({
      tickets: updatedTickets,
    });
    console.log(`[2/2] Added new ticket for user ${discordUser.username}`);
    return ticketNumber;
  } catch (error) {
    console.error(
      `[2/2] Error adding ticket for Discord user ${discordUser.username}`,
      error
    );
    return undefined;
  }
};

export { getNumPendingTickets, addTicket };
