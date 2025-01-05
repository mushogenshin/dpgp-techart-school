import { listAllPendingTickets } from "../../firestore/tickets";

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

  console.log(pendingTickets);
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true, // we don't want this to be available to the public
};
