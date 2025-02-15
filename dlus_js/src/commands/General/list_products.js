import {
  getProductsMapping,
  prettifyProductsMapping,
} from "../../firestore/enrollments";
import { MODERATOR_IDS } from "../../../moderator_config";

const { MessageFlags, ApplicationCommandOptionType } = require("discord.js");

const COOLDOWN_AMOUNT_MS = 600 * 1000; // 10 minutes

// Per-user map
const cooldowns = new Map();

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "list",
  description: "Liệt kê các khoá học hoặc sự kiện 👽",
  // NOTE: this global command allows all contexts: guild, DM, private channel
  options: [
    {
      name: "events_only",
      description: "Sự kiện không thôi",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
    {
      name: "details",
      description: "Hiển thị chi tiết",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
    {
      name: "includes_expired",
      description: "Bao gồm cả những sản phẩm không còn hiện hành",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, _client, _handler }) => {
  await interaction.deferReply();
  const userId = interaction.user.id;

  if (!MODERATOR_IDS.includes(userId)) {
    const now = Date.now();

    if (cooldowns.has(userId)) {
      const expirationTime = cooldowns.get(userId) + COOLDOWN_AMOUNT_MS;

      if (now < expirationTime) {
        const timeLeft = Math.ceil((expirationTime - now) / 1000);
        return interaction.editReply({
          content: `:hourglass_flowing_sand: Woah woah, ${timeLeft} seconds cooldown remaining before you can use this command again.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    cooldowns.set(userId, now);
    setTimeout(() => cooldowns.delete(userId), COOLDOWN_AMOUNT_MS);
  }

  const eventsOnly = interaction.options.getBoolean("events_only") || false;
  const verbose = interaction.options.getBoolean("details") || false;
  const includesExpired =
    interaction.options.getBoolean("includes_expired") || false;

  const productsMapping = await getProductsMapping(eventsOnly, includesExpired);
  const header = eventsOnly
    ? "## :clock: Danh sách sự kiện ở DPGP:"
    : "## :pencil: Danh sách các sản phẩm ở DPGP:";

  interaction.editReply(
    `${header}\n\n${prettifyProductsMapping(productsMapping, verbose)}`
  );
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: false, // `false` makes this a global command
};
