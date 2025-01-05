import { getProductsMapping } from "../../firestore/enrollments";

const { MessageFlags } = require("discord.js");

const cooldowns = new Map();
const COOLDOWN_SECONDS = 600; // Set the cooldown time in seconds

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "list",
  description: "Liệt kê các khoá học",
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, _client, _handler }) => {
  const userId = interaction.user.id;
  const now = Date.now();
  const cooldownAmount = COOLDOWN_SECONDS * 1000;

  if (cooldowns.has(userId)) {
    const expirationTime = cooldowns.get(userId) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = Math.ceil((expirationTime - now) / 1000);
      return interaction.reply({
        content: `Woah woah, ${timeLeft} seconds cooldown remaining`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  cooldowns.set(userId, now);
  setTimeout(() => cooldowns.delete(userId), cooldownAmount);

  await interaction.deferReply();

  const productsMapping = await getProductsMapping();
  const productsList = Object.keys(productsMapping).map((code) => {
    return `- **${code}**: ${productsMapping[code]}`;
  });

  interaction.editReply(`Danh mục các sản phẩm:\n${productsList.join("\n")}`);
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: false,
};
