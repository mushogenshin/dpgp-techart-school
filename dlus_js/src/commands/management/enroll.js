import { getNumPendingTickets } from "../../firebase/firestore";

const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const MAX_PENDING_TICKETS_ALLOWED = 4;

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "register",
  description: "Báo nộp tiền học",
  options: [
    {
      name: "screenshot",
      description: "Screenshot giao dịch",
      type: ApplicationCommandOptionType.Attachment,
      required: false,
    },
    {
      name: "email",
      description: "Email dùng để access khoá học",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "product",
      description: "Mã số sản phẩm",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, client, _handler }) => {
  // check if user has pending tickets
  const numPendingTickets = await getNumPendingTickets(interaction.user);

  console.log(
    `User ${interaction.user.username} has ${numPendingTickets} pending tickets.`
  );

  // only proceed if user has less than the maximum allowed pending tickets
  if (numPendingTickets >= MAX_PENDING_TICKETS_ALLOWED) {
    await interaction.reply({
      content: `Số lượng request của bạn đã vượt quá giới hạn (${MAX_PENDING_TICKETS_ALLOWED}). 
Vui lòng chờ xử lý các request cũ trước khi tạo request mới.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const email = interaction.options.get("email");
  const product = interaction.options.get("product");
  // https://discord.js.org/docs/packages/discord.js/main/Attachment:Class
  const screenshot = interaction.options.get("screenshot");

  // // Send back a message with the same attachment
  // await interaction.reply({
  //   content: `TODO: create ticket for email: ${email.value}\nProduct: ${product.value}`,
  //   files: [screenshot.attachment],
  // });
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true,
};
