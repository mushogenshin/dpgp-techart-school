import {} from "../../firestore/tickets";

const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "approve",
  description: "Duyệt ticket ✅",
  // NOTE: this non-global command is not available in DM
  options: [
    {
      name: "ticket",
      description: "Number của ticket muốn approve",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "correction",
      description: "Mã module cần override",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, client, _handler }) => {
  // TODO: grab email
  // TODO: grab product code, desugared to module ID
  // TODO: grab user document (do migration if necessary)
  // TODO: add enrollment
  // TODO: mark ticket as resolved
  // TODO: send confirmation message
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true, // we don't want this command to be available to the public
};
