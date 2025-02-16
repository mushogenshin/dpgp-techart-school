import { getEnrollmentDescFromProduct } from "../../firestore/enrollments";
import { queryApprovedTickets } from "../../firestore/tickets";
import { MODERATOR_IDS } from "../../../moderator_config";

const { MessageFlags, ApplicationCommandOptionType } = require("discord.js");

const COOLDOWN_AMOUNT_MS = 300 * 1000; // 5 minutes

// Per-user map
const cooldowns = new Map();

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "slot",
  description: "Xem số lượng còn trống cho sự kiện",
  // NOTE: this global command allows all contexts: guild, DM, private channel
  options: [
    {
      name: "event_code",
      description: "Mã sự kiện",
      type: ApplicationCommandOptionType.Number,
      required: true,
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

  const productCode = interaction.options.getNumber("event_code");
  const enrollmentDesc = await getEnrollmentDescFromProduct(productCode);

  if (!enrollmentDesc) {
    return interaction.editReply({
      content: `:woman_getting_face_massage: Không tìm thấy sự kiện có mã \`${productCode}\``,
      flags: MessageFlags.Ephemeral,
    });
  }

  if (!enrollmentDesc.max_allowed) {
    return interaction.editReply({
      content: `:woman_shrugging: Sản phẩm \`${productCode}\` không giới hạn số lượng`,
      flags: MessageFlags.Ephemeral,
    });
  }

  const approvedTickets = await queryApprovedTickets(productCode);
  const remainingSlots = enrollmentDesc.max_allowed - approvedTickets.length;

  interaction.editReply(
    `Sự kiện \`${productCode}\` (${enrollmentDesc.name}) còn **${remainingSlots}** chỗ trống`
  );
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: false, // `false` makes this a global command
};
