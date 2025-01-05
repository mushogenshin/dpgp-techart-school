import { db } from "../firebase_config";
import { getNextTicketNumber } from "./enrollments";

const {
  User,
  ApplicationCommandOptionType,
  APIApplicationCommandOptionChoice,
} = require("discord.js");

/**
 * Fetches all pending tickets and sorts them from latest to oldest.
 * @param {APIApplicationCommandOptionChoice<number>} [limit] - Optional parameter to limit the number of queried tickets.
 * @returns {Promise<Array>} The sorted list of pending tickets.
 */
const listAllPendingTickets = async (limit) => {
  try {
    const ticketsRef = db.collection("enrollment_tickets");
    const snapshot = await ticketsRef.where("resolved", "==", false).get(); // ignore `undefined` resolved status
    let pendingTickets = [];

    snapshot.forEach((doc) => {
      pendingTickets.push(doc.data());
    });

    pendingTickets.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    if (limit) {
      pendingTickets = pendingTickets.slice(0, limit.value);
    }

    return pendingTickets;
  } catch (error) {
    console.error("Error fetching pending tickets:", error);
    throw error;
  }
};

/**
 * Prettifies ticket data for a Discord message.
 * @param {Object} ticket - The ticket data to prettify.
 * @returns {string} The prettified ticket data.
 */
const prettifyTicketData = (ticket) => {
  return (
    `**Ticket Number:** ${ticket.number}\n` +
    `Created At: ${ticket.created_at_local}\n` +
    `Transaction: [Screenshot](${ticket.proof})\n` +
    `- Requested: \`${ticket.requested_enrollment}\` (product code: ${ticket.requested_product})\n` +
    `- Submitted by: ${ticket.display_name} (${ticket.username})\n` +
    `- Email: \`${ticket.email}\``
  );
};

/**
 * Checks the number of pending enrollment tickets for a Discord user.
 * @param {User} discordUser - The Discord user to check.
 * @returns {Promise<number>} The number of pending tickets.
 */
const getUsrNumPendingTickets = async (discordUser) => {
  console.log(`[1/2] Checking pending tickets of user ${discordUser.username}`);

  try {
    const ticketsRef = db.collection("enrollment_tickets");
    const snapshot = await ticketsRef
      .where("user_id", "==", discordUser.id)
      .where("resolved", "==", false)
      .get();

    const pendingTicketsCount = snapshot.size;

    console.log(
      `[2/2] User ${discordUser.username} has ${pendingTicketsCount} pending tickets.`
    );
    return pendingTicketsCount;
  } catch (error) {
    console.error(
      `[2/2] Error checking pending tickets for Discord user ${discordUser.username}`,
      error
    );
    return 0;
  }
};

/**
 * Fetches a ticket by its number.
 * @param {number} ticketNumber - The ticket number to fetch.
 * @returns {Promise<Object | null>} The ticket data or null if not found.
 */
const getTicketByNumber = async (ticketNumber) => {
  try {
    const ticketsRef = db.collection("enrollment_tickets");
    const snapshot = await ticketsRef.where("number", "==", ticketNumber).get();

    if (snapshot.empty) {
      console.log(`Ticket number ${ticketNumber} not found.`);
      return null;
    }

    const ticket = snapshot.docs[0].data();
    return ticket;
  } catch (error) {
    console.error(`Error fetching ticket number ${ticketNumber}:`, error);
    throw error;
  }
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
  moduleId,
  email,
  screenshot
) => {
  console.log(`[1/2] Making ticket for user ${discordUser.username}`);

  try {
    const ticketNumber = await getNextTicketNumber();

    // make the ticket data from the command options
    const ticketData = {
      number: ticketNumber,
      requested_product: product.value,
      requested_enrollment: moduleId,
      email: email.value,
      proof: screenshot.attachment.url,
      channel: channelId,
      user_id: discordUser.id,
      username: discordUser.username,
      display_name: discordUser.displayName,
      created_at: new Date().toISOString(),
      created_at_local: new Date().toLocaleString(),
      resolved: false,
    };

    // add the ticket as a new document in the "enrollment_tickets" collection
    await db.collection("enrollment_tickets").add(ticketData);

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

export {
  listAllPendingTickets,
  getTicketByNumber,
  getUsrNumPendingTickets,
  prettifyTicketData,
  addTicket,
};
