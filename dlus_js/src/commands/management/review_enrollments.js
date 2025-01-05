import {
  listAllPendingTickets,
  prettifyTicketData,
} from "../../firestore/tickets";

const {
  ApplicationCommandOptionType,
  MessageFlags,
  InteractionContextType,
} = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "review_enrollments",
  description: "Xem các request đăng ký cần approve",
  // NOTE: allowing all contexts: guild, DM, private channel
  options: [
    {
      name: "limit",
      description: "Số lượng request muốn xem",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, client, _handler }) => {
  await interaction.deferReply();

  // fetch all pending tickets
  const limit = interaction.options.get("limit");
  const pendingTickets = await listAllPendingTickets(limit);

  const ticketCount = limit
    ? Math.min(limit, pendingTickets.length)
    : pendingTickets.length;
  await interaction.editReply({
    content: `Có ${ticketCount} request cần review`,
    flags: MessageFlags.Ephemeral,
  });

  for (const ticket of pendingTickets) {
    const prettyTicket = prettifyTicketData(ticket);
    await interaction.followUp({
      content: prettyTicket,
      flags: MessageFlags.Ephemeral,
    });
  }
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true, // we don't want this command to be available to the public
};
