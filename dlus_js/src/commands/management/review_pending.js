import {
  listAllPendingTickets,
  prettifyTicketData,
} from "../../firestore/tickets";

const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "tickets",
  description: "Xem các request đăng ký 🔎",
  // NOTE: this non-global command is not available in DM
  options: [
    {
      name: "limit",
      description: "Số lượng tickets muốn xem",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, _client, _handler }) => {
  await interaction.deferReply();

  // fetch all pending tickets
  const limit = interaction.options.getInteger("limit");
  const pendingTickets = await listAllPendingTickets(limit);

  const ticketCount = limit
    ? Math.min(limit, pendingTickets.length)
    : pendingTickets.length;

  if (ticketCount === 0) {
    return interaction.editReply({
      content: "Yay! Hổng có request nào cần review hết :woman_gesturing_ok:",
      flags: MessageFlags.Ephemeral,
    });
  }

  await interaction.editReply({
    content: `Có ${ticketCount} request cần review`,
    flags: MessageFlags.Ephemeral,
  });

  for (let i = 0; i < pendingTickets.length; i++) {
    const ticket = pendingTickets[i];
    const prettyTicket = prettifyTicketData(ticket);
    await interaction.followUp({
      content: `[${i + 1}/${pendingTickets.length}] ${prettyTicket}`,
      flags: MessageFlags.Ephemeral,
    });
  }
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true, // we don't want this command to be available to the public
};
