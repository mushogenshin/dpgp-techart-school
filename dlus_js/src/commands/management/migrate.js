import { migrateUserEnrollments } from "../../firestore/enrollments";

const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "migrate",
  description: "Merge user enrollment history",
  // NOTE: this non-global command is not available in DM
  options: [
    {
      name: "email",
      description: "Email của user",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, _client, _handler }) => {
  const email = interaction.options.getString("email");
  migrateUserEnrollments(email)
    .then(() => {
      interaction.reply({
        content: `✅ Migrated enrollments for user with email ${email}`,
        flags: MessageFlags.Ephemeral,
      });
    })
    .catch((error) => {
      interaction.reply({
        content: `❌ Error migrating enrollments for user with email ${email}`,
        flags: MessageFlags.Ephemeral,
      });
    });
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true,
  // deleted: true,
};
