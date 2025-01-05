import {
  getProductsMapping,
  prettifyProductsMapping,
} from "../../firestore/enrollments";

const { MessageFlags, ApplicationCommandOptionType } = require("discord.js");

const cooldowns = new Map();
const COOLDOWN_SECONDS = 600; // Set the cooldown time in seconds
const DEV_USER_IDS = ["454667337229139988"];

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "list",
  description: "Liệt kê các khoá học",
  options: [
    {
      name: "full",
      description: "Hiển thị chi tiết",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, _client, _handler }) => {
  const userId = interaction.user.id;

  if (!DEV_USER_IDS.includes(userId)) {
    const now = Date.now();
    const cooldownAmount = COOLDOWN_SECONDS * 1000;

    if (cooldowns.has(userId)) {
      const expirationTime = cooldowns.get(userId) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = Math.ceil((expirationTime - now) / 1000);
        return interaction.reply({
          content: `⏳ Woah woah, ${timeLeft} seconds cooldown remaining before you can use this command again.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    cooldowns.set(userId, now);
    setTimeout(() => cooldowns.delete(userId), cooldownAmount);
  }

  await interaction.deferReply();

  const verbose = interaction.options.getBoolean("full") || false;
  const productsMapping = await getProductsMapping();
  interaction.editReply(
    `## 📝 Danh mục các sản phẩm ở DPGP:\n\n${prettifyProductsMapping(
      productsMapping,
      verbose
    )}`
  );
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: false,
};
